import { UpdateReceiverDto } from './dto/updateReceiver.dto';
import { CreateReceiverDto } from './dto/createReceiver.dto';
import { Injectable, Logger } from '@nestjs/common';
import { PromotionReceiverInfo } from './entities/promotionReceiverInfo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
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
      // const receiver = await this.promotionReceiverInfoRepository.findOne({
      //     where: {receiverId: id},
      //     relations: ['User']
      // });
      const receiver = await this.promotionReceiverInfoRepository.getOne(id);
      this.logger.log(`getOne ${JSON.stringify(receiver)}`);
      return receiver ? receiver : [];
    } catch (error) {
      this.logger.error(error);
    }
  }

  async save(receiverData: CreateReceiverDto, userId: string): Promise<void> {
    this.logger.log(`receiverData: ${JSON.stringify(receiverData)}, userId: ${userId}`);
    const { title, description, conditionText } = receiverData;

    try {
      const conditionJson = JSON.stringify(this.factorConverter.makeJsonCondition(conditionText));
      this.logger.log(`conditionJson: ${conditionJson}`);

      const registrantInfo = await this.userRepository.findOne({ where: { userId } });

      const createReceiverData = {
        title,
        description,
        userIdx: registrantInfo.idx,
        conditionText,
        conditionJson,
        validState: 1,
      };
      this.logger.log(`createReceiverData: ${JSON.stringify(createReceiverData)}`);

      await this.promotionReceiverInfoRepository.save(createReceiverData);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async update(receiverId: number, updateData: UpdateReceiverDto, userId: string): Promise<void> {
    const { title, description, conditionText } = updateData;

    try {
      const conditionJson = JSON.stringify(this.factorConverter.makeJsonCondition(conditionText));
      this.logger.log(`conditionJson: ${conditionJson}`);

      const registrantInfo = await this.userRepository.findOne({ where: { userId } });

      const updateReceiverData = {
        title,
        description,
        userIdx: registrantInfo.idx,
        conditionText,
        conditionJson,
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
      // await this.promotionReceiverInfoRepository.delete({ receiverId: receiverId });
      await this.promotionReceiverInfoRepository.delete(receiverIds);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async conditionPreview(conditionText: string): Promise<any> {
    try {
      return this.factorConverter.makeJsonCondition(conditionText);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
