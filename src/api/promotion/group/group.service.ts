import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PromotionReceiverGroupInfoRepository } from './repo/promotionReceiverGroupInfoRepository';
import { CsvConverter } from '../../../common/utils/csvConverter';

@Injectable()
export class GroupService {
  constructor(
    private readonly promotionReceiverGroupInfoRepository: PromotionReceiverGroupInfoRepository,
  ) {
  }

  private readonly logger = new Logger(GroupService.name);
  private readonly csvConverter = new CsvConverter();

  async create(file, body) {
    const { title, userIdx, groupNo } = body;

    try {
      const originalUnoArray = file.buffer.toString().split('\r\n').slice(1);

      const unoList = JSON.stringify(originalUnoArray);
      const unoCount = originalUnoArray.length;

      this.logger.log(`uno list: ${unoList}`);
      this.logger.log(`uno length: ${unoCount}`);

      const data = {
        title,
        groupNo: groupNo ? groupNo : null,
        userIdx,
        unoCount,
        unoList,
        validState: 1,
      };

      await this.promotionReceiverGroupInfoRepository.save(data);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(`${error}`);
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
      throw new InternalServerErrorException(error);
    }
  }

  async remove(ids) {
    try {
      await this.promotionReceiverGroupInfoRepository.updateValidState(ids);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getUnoList(idx) {
    try {
      return await this.promotionReceiverGroupInfoRepository.findUnoList(idx)
        .then((uno) => this.csvConverter.unoToCsv(uno.unoList))
        .catch(() => `uno`);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
