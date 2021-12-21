import { Test, TestingModule } from '@nestjs/testing';
import { PromotionService } from '../promotion.service';

describe('PromotionService', () => {
  let service: PromotionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromotionService],
    }).compile();

    service = module.get<PromotionService>(PromotionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  /*
  describe('save', () => {
    it('should save promotion info', () => {
      const beforeCreate = service.
    });
  });
*/

});
