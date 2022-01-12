import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PromotionInfoRepository } from '../../../entities/repository/promotionInfoRepository';
import { FactorConverter } from '../../../common/utils/factorConverter';
import { PromotionReceiverInfoRepository } from '../../../entities/repository/promotionReceiverInfoRepository';

@Injectable()
export class ManagementService {
  constructor(
    private readonly promotionInfoRepository: PromotionInfoRepository,
    private readonly promotionReceiverInfoRepository: PromotionReceiverInfoRepository,
  ) {
  }

  private readonly factorConvertor = new FactorConverter();
  private readonly logger = new Logger(ManagementService.name);

  async save(data, files) {
    this.logger.log('save() start');
    try {
      const { description, receiverId, action, benefit } = data;
      const title = data.name;
      const promotionId = data.id;

      console.log(files);

      //조건 json: actions
      // const actionsJson = [
      //     {
      //         action: action,
      //         benefit: benefit,
      //     },
      // ];

      const actionsJson = [
        {
          action: JSON.parse(action),
          benefit: JSON.parse(benefit),
        },
      ];

      console.log(actionsJson);

      //display json 생성 정보
      // const displayCreateInfo = {
      //     android: data.android,
      //     ios: data.ios,
      //     pc: data.pc,
      //     mobile: data.mobile,
      // };
      const displayCreateInfo = {
        android: JSON.parse(data.android),
        ios: JSON.parse(data.ios),
        pc: JSON.parse(data.pc),
        mobile: JSON.parse(data.mobile),
      };

      console.log(displayCreateInfo);

      //조건 json: display
      const displayJson = await this.factorConvertor.makeJsonDisplay(displayCreateInfo);

      //condition,info 조건 불러오기
      const promotionInfo = await this.promotionReceiverInfoRepository.getOne(receiverId);
      this.logger.log(`promotionInfo ${JSON.stringify(promotionInfo)}`);
      const infoAndConditionJson = JSON.parse(promotionInfo.conditionJson);
      this.logger.log(`infoAndConditionJson ${JSON.stringify(infoAndConditionJson)}`);

      //최종 json 형식 만들기
      const finalJson = await this.factorConvertor.finalJsonForm(promotionId, infoAndConditionJson, actionsJson, displayJson);
      this.logger.log(`final json: ${JSON.stringify(finalJson)}`);

      const createData = {
        promotionId,
        title,
        description,
        receiverId,
        groupNo: promotionInfo.groupNo,
        conditionJson: JSON.stringify(finalJson),
        userIdx: 1,
      };
      await this.promotionInfoRepository.save(createData);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(idx) {
    try {
      this.logger.log('remove() start');
      await this.promotionInfoRepository.updateValidState(idx)
        .then(() => this.logger.log('remove() done'));
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getAll(findOpt) {
    this.logger.log('getAll() start');
    const target = {
      title: findOpt.title.replace(/^|$/g, '%'),
      description: findOpt.description.replace(/^|$/g, '%'),
      registrant: findOpt.registrant.replace(/^|$/g, '%'),
    };
    try {
      this.logger.log(`find target option: ${JSON.stringify(target)}`);
      return this.promotionInfoRepository.getAll(target);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
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
          userName: promotionInfo.userName,
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
      throw new InternalServerErrorException(error);
    }
  }

  async update(data) {
    try {
      this.logger.log('update() start');
      await this.promotionInfoRepository.update(data);
      this.logger.log('update() done');
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
