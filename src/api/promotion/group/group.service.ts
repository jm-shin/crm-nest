import { Injectable, Logger } from '@nestjs/common';
import { PromotionReceiverGroupInfoRepository } from './repo/promotionReceiverGroupInfoRepository';

@Injectable()
export class GroupService {
  constructor(
    private readonly promotionReceiverGroupInfoRepository: PromotionReceiverGroupInfoRepository,
  ) {
  }

  private readonly logger = new Logger(GroupService.name);

  async create(file, body) {
    const { title, userIdx, groupNo } = body;
    const originalUnoArray = file.buffer.toString().split('\r\n').slice(1);

    const unoList = JSON.stringify(originalUnoArray);
    const unoCount = originalUnoArray.length;

    this.logger.log(`uno list: ${unoList}`);
    this.logger.log(`uno length: ${unoCount}`);

    const data = {
      title,
      groupNo: groupNo? groupNo : null,
      userIdx,
      unoCount,
      unoList,
      validState: 1
    };
    try {
      return await this.promotionReceiverGroupInfoRepository.save(data);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getAll(info) {
    try {
      const data = {
        title: info.title.replace(/^|$/g, '%'),
        registrant: info.registrant.replace(/^$/, '%'),
      };
      return await this.promotionReceiverGroupInfoRepository.find(data);
    } catch (error) {
      this.logger.error(error);
    }
  }

}
