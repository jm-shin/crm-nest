import { ReceiverService } from '../receiver.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../../model/entities/user.entity';
import { CreateReceiverDto } from '../dto/createReceiver.dto';
import { PromotionReceiverInfoRepository } from '../../../../model/repository/promotionReceiverInfo.repository';

class MockPromotionReceiverInfoRepository {
  #data = [
    {
      id: 1,
      title: '1번 제목',
      description: '1번 내용',
    },
  ]
  save(info, id) {
    return { message: 'success'}
  }
  getOne(id) {
   const data = this.#data.find((v) => v.id === id);
   if (data){
     return data;
   }
   return [];
  }
}

const mockUserRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn().mockReturnValue({
    idx: 1,
  }),
  softDelete: jest.fn(),
});

describe('ReceiverService', () => {
  let service: ReceiverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiverService,
        {
          provide: PromotionReceiverInfoRepository,
          useClass: MockPromotionReceiverInfoRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },

      ],
    }).compile();

    service = module.get<ReceiverService>(ReceiverService);
  });

  it('서비스는 정의되야 한다.', () => {
    expect(service).toBeDefined();
  });

  describe('save는', () => {
    beforeEach(async () => {

    });
    it('대상자 조건을 저장한다.', async () => {
      const receiverInfo: CreateReceiverDto = {
        title: '테스트용 제목',
        description: '테스트용 내용',
        conditionText: 'group=7 AND isauth=Y AND nonlogindays=357 AND nonloginoverorunder=p13',
      };
      expect(await service.save(receiverInfo, 'idx')).toEqual({ message: 'success' });
    });
  });

  describe('getOne는', () => {
    it('사용자 정보하나를 읽어온다. ', async () => {
      const id = 1;
      const response = {
        id: 1,
        title: '1번 제목',
        description: '1번 내용',
      };
      expect(await service.getOne(id)).toEqual(response);
    });
    it('사용자 정보가 없으면 []을 반환한다.', async () => {
      const id = 2;
      expect(await service.getOne(id)).toEqual([]);
    });
  });

});