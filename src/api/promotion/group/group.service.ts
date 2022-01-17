import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PromotionReceiverGroupInfoRepository } from '../../../model/repository/promotionReceiverGroupInfo.repository';
import { CsvConverter } from '../../../common/utils/csvConverter';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../model/entities/user.entity';
import { Repository } from 'typeorm';

const { parse } = require('json2csv');

@Injectable()
export class GroupService {
  constructor(
    private readonly promotionReceiverGroupInfoRepository: PromotionReceiverGroupInfoRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  private readonly logger = new Logger(GroupService.name);
  private readonly csvConverter = new CsvConverter();

  async create(file, body, userId) {
    const { title, groupNo } = body;

    try {
      const originalUnoArray = file.buffer.toString().split('\r\n').slice(1);

      const unoList = JSON.stringify(originalUnoArray);
      const unoCount = originalUnoArray.length;

      const registrantInfo = await this.userRepository.findOne({ where: { userId } });

      this.logger.log(`uno list: ${unoList}`);
      this.logger.log(`uno length: ${unoCount}`);

      const data = {
        title,
        groupNo: groupNo ? groupNo : null,
        userIdx: registrantInfo.idx,
        unoCount,
        unoList,
        validState: 1,
      };

      await this.promotionReceiverGroupInfoRepository.save(data);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getAll(info) {
    try {
      const data = {
        title: info.title.replace(/^|$/g, '%'),
        registrant: info.registrant.replace(/^$/, '%'),
        groupNo: info.groupNo.toString().replace(/^|$/g, '%'),
      };
      const groupList = await this.promotionReceiverGroupInfoRepository.find(data);
      this.logger.log(`groupList: ${JSON.stringify(groupList)}`);
      return groupList;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getOne(idx) {
    try {
      const groupInfo = await this.promotionReceiverGroupInfoRepository.findOne(idx);
      this.logger.log(`getOne() groupInfo: ${JSON.stringify(groupInfo)}`);
      return groupInfo ? groupInfo : [];
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(idx) {
    try {
      await this.promotionReceiverGroupInfoRepository.updateValidState(idx);
      this.logger.log('remove() done');
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getUnoList(idx) {
    try {
      return await this.promotionReceiverGroupInfoRepository.findUnoList(idx)
        .then((uno) => this.csvConverter.unoToCsv(uno.unoList))
        .catch(() => `uno`);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getGroupNumList() {
    try {
      this.logger.log('getGroupNumList()');
      const groupNoList = await this.promotionReceiverGroupInfoRepository.findGnoList()
        .then((list) => {
          const result = list.reduce((acc, cur, i) => {
            acc.push(cur.groupNo);
            return acc;
          }, []);
          return [...new Set(result)];
        });
      this.logger.log(`groupNoList: ${JSON.stringify(groupNoList)}`);
      return groupNoList;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
