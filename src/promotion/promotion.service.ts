import { UpdateReceiverDto } from './dto/updateReceiver.dto';
import { CreateReceiverDto } from './dto/createReceiver.dto';
import { Injectable, Logger } from '@nestjs/common';
import { PromotionReceiverInfo } from './entities/promotionReceiverInfo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import * as moment from 'moment';
import { FactorConverter } from '../common/utils/factorConverter';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PromotionService {
    constructor(
        @InjectRepository(PromotionReceiverInfo)
        private promotionReceiverInfoRepository: Repository<PromotionReceiverInfo>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    private readonly logger = new Logger(PromotionService.name);
    private factorConverter = new FactorConverter();

    async getAll(info): Promise<PromotionReceiverInfo[]> {
        this.logger.log(`getAll() info: ${JSON.stringify(info)}`);
        const data = {
            title: info.title.replace(/^|$/g, '%'),
            registrant: info.registrant.replace(/^$/,'%'),
        }
        const keys = ['title', 'registrant'];
        const values	= [data[keys[0]], data[keys[1]]];

        try {
            // const promotionInfoList = await this.promotionReceiverInfoRepository.find({ relations:['User'] });
            const promotionInfoList = await getRepository(PromotionReceiverInfo)
              .createQueryBuilder('r')
              .leftJoinAndSelect('r.User', 'u')
              .select([
                  'r.receiverId AS receiverId', 'r.title AS title', 'r.description AS description', 'u.userName AS registrant',
                  'r.groupNo AS groupNo', 'r.conditionText AS conditionText', 'r.conditionJson AS conditionJson',
                  'r.validState AS validState', 'date_format(r.updatedAt, "%Y-%m-%d %T") AS updatedAt', 'date_format(r.createdAt, "%Y-%m-%d %T") AS createdAt',
              ])
              .where(`r.title LIKE (:title) AND u.userName LIKE (:registrant)`, {title: values[0], registrant: values[1]})
              .getRawMany();

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
            const receiver = await getRepository(PromotionReceiverInfo)
              .createQueryBuilder('r')
              .leftJoinAndSelect('r.User', 'u')
              .select([
                  'r.receiverId AS receiverId', 'r.title AS title', 'r.description AS description',
                  'r.groupNo AS groupNo', 'r.conditionText AS conditionText', 'r.conditionJson AS conditionJson',
                  'r.validState AS validState', 'date_format(r.updatedAt, "%Y-%m-%d %T") AS updatedAt', 'date_format(r.createdAt, "%Y-%m-%d %T") AS createdAt',
                //user
                  'u.idx AS userIdx', 'u.userId AS userId', 'u.userName AS registrant', 'u.passwordUpdateAt AS passwordUpdateAt', 'u.opClass AS opClass',
                  'u.validState AS validState', 'u.mobile AS mobile', 'u.email AS email', 'u.department AS department', 'u.uno AS uno', 'u.download AS download',
                  'u.sendAlert AS sendAlert',
              ])
              .where('r.receiverId = :id', {id})
              .getRawOne();

            this.logger.log(`getOne ${JSON.stringify(receiver)}`);
            return receiver;
        } catch (error) {
            this.logger.error(error);
        }
    }

    async save(receiverData: CreateReceiverDto, userId: string) {
        this.logger.log(`receiverData: ${JSON.stringify(receiverData)}, userId: ${userId}`);
        const { title, description, conditionText } = receiverData;

        try {
            const conditionJson =  JSON.stringify(this.factorConverter.makeJsonCondition(conditionText));
            this.logger.log(`conditionJson: ${conditionJson}`);

            const registrantInfo = await this.userRepository.findOne({where: { userId }});

            const createReceiverData = {
                title,
                description,
                userIdx: registrantInfo.idx,
                conditionText,
                conditionJson,
                validState: 1,
            }
            this.logger.log(`createReceiverData: ${JSON.stringify(createReceiverData)}`);

            await this.promotionReceiverInfoRepository.save(createReceiverData);
        } catch (error) {
            this.logger.error(error);
        }
    }

    async update(receiverId: number, updateData: UpdateReceiverDto, userId: string) {
        const { title, description, conditionText } = updateData;

        try {
            const conditionJson = JSON.stringify(this.factorConverter.makeJsonCondition(conditionText));
            this.logger.log(`conditionJson: ${conditionJson}`);

            const registrantInfo = await this.userRepository.findOne({where: { userId }});

            const updateReceiverData = {
                title,
                description,
                userIdx: registrantInfo.idx,
                conditionText,
                conditionJson,
                updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            }
            this.logger.log( `updateReceiverData ${JSON.stringify(updateReceiverData)}`);

            await this.promotionReceiverInfoRepository.update({receiverId}, updateReceiverData);
        } catch (error) {
            this.logger.error(error);
        }
    }

    async delete(receiverId: number[]): Promise<void> {
        try {
            // await this.promotionReceiverInfoRepository.delete({ receiverId: receiverId });
            await getRepository(PromotionReceiverInfo)
              .createQueryBuilder()
              .delete()
              .where('receiver_id IN (:ids)', {ids: receiverId})
              .execute();
        } catch (error) {
            this.logger.error(error);
        }
    }

    async conditionPreview(conditionText: string): Promise<any> {
        try {
            return { condition: this.factorConverter.makeJsonCondition(conditionText) };
        } catch (error) {
            this.logger.error(error);
        }
    }
}
