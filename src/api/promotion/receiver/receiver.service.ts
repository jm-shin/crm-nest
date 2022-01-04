import { UpdateReceiverDto } from './dto/updateReceiver.dto';
import { CreateReceiverDto } from './dto/createReceiver.dto';
import { Injectable, Logger } from '@nestjs/common';
import { PromotionReceiverInfo } from './entities/promotionReceiverInfo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import moment from 'moment';
import { FactorConverter } from '../../../common/utils/factorConverter';
import { User } from '../../user/entities/user.entity';
import { PromotionReceiverInfoRepository } from './repo/promotionReceiverInfoRepository';

@Injectable()
export class ReceiverService {
  constructor(
    private readonly promotionReceiverInfoRepository: PromotionReceiverInfoRepository,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
  }

  private readonly logger = new Logger(ReceiverService.name);
  private factorConverter = new FactorConverter();

  async getAll(info): Promise<PromotionReceiverInfo[]> {
    this.logger.log(`getAll() info: ${JSON.stringify(info)}`);
    const data = {
      title: info.title.replace(/^|$/g, '%'),
      registrant: info.registrant.replace(/^$/, '%'),
    };
    try {
      const promotionInfoList = await this.promotionReceiverInfoRepository.getAll(data);
      this.logger.log(`getAll() result: ${JSON.stringify(promotionInfoList)}`);
      return promotionInfoList;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getOne(id: number): Promise<PromotionReceiverInfo> {
    try {
      this.logger.log(`getOne() target id: ${id}`);
      const receiver = await this.promotionReceiverInfoRepository.getOne(id);
      console.log(typeof receiver.idx);
      this.logger.log(`getOne() result: ${JSON.stringify(receiver)}`);
      return receiver ? receiver : [];
    } catch (error) {
      this.logger.error(error);
    }
  }

  async save(receiverData: CreateReceiverDto, userId: string): Promise<void> {
    this.logger.log(`receiverData: ${JSON.stringify(receiverData)}, userId: ${userId}`);
    const { title, description, conditionText } = receiverData;

    try {
      const factorConvResult = this.factorConverter.makeJsonCondition(conditionText);
      const groupNo = factorConvResult.info.group === '' ? 0 : parseInt(factorConvResult.info.group);
      const conditionJson = JSON.stringify(factorConvResult);
      this.logger.log(`conditionJson: ${conditionJson}`);

      const registrantInfo = await this.userRepository.findOne({ where: { userId } });

      const createReceiverData = {
        title,
        description,
        userIdx: registrantInfo.idx,
        conditionText,
        conditionJson,
        validState: 1,
        groupNo,
      };
      this.logger.log(`createReceiverData: ${JSON.stringify(createReceiverData)}`);

      await this.promotionReceiverInfoRepository.save(createReceiverData);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async update(receiverId: number, updateData: UpdateReceiverDto, userId: string): Promise<void> {
    this.logger.log(`update() start. receiverId: ${receiverId}, updateData: ${JSON.stringify(receiverId)}`);
    const { title, description, conditionText } = updateData;

    try {
      const factorConvResult = this.factorConverter.makeJsonCondition(conditionText);
      const groupNo = factorConvResult.info.group === '' ? 0 : parseInt(factorConvResult.info.group);
      const conditionJson = JSON.stringify(factorConvResult);
      this.logger.log(`conditionJson: ${conditionJson}`);

      const registrantInfo = await this.userRepository.findOne({ where: { userId } });

      const updateReceiverData = {
        title,
        description,
        userIdx: registrantInfo.idx,
        conditionText,
        conditionJson,
        groupNo,
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      this.logger.log(`updateReceiverData ${JSON.stringify(updateReceiverData)}`);

      await this.promotionReceiverInfoRepository.update({ receiverId }, updateReceiverData);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async delete(receiverIds: number[]): Promise<void> {
    try {
      await this.promotionReceiverInfoRepository.updateValidState(receiverIds);
      this.logger.log(`delete done.(${JSON.stringify(receiverIds)} SET valid state = 0)`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async conditionPreview(conditionText: string): Promise<any> {
    try {
      this.logger.log('conditionPreview');
      return this.factorConverter.makeJsonCondition(conditionText);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
