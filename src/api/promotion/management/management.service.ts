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

  async save(data) {
    this.logger.log('save() start');
    try {
      const {
        promotionId, title, description, receiverId,
        groupNo, conditionJson,
      } = data;

      //조건 json: actions
      const actions = await this.factorConvertor.makeJsonAction(data.actions);
      //조건 json: display
      const display = await this.factorConvertor

      //condition,info 조건 불러오기
      const JsonInfoAndCondition = await this.promotionReceiverInfoRepository.getOne(receiverId);
      console.log(JsonInfoAndCondition);

      //최종 json 형식 만들기
      const finalJson = this.factorConvertor.finalJsonForm(promotionId, actions, JsonInfoAndCondition.conditionJson);

      const createData = {
        promotionId,
        title,
        description,
        receiverId,
        groupNo,
        conditionJson,
        userIdx: 1,
        actions: JSON.stringify(actions),
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

      if (promotionInfo.actions) {
        const actions = await JSON.parse(promotionInfo.actions);
        delete promotionInfo.actions;
        promotionInfo.actions = actions;
      }
      return promotionInfo ? promotionInfo : [];
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
