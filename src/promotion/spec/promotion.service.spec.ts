import { Test, TestingModule } from '@nestjs/testing';
import { PromotionService } from '../promotion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PromotionReceiverInfo } from '../entities/promotionReceiverInfo.entity';

class MockPromotionReceiverRepository {
  #data = [
    {
      receiver_id: 1,
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
    const data = this.#data.find((v) => v.receiver_id === id);
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
  let service: PromotionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionService, //{ provide: PromotionService, useClass: PromotionService }
        {
          provide: getRepositoryToken(PromotionReceiverInfo),
          useClass: MockPromotionReceiverRepository,
        },
      ],
    }).compile();

    service = module.get<PromotionService>(PromotionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('1번 프로모션 반환', async () => {
      const receiverId = 1;
      const result = await service.getOne(receiverId);
      expect(result).toEqual({
        receiver_id: 1,
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
      const result = await service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });
});