import { HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PromotionInfoRepository } from '../../../model/repository/promotionInfo.repository';
import { FactorConverter } from '../../../common/utils/factorConverter';
import { PromotionReceiverInfoRepository } from '../../../model/repository/promotionReceiverInfo.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../model/entities/user.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { BlobServiceClient, AnonymousCredential } from "@azure/storage-blob";

@Injectable()
export class ManagementService {
  constructor(
    private readonly promotionInfoRepository: PromotionInfoRepository,
    private readonly promotionReceiverInfoRepository: PromotionReceiverInfoRepository,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
  }

  private readonly factorConvertor = new FactorConverter();
  private readonly logger = new Logger(ManagementService.name);

  private async createImageUrlEachDevice(data, uploadFileList) {
    let android = JSON.parse(data.android);
    let ios = JSON.parse(data.ios);
    let pc = JSON.parse(data.pc);
    let mobile = JSON.parse(data.mobile);
    const imgUrl = process.env.LOAD_LOCATION || '';
    for (const file of Object.keys(uploadFileList)) {
      const filename = uploadFileList[file][0].filename;
      const NameArr = file.split('_');
      const device = NameArr[0];
      const type = NameArr[3] ? `${NameArr[1]}_${NameArr[2]}` : NameArr[1];
      if (device == 'android') {
        android[type][NameArr[(NameArr.length - 1)]] = `${imgUrl}${filename}`;
      } else if (device == 'ios') {
        ios[type][NameArr[(NameArr.length - 1)]] = `${imgUrl}${filename}`;
      } else if (device == 'mobile') {
        mobile[type][NameArr[(NameArr.length - 1)]] = `${imgUrl}${filename}`;
      } else if (device == 'pc') {
        pc[type][NameArr[(NameArr.length - 1)]] = `${imgUrl}${filename}`;
      }
    }
    return { android, ios, pc, mobile };
  }

  async save(data, uploadFiles, userId) {
    let azureFileName = [];
    this.logger.log('save() start');

    try {
      const title = data.name;
      const description = data.description;
      const receiverId = parseInt(data.receiverId);
      const promotionId = data.promotionId;
      const action = JSON.parse(data.action);
      const benefit = JSON.parse(data.benefit);
      //add image url
      const { android, ios, pc, mobile } = await this.createImageUrlEachDevice(data, uploadFiles);

      //create actions json
      const actionsJson = [
        {
          action: action,
          benefit: benefit,
        },
      ];

      //create display json
      const displayCreateInfo = {
        android: android,
        ios: ios,
        pc: pc,
        mobile: mobile,
      };

      //condition: display
      const displayJson = await this.factorConvertor.makeJsonDisplay(displayCreateInfo);

      //get condition,info
      const promotionInfo = await this.promotionReceiverInfoRepository.getOne(receiverId);
      this.logger.log(`promotionInfo ${JSON.stringify(promotionInfo)}`);

      const infoAndConditionJson = JSON.parse(promotionInfo.conditionJson);
      infoAndConditionJson.info.name = title;
      infoAndConditionJson.info.description = description;
      this.logger.log(`infoAndConditionJson ${JSON.stringify(infoAndConditionJson)}`);

      //final json form
      const finalJson = await this.factorConvertor.finalJsonForm(promotionId, infoAndConditionJson, actionsJson, displayJson);
      this.logger.log(`final json: ${JSON.stringify(finalJson)}`);

      const registrantInfo = await this.userRepository.findOne({ where: { userId } });

      const createData = {
        promotionId,
        title,
        description,
        receiverId,
        groupNo: promotionInfo.groupNo,
        conditionJson: JSON.stringify(finalJson),
        userIdx: registrantInfo.idx,
      };

      //image file upload to azure server
      if (uploadFiles) {
        for (const file in uploadFiles) {
          azureFileName.push(uploadFiles[file][0].filename);
        }
      }

      //TODO: uploadToAzureContainer()

      // if (azureFileName.length > 0) {
      //   const account = process.env.EXT_AZURE_ACCOUNT;
      //   const sas = process.env.EXT_AZURE_SAS_KEY;
      //   const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${sas}`);
      //
      //   const containerName = 'campaign';
      //
      //   const containerClient = blobServiceClient.getContainerClient(containerName);
      //   const blobName = req.file.originalname;
      //   const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      //
      //   const uploadBlobResponse = await blockBlobClient.uploadFile(req.file.path);
      //
      //   //add image upload
      //   await targetImgURL.forEach((url) => {
      //     his.logger.log(`image upload to azure server. image path: ${url}`);
      //     const response = blockBlobClient.uploadFile(url);
      //     this.logger.log(response);
      //   });
      //
      //   this.logger.log(`upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
      //   this.logger.log(`uploadBlobResponse: ${JSON.stringify(uploadBlobResponse)}`);
      // }

      await this.promotionInfoRepository.save(createData);
    } catch (error) {
      this.logger.error(error);
      if (error.errno === 1062) {
        throw new HttpException('ER_DUP_ENTRY', 409);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async remove(idx) {
    try {
      this.logger.log('remove() start');
      await this.promotionInfoRepository.updateValidState(idx)
        .then(() => this.logger.log('remove() done'));
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getAll(findOpt) {
    this.logger.log('getAll() start');
    const target = {
      title: findOpt.title.replace(/^|$/g, '%'),
      description: findOpt.description.replace(/^|$/g, '%'),
      registrant: findOpt.registrant.replace(/^|$/g, '%'),
      promotionId: findOpt.promotionId.replace(/^|$/g, '%'),
    };
    try {
      this.logger.log(`find target option: ${JSON.stringify(target)}`);
      return this.promotionInfoRepository.getAll(target);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getOne(idx) {
    try {
      this.logger.log(`getOne() start - promotion idx: ${idx}`);

      let promotionInfo = await this.promotionInfoRepository.getOne(idx);
      if (!promotionInfo) {
        this.logger.log('Not Found promotion info');
        throw new NotFoundException();
      }

      this.logger.log(`promotionInfo: ${JSON.stringify(promotionInfo)}`);

      let promotionInfoResponseForm;
      if (promotionInfo) {
        const condition = JSON.parse(promotionInfo.conditionJson);
        const action = condition.actions[0].action;
        const benefit = condition.actions[0].benefit;

        const android = condition.display[0].devices[0];
        const ios = condition.display[0].devices[1];
        const mobile = condition.display[0].devices[2];
        const pc = condition.display[0].devices[3];

        //이미지 파일명 추출
        async function findName(device, areaType) {
          const data = device.areas; //배열
          const arr = data.filter((item) => item.areatype == areaType);
          const imageURL = arr[0]?.areaitems[0]?.image;
          if (imageURL) {
            const split = imageURL.split('/');
            return split[split.length - 1];
          } else {
            return '';
          }
        }

        //아이콘 파일명 추출
        async function findIconName(device, areaType) {
          const data = device.areas;
          const arr = data.filter((item) => item.areatype == areaType);
          const imageURL = arr[0]?.areaitems[0]?.icon;
          if (imageURL) {
            const split = imageURL.split('/');
            return split[split.length - 1];
          } else {
            return '';
          }
        }

        //아래 기본 Form 형태로 데이터가 있으면 채우고, 클라이언트쪽으로 응답.
        async function makeSendForm(device) {
          const typeArr = ['layerpopup', 'homeband', 'lnbtoptext', 'lnbtopbutton', 'voucher_index'];
          const deviceArea = device.areas;
          let basicForm = {
            layerpopup: {
              text: '',
              color: '',
              url: '',
            },
            homeband: {
              text: '',
              color: '',
              url: '',
            },
            lnbtoptext: {
              text: '',
              color: '',
              url: '',
            },
            lnbtopbutton: {
              text: '',
              color: '',
              url: '',
            },
            voucher_index: {
              text: '',
              color: '',
              url: '',
            },
            floating_banner: {
              startColor: '',
              endColor: '',
              icon: '',
              iconalt: '',
              text: '',
              url: '',
            },
          };
          deviceArea.forEach((area) => {
            typeArr.forEach((areaType) => {
              if (area.areatype == areaType) {
                basicForm[areaType] = {
                  text: area.areaitems[0].text ? area.areaitems[0].text : '',
                  color: area.areaitems[0].color ? area.areaitems[0].color : '',
                  url: area.areaitems[0].url ? area.areaitems[0].url : '',
                };
              } else if (area.areatype == 'floating_banner') {
                basicForm.floating_banner = {
                  startColor: area.areaitems[0].startColor ? area.areaitems[0].startColor : '',
                  endColor: area.areaitems[0].endColor ? area.areaitems[0].endColor : '',
                  icon: area.areaitems[0].icon ? area.areaitems[0].icon : '',
                  iconalt: area.areaitems[0].iconalt ? area.areaitems[0].iconalt : '',
                  text: area.areaitems[0].text ? area.areaitems[0].text : '',
                  url: area.areaitems[0].url ? area.areaitems[0].url : '',
                };
              }
            });
          });
          return basicForm;
        };

        promotionInfoResponseForm = {
          idx: promotionInfo.idx,
          promotionId: promotionInfo.promotionId,
          receiverId: parseInt(promotionInfo.receiverId),
          name: promotionInfo.title,
          description: promotionInfo.description,
          registrant: promotionInfo.registrant,
          email: promotionInfo.email,
          groupNo: promotionInfo.groupNo,
          action: action,
          benefit: benefit,
          android: await makeSendForm(android),
          ios: await makeSendForm(ios),
          mobile: await makeSendForm(mobile),
          pc: await makeSendForm(pc),
          android_layerpopup_image: await findName(android, 'layerpopup'),
          android_lnbtoptext_image: await findName(android, 'lnbtoptext'),
          android_lnbtopbutton_image: await findName(android, 'lnbtopbutton'),
          android_homeband_image: await findName(android, 'homeband'),
          android_voucher_index_image: await findName(android, 'voucher_index'),
          ios_layerpopup_image: await findName(ios, 'layerpopup'),
          ios_lnbtoptext_image: await findName(ios, 'lnbtoptext'),
          ios_lnbtopbutton_image: await findName(ios, 'lnbtopbutton'),
          ios_homeband_image: await findName(ios, 'homeband'),
          ios_voucher_index_image: await findName(ios, 'voucher_index'),
          pc_layerpopup_image: await findName(pc, 'layerpopup'),
          pc_lnbtoptext_image: await findName(pc, 'lnbtoptext'),
          pc_lnbtopbutton_image: await findName(pc, 'lnbtopbutton'),
          pc_homeband_image: await findName(pc, 'homeband'),
          pc_voucher_index_image: await findName(pc, 'voucher_index'),
          mobile_layerpopup_image: await findName(mobile, 'layerpopup'),
          mobile_lnbtoptext_image: await findName(mobile, 'lnbtoptext'),
          mobile_lnbtopbutton_image: await findName(mobile, 'lnbtopbutton'),
          mobile_homeband_image: await findName(mobile, 'homeband'),
          mobile_voucher_index_image: await findName(mobile, 'voucher_index'),
          //icon
          android_floating_banner_icon: await findIconName(android, 'floating_banner'),
          ios_floating_banner_icon: await findIconName(ios, 'floating_banner'),
          mobile_floating_banner_icon: await findIconName(mobile, 'floating_banner'),
          pc_floating_banner_icon: await findIconName(pc, 'floating_banner'),
        };
        this.logger.log(`getOne() response: ${JSON.stringify(promotionInfoResponseForm)}`);
      }
      return promotionInfo ? promotionInfoResponseForm : [];
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async update(data, uploadFiles, userId) {
    try {
      this.logger.log('update() start');

      const title = data.name;
      const description = data.description;
      const receiverId = parseInt(data.receiverId);
      const promotionId = data.promotionId;
      const action = JSON.parse(data.action);
      const benefit = JSON.parse(data.benefit);

      //test
      const uploadedFileNameList = await this.getUploadedFileNameList(data);
      Object.assign(uploadFiles, ...uploadedFileNameList);

      //create img url
      const { android, ios, pc, mobile } = await this.createImageUrlEachDevice(data, uploadFiles);

      const actionsJson = [
        {
          action: action,
          benefit: benefit,
        },
      ];

      const displayCreateInfo = {
        android: android,
        ios: ios,
        pc: pc,
        mobile: mobile,
      };

      const displayJson = await this.factorConvertor.makeJsonDisplay(displayCreateInfo);

      const promotionInfo = await this.promotionReceiverInfoRepository.getOne(receiverId);
      this.logger.log(`promotionInfo ${JSON.stringify(promotionInfo)}`);

      const infoAndConditionJson = JSON.parse(promotionInfo.conditionJson);
      infoAndConditionJson.info.name = title;
      infoAndConditionJson.info.description = description;
      this.logger.log(`infoAndConditionJson ${JSON.stringify(infoAndConditionJson)}`);

      const finalJson = await this.factorConvertor.finalJsonForm(promotionId, infoAndConditionJson, actionsJson, displayJson);
      this.logger.log(`final json: ${JSON.stringify(finalJson)}`);

      const registrantInfo = await this.userRepository.findOne({ where: { userId } });

      const updateData = {
        promotionId,
        title,
        description,
        receiverId,
        groupNo: promotionInfo.groupNo,
        conditionJson: JSON.stringify(finalJson),
        userIdx: registrantInfo.idx,
      };

      this.logger.log(updateData);

      await this.promotionInfoRepository.update(updateData);

      this.logger.log('update() done');
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getPreview(data, uploadFiles) {
    this.logger.log('getPreview() start');

    try {
      const title = data.name;
      const description = data.description;
      const receiverId = parseInt(data.receiverId);
      const promotionId = data.id;
      const action = JSON.parse(data.action);
      const benefit = JSON.parse(data.benefit);

      //기존 image는 파일이 아닌 파일명(String)으로 받음.
      const uploadedFileNameList = await this.getUploadedFileNameList(data);
      Object.assign(uploadFiles, ...uploadedFileNameList);

      //uploadedFileNameList를 포함한 uploadFiles이 매개변수로 와야함.
      const { android, ios, pc, mobile } = await this.createImageUrlEachDevice(data, uploadFiles);

      const actionsJson = [
        {
          action: action,
          benefit: benefit,
        },
      ];

      const displayCreateInfo = {
        android: android,
        ios: ios,
        pc: pc,
        mobile: mobile,
      };

      const displayJson = await this.factorConvertor.makeJsonDisplay(displayCreateInfo);
      const promotionInfo = await this.promotionReceiverInfoRepository.getOne(receiverId);
      let infoAndConditionJson = JSON.parse(promotionInfo.conditionJson);

      infoAndConditionJson.info.name = title;
      infoAndConditionJson.info.description = description;

      const finalJson = await this.factorConvertor.finalJsonForm(promotionId, infoAndConditionJson, actionsJson, displayJson);

      return finalJson;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async registerJSON(file, userId) {
    this.logger.log('registerJSON() start');
    try {
      const obj = JSON.parse(file.buffer.toString());
      console.log(obj);
      this.logger.log(JSON.stringify(obj));
      const info = obj.info;
      const registrantInfo = await this.userRepository.findOne({ where: { userId } });

      const createData = {
        promotionId: obj.id,
        title: info.name,
        description: info.description ? info.description : '',
        userIdx: registrantInfo.idx,
        receiverId: 0,
        groupNo: info.group ? info.group : 0,
        conditionJson: JSON.stringify(obj),
        progress_state: 0,
      };
      await this.promotionInfoRepository.save(createData);
    } catch (error) {
      this.logger.error(error);
      if (error.errno === 1062) {
        throw new HttpException('ER_DUP_ENTRY', 409);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getDownloadPromotionJson(promotionId) {
    this.logger.log('download promotion json file start');
    try {
      const conditionJson = await this.promotionInfoRepository.getOne(promotionId)
        .then((info) => info.conditionJson);
      return JSON.parse(conditionJson);
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException();
    }
  }

  async getUploadedFileNameList(data) {
    let acc = [];
    for (const [key, value] of Object.entries(data)) {
      if (key.includes('image') && value !== '') {
        acc.push({ [key]: [{ filename: value }] });
      }
    }
    return acc;
  }

  async distributePromotionJson(idx) {
    interface promotionDto {
      actions: [],
      condition: [],
      display: [],
      id: string,
      info: object
    }

    this.logger.log('distributePromotionJson() start');

    try {
      // idx > 프로모션 정보조회해서 data set
      const promotionData = await this.promotionInfoRepository.getOne(idx);
      const { id, info, actions, condition, display } = promotionData;
      const promotion: promotionDto = {
        actions,
        condition,
        display,
        id,
        info,
      };

      if (!promotionData) {
        throw new NotFoundException('프로모션 정보가 없습니다.');
      }

      /**
       * http request post api
       * "/bill/promotion/regist/{promotionId}"
       * @Param {string} promotionId - 등록할 프로모션아이디
       */
      const url = 'http://apis.local.wavve.com/bill/promotion/regist/';

      const config = {
        baseURL: url,
        header: [
          { 'Authorization': 'Bearer' + '' },
        ],
        param: {
          promotionId: id,
        },
        data: {
          promotion: promotion,
        },
        timeout: 1000,
      };

      const response = await axios.post(url, [config]);

      if (!response) {
        throw new HttpException('외부 API 요청 오류', 400);
      }

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async uploadToAzureContainer() {
    // Enter your storage account name and SAS
    const account = process.env.ACCOUNT_NAME || "<account name>";
    const accountSas = process.env.ACCOUNT_SAS || "<account SAS>";

    // List containers
    const blobServiceClient = new BlobServiceClient(
      // When using AnonymousCredential, following url should include a valid SAS or support public access
      `https://${account}.blob.core.windows.net${accountSas}`,
      new AnonymousCredential()
    );

    console.log("Containers:");
    for await (const container of blobServiceClient.listContainers()) {
      console.log(`- ${container.name}`);
    }

    // Create a container
    const containerName = `newcontainer${new Date().getTime()}`;
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const createContainerResponse = await containerClient.create();
    console.log(`Created container ${containerName} successfully`, createContainerResponse.requestId);

    // Delete container
    await containerClient.delete();

    console.log("Deleted container:", containerClient.containerName);
  }
}
