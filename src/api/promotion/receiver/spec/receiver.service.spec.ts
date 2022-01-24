import { ReceiverService } from '../receiver.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../../model/entities/user.entity';
import { CreateReceiverDto } from '../dto/createReceiver.dto';
import { PromotionReceiverInfoRepository } from '../../../../model/repository/promotionReceiverInfo.repository';
import { UpdateReceiverDto } from '../dto/updateReceiver.dto';

class MockPromotionReceiverInfoRepository {
  #data = [
    {
      id: 1,
      title: '1번 제목',
      description: '1번 내용',
      registrant: '관리자',
    },
    {
      id: 2,
      title: '2번 제목',
      description: '2번 내용',
      registrant: '관리자2',
    },
  ];

  save(info, id) {
    return { message: 'success' };
  }

  getOne(id) {
    const data = this.#data.find((v) => v.id === id);
    if (data) {
      return data;
    }
    return [];
  }

  getAll(info) {
    const title = info.title.replace(/%/g, '');
    const registrant = info.registrant.replace(/%/g, '');
    return this.#data.reduce((acc, cur) => {
      if (title !== '' && cur.title.includes(title)) {
        acc.push(cur);
      } else if (registrant !== '' && cur.registrant.includes(registrant)) {
        acc.push(cur);
      } else if (title == '' && registrant == '') {
        acc.push(cur);
      }
      return acc;
    }, []);
  }

  update({ receiverId }, updateData) {
    const data = JSON.parse(JSON.stringify(this.#data));
    data.splice(receiverId - 1, 1, updateData);
    return data[receiverId - 1];
  }

  updateValidState(receiverIds) {
    const result = this.#data.reduce((acc, cur) => {
      receiverIds.forEach((id) => {
        if (id === cur.id) {
          cur['valid_state'] = 0;
          acc.push(cur);
        }
      });
      return acc;
    }, []);
    return result.filter((v) => v.valid_state == 0);
  }
}

const mockUserRepository = () => ({
  findOne: jest.fn().mockReturnValue({
    idx: 1,
  }),
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

  describe('save는', () => {
    it('대상자 조건을 저장한다.', async () => {
      const receiverInfo: CreateReceiverDto = {
        title: '테스트용 제목',
        description: '테스트용 내용',
        conditionText: 'group=7 AND isauth=Y AND nonlogindays=357 AND nonloginoverorunder=p13',
      };
      expect(await service.save(receiverInfo, 'idx')).toEqual({ message: 'success' });
    });
  });

  describe('getOne은', () => {
    it('사용자 정보하나를 읽어온다. ', async () => {
      const id = 1;
      const response = {
        id: 1,
        title: '1번 제목',
        description: '1번 내용',
        registrant: '관리자',
      };
      expect(await service.getOne(id)).toEqual(response);
    });
    it('사용자 정보가 없으면 []을 반환한다.', async () => {
      const id = 0;
      expect(await service.getOne(id)).toEqual([]);
    });
  });

  describe('getAll은', () => {
    it('조회 결과를 배열로 반환한다.', async () => {
      const searchInfo = {
        title: '',
        registrant: '',
      };
      expect(await service.getAll(searchInfo)).toBeInstanceOf(Array);
    });

    describe('검색 조건으로', () => {
      it('제목만 선택시, 제목만 일치하는 결과를 배열로 받는다.', async () => {
        const searchInfo = {
          title: '1번',
          registrant: '',
        };
        const result = [
          {
            id: 1,
            title: '1번 제목',
            description: '1번 내용',
            registrant: '관리자',
          },
        ];
        expect(await service.getAll(searchInfo)).toEqual(result);
      });
      it('작성자만 선택시, 작성자만 일치하는 결과를 배열로 받는다.', async () => {
        const searchInfo = {
          title: '',
          registrant: '관리자2',
        };
        const result = [
          {
            id: 2,
            title: '2번 제목',
            description: '2번 내용',
            registrant: '관리자2',
          },
        ];
        expect(await service.getAll(searchInfo)).toEqual(result);
      });
      it('제목, 작성자 둘다 일치하는 결과가 없을 시, []을 반환받는다.', async () => {
        const searchInfo = {
          title: '없는제목',
          registrant: '없는관리자',
        };
        const result = [];
        expect(await service.getAll(searchInfo)).toEqual(result);
      });
      it('제목, 작성자 조건이 전부 ""일 때는 전체 리스트를 조회한다.', async () => {
        const searchInfo = {
          title: '',
          registrant: '',
        };
        const result = [
          {
            id: 1,
            title: '1번 제목',
            description: '1번 내용',
            registrant: '관리자',
          },
          {
            id: 2,
            title: '2번 제목',
            description: '2번 내용',
            registrant: '관리자2',
          },
        ];
        expect(await service.getAll(searchInfo)).toEqual(result);
      });
    });
  });

  describe('update는', () => {
    it('성공시 업데이트 내용이 반영된다. ', async () => {
      const updateDto: UpdateReceiverDto = {
        idx: 2,
        title: '수정된 제목2',
        description: '수정된 내용2',
        conditionText: 'isauth=Y AND group=1',
      };
      const receiverId = updateDto.idx;
      const response = {
        title: '수정된 제목2',
        description: '수정된 내용2',
        conditionText: 'isauth=Y AND group=1',
      };
      expect(await service.update(receiverId, updateDto, '관리자2')).toEqual(expect.objectContaining(response));
    });
  });

  describe('delete는', () => {
    it('단일 삭제 시, valid_state를 0으로 업데이트한다.', async () => {
      const receiverIds = [1];
      expect(await service.delete(receiverIds)).toEqual(expect.arrayContaining([expect.objectContaining({ valid_state: 0 })]));
    });
    it('다중 삭제 시, valid_state를 0으로 업데이트한다. ', async () => {
      const receiverIds = [1, 2];
      expect(await service.delete(receiverIds)).toEqual(expect.arrayContaining([expect.objectContaining({ valid_state: 0 })]));
    });
  });
});