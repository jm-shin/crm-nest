import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PromotionInfoRepository } from './repo/promotionInfoRepository';

@Injectable()
export class ManagementService {
  constructor(
    private readonly promotionInfoRepository: PromotionInfoRepository,
  ) {
  }

  private readonly logger = new Logger(ManagementService.name);

  async save(data) {
    try {
      const { promotionId, title, description, receiverId, groupNo, conditionJson } = data;
      const createData = {
        promotionId,
        title,
        description,
        receiverId,
        groupNo,
        conditionJson,
        userIdx: 1,
      };
      await this.promotionInfoRepository.save(createData);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

}
