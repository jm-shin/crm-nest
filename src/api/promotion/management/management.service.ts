import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PromotionInfoRepository } from '../../../model/repository/promotionInfo.repository';
import { FactorConverter } from '../../../common/utils/factorConverter';
import { PromotionReceiverInfoRepository } from '../../../model/repository/promotionReceiverInfo.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../model/entities/user.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';

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

  async save(data, uploadFiles, userId) {
    this.logger.log('save() start');
    try {
      const title = data.name;
      const description = data.description;
      const receiverId = parseInt(data.receiverId);
      const promotionId = data.id;
      const imgUrl = process.env.LOAD_LOCATION || '';

      //json parse twice
      const action = JSON.parse(JSON.parse(data.action));
      const benefit = JSON.parse(JSON.parse(data.benefit));
      let android = JSON.parse(JSON.parse(data.android));
      let ios = JSON.parse(JSON.parse(data.ios));
      let pc = JSON.parse(JSON.parse(data.pc));
      let mobile = JSON.parse(JSON.parse(data.mobile));

      //add image url
      if (uploadFiles) {
        for (const file of Object.keys(uploadFiles)) {
          const filename = uploadFiles[file][0].filename;
          const NameArr = file.replace('_image', '').split('_');
          const device = NameArr[0];
          const type = NameArr[2] ? `${NameArr[1]}_${NameArr[2]}` : NameArr[1];
          if (device == 'android') {
            android[type].image = `${imgUrl}${filename}`;
          } else if (device == 'ios') {
            ios[type].image = `${imgUrl}${filename}`;
          } else if (device == 'mobile') {
            mobile[type].image = `${imgUrl}${filename}`;
          } else if (device == 'pc') {
            pc[type].image = `${imgUrl}${filename}`;
          }
        }
      }

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

      this.logger.log(`promotionInfo: ${JSON.stringify(promotionInfo)}`);

      let promotionInfoResponseForm;
      if (promotionInfo) {
        const condition = JSON.parse(promotionInfo.conditionJson);
        promotionInfoResponseForm = {
          idx: promotionInfo.idx,
          name: promotionInfo.title,
          description: promotionInfo.description,
          registrant: promotionInfo.registrant,
          email: promotionInfo.email,
          id: promotionInfo.promotionId,
          receiverId: promotionInfo.receiverId,
          groupNo: promotionInfo.groupNo,
          actions: condition.actions[0].action,
          benefit: condition.actions[0].benefit,
          android: condition.display[0].devices[0],
          ios: condition.display[0].devices[1],
          mobile: condition.display[0].devices[2],
          pc: condition.display[0].devices[3],
        };
        this.logger.log(`getOne() response: ${JSON.stringify(promotionInfoResponseForm)}`);
      }

      return promotionInfo ? promotionInfoResponseForm : [];
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async update(data, uploadFiles, userId) {
    try {
      this.logger.log('update() start');

      const title = data.name;
      const description = data.description;
      const receiverId = parseInt(data.receiverId);
      const promotionId = data.id;
      const imgUrl = process.env.LOAD_LOCATION || '';

      const action = JSON.parse(JSON.parse(data.action));
      const benefit = JSON.parse(JSON.parse(data.benefit));
      let android = JSON.parse(JSON.parse(data.android));
      let ios = JSON.parse(JSON.parse(data.ios));
      let pc = JSON.parse(JSON.parse(data.pc));
      let mobile = JSON.parse(JSON.parse(data.mobile));

      if (uploadFiles) {
        for (const file of Object.keys(uploadFiles)) {
          const filename = uploadFiles[file][0].filename;
          const NameArr = file.replace('_image', '').split('_');
          const device = NameArr[0];
          const type = NameArr[2] ? `${NameArr[1]}_${NameArr[2]}` : NameArr[1];
          if (device == 'android') {
            android[type].image = `${imgUrl}${filename}`;
          } else if (device == 'ios') {
            ios[type].image = `${imgUrl}${filename}`;
          } else if (device == 'mobile') {
            mobile[type].image = `${imgUrl}${filename}`;
          } else if (device == 'pc') {
            pc[type].image = `${imgUrl}${filename}`;
          }
        }
      }

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
      const imgUrl = process.env.LOAD_LOCATION || '';
      const receiverId = parseInt(data.receiverId);
      const promotionId = data.id;

      const action = JSON.parse(JSON.parse(data.action));
      const benefit = JSON.parse(JSON.parse(data.benefit));
      let android = JSON.parse(JSON.parse(data.android));
      let ios = JSON.parse(JSON.parse(data.ios));
      let pc = JSON.parse(JSON.parse(data.pc));
      let mobile = JSON.parse(JSON.parse(data.mobile));

      if (uploadFiles) {
        for (const file of Object.keys(uploadFiles)) {
          const filename = uploadFiles[file][0].filename;
          fs.unlinkSync(`${process.env.UPLOAD_LOCATION}/${filename}`);
          const NameArr = file.replace('_image', '').split('_');
          const device = NameArr[0];
          const type = NameArr[2] ? `${NameArr[1]}_${NameArr[2]}` : NameArr[1];
          if (device == 'android') {
            android[type].image = `${imgUrl}${filename}`;
          } else if (device == 'ios') {
            ios[type].image = `${imgUrl}${filename}`;
          } else if (device == 'mobile') {
            mobile[type].image = `${imgUrl}${filename}`;
          } else if (device == 'pc') {
            pc[type].image = `${imgUrl}${filename}`;
          }
        }
      }

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
      this.logger.log(JSON.stringify(obj));
      const info = obj.info;
      const registrantInfo = await this.userRepository.findOne({ where: { userId } });

      const createData = {
        promotionId: obj.id,
        title: info.name,
        description: info.description,
        userIdx: registrantInfo.idx,
        receiverId: 0,
        groupNo: info.group,
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
}
