import { Test, TestingModule } from '@nestjs/testing';
import { ReceiverService } from '../receiver.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PromotionReceiverInfo } from '../entities/promotionReceiverInfo.entity';

class MockPromotionReceiverRepository {
  #data = [
    {
      idx: 1,
      title: "제목",
      description: "내용",
      user_idx: 1,
      group_no: 1,
      condition_text: "조건문",
      condition_json: "json",
      valid_state: 1
    }
  ];
  findOne({ receiver_id: id }){
    const data = this.#data.find((v) => v.idx === id);
    if (data) {
      return data;
    }
    return null;
  }
  find() {
    return this.#data;
  }
}

describe('PromotionService', () => {
  let service: ReceiverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiverService, //{ provide: ReceiverService, useClass: ReceiverService }
        {
          provide: getRepositoryToken(PromotionReceiverInfo),
          useClass: MockPromotionReceiverRepository,
        },
      ],
    }).compile();

    service = module.get<ReceiverService>(ReceiverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('1번 프로모션 반환', async () => {
      const receiverId = 1;
      const result = await service.getOne(receiverId);
      expect(result).toEqual({
        idx: 1,
        title: "제목",
        description: "내용",
        user_idx: 1,
        group_no: 1,
        condition_text: "조건문",
        condition_json: "json",
        valid_state: 1
      });
    });

    it('getAll()시 Array 반환', async () => {
      const result = await service.getAll({title:'title', registrant:'registrant'});
      expect(result).toBeInstanceOf(Array);
    });
  });
});