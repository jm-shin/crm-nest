import { Logger } from '@nestjs/common';

export class FactorConverter {
  private readonly logger = new Logger(FactorConverter.name);

  //text convert to json
  makeJsonCondition(conditionText) {
    const conditionJsonList = conditionText.split('AND')
      .reduce((acc, cur, i) => {
        const keyAndValue = cur.replace(/ /g, '').split('=');
        const key = keyAndValue[0];
        const value = keyAndValue[1];
        acc[key] = value;
        return acc;
      }, []);

    const convArr = { ...conditionJsonList };

    const {
      //promotionInfo
      group, ci, cipromotionid, prevpromotionid, nextpromotionid, pkgscount,
      prevPromotionPassedMonths, freeEndReceivePassedDays, startdate,
      enddate, retentionpkgs, purchasepkgs, phase,
      //join
      isauth, isfirstjoin, joindevice, membertype, nonlogindays, nonlogindaystype,
      nonloginoverorunder, ismembertypesocial, ismembertypesimple, ismembertypeb2b,
      nologinpasseddays,
      //pay
      continuousoverorunder, continuouspaiddays, continuouspaiddaystype,
      isableupsell, isexistpaid, ispaid, pgid, iscouponcharged, ispaylettercharged,
      isexternalpgcharged, isitunesstore, iststore, continuouspaidcount,
      discountpassedmonth, paybackreceivepassedmonth,
      //terminate
      isterminateapplied, isterminatereceipt,
      //receive
      discountoverorunder, discountpasseddays, discountpasseddaystype,
      isexistdefensivecoin, isexistdiscount, isexistpayback, isexistupsell,
      isvipbenefitsinrcv, paybackoverorunder, paybackpasseddays, paybackpasseddaystype,
    } = convArr;

    const condition = {
      'info': {
        'group': group ? group : '',
        'ci': ci ? ci : '',
        'cipromotionid': cipromotionid ? cipromotionid : '',
        'prevpromotionid': prevpromotionid ? prevpromotionid : '',
        'nextpromotionid': nextpromotionid ? nextpromotionid : '',
        'pkgscount': pkgscount ? pkgscount : '',
        'prevPromotionPassedMonths': prevPromotionPassedMonths ? prevPromotionPassedMonths : '',
        'freeEndReceivePassedDays': freeEndReceivePassedDays ? freeEndReceivePassedDays : '',
        'startdate': startdate ? startdate : '',
        'enddate': enddate ? enddate : '',
        'retentionpkgs': retentionpkgs ? retentionpkgs : '',
        'purchasepkgs': purchasepkgs ? purchasepkgs : '',
        'phase': phase ? phase : '',
      },
      'condition': {
        'join': {
          'isauth': isauth ? isauth : 'N',
          'isfirstjoin': isfirstjoin ? isfirstjoin : 'N',
          'joindevice': joindevice ? joindevice : '',
          'membertype': membertype ? membertype : '',
          'nonlogindays': nonlogindays ? nonlogindays : '',
          'nonlogindaystype': nonlogindaystype ? nonlogindaystype : '',
          'nonloginoverorunder': nonloginoverorunder ? nonloginoverorunder : '',
          'ismembertypesocial': ismembertypesocial ? ismembertypesocial : 'N',
          'ismembertypesimple': ismembertypesimple ? ismembertypesimple : 'N',
          'ismembertypeb2b': ismembertypeb2b ? ismembertypeb2b : 'N',
          'nologinpasseddays': nologinpasseddays ? nologinpasseddays : '',
        },
        'pay': {
          'continuousoverorunder': continuousoverorunder ? continuousoverorunder : '',
          'continuouspaiddays': continuouspaiddays ? continuouspaiddays : '',
          'continuouspaiddaystype': continuouspaiddaystype ? continuouspaiddaystype : '',
          'isableupsell': isableupsell ? isableupsell : 'N',
          'isexistpaid': isexistpaid ? isexistpaid : 'N',
          'ispaid': ispaid ? ispaid : 'N',
          'pgid': pgid ? pgid : '',
          'iscouponcharged': iscouponcharged ? iscouponcharged : 'N',
          'ispaylettercharged': ispaylettercharged ? ispaylettercharged : 'N',
          'isexternalpgcharged': isexternalpgcharged ? isexternalpgcharged : 'N',
          'isitunesstore': isitunesstore ? isitunesstore : 'N',
          'iststore': iststore ? iststore : 'N',
          'continuouspaidcount': continuouspaidcount ? continuouspaidcount : '',
          'discountpassedmonth': discountpassedmonth ? discountpassedmonth : '',
          'paybackreceivepassedmonth': paybackreceivepassedmonth ? paybackreceivepassedmonth : '',
        },
        'terminate': {
          'isterminateapplied': isterminateapplied ? isterminateapplied : 'N',
          'isterminatereceipt': isterminatereceipt ? isterminatereceipt : 'N',
        },
        'receive': {
          'discountoverorunder': discountoverorunder ? discountoverorunder : '',
          'discountpasseddays': discountpasseddays ? discountpasseddays : '',
          'discountpasseddaystype': discountpasseddaystype ? discountpasseddaystype : '',
          'isexistdefensivecoin': isexistdefensivecoin ? isexistdefensivecoin : 'N',
          'isexistdiscount': isexistdiscount ? isexistdiscount : 'N',
          'isexistpayback': isexistpayback ? isexistpayback : 'N',
          'isexistupsell': isexistupsell ? isexistupsell : 'N',
          'isvipbenefitsinrcv': isvipbenefitsinrcv ? isvipbenefitsinrcv : 'N',
          'paybackoverorunder': paybackoverorunder ? paybackoverorunder : '',
          'paybackpasseddays': paybackpasseddays ? paybackpasseddays : '',
          'paybackpasseddaystype': paybackpasseddaystype ? paybackpasseddaystype : '',
        },
      },
    };
    this.logger.log(`factorConvertor Result: ${JSON.stringify(condition)}`);
    return condition;
  }

  async makeJsonAction(info) {
    const {
      actioncode, actiontype, benefitdays, benefitdaystype, discounttype,
      discountamount, discountrate, bonuscointype, cointype, bonuscoinamount,
      bonuscoinrate, bonuscoindays, bonuspackageid, bonuscoupon,
    } = info;

    const actions = {
      action: {
        actioncode: actioncode ? actioncode : '',
        actiontype: actiontype ? actiontype : '',
      },
      benefit: {
        benefitdays: benefitdays ? benefitdays : '',
        benefitdaystype: benefitdaystype ? benefitdaystype : '',
        discounttype: discounttype ? discounttype : '',
        discountamount: discountamount ? discountamount : '',
        discountrate: discountrate ? discountrate : '',
        bonuscointype: bonuscointype ? bonuscointype : '',
        cointype: cointype ? cointype : '',
        bonuscoinamount: bonuscoinamount ? bonuscoinamount : '',
        bonuscoinrate: bonuscoinrate ? bonuscoinrate : '',
        bonuscoindays: bonuscoindays ? bonuscoindays : '',
        bonuspackageid: bonuspackageid ? bonuspackageid : '',
        bonuscoupon: bonuscoupon ? bonuscoupon : '',
      },
    };
    return actions;
  }

  async makeJsonDisplay(info) {
    const {
      messagecase, message, messageurl, alarm, push, edm,
      android, ios, pc, mobile,
    } = info;

    async function deleteNull(device) {
      const col = ['image', 'text', 'color', 'url'];
      for (const key of Object.keys(device)) {
        // console.log(key, device[key]['image']);
        await col.forEach((i) => {
          if (device[key][i] == '') delete device[key][i];
        });
        if (Object.keys(device[key]).length === 0) delete device[key];
      }
    }

    async function makeAreaForm(device) {
      //return
      if (Object.keys(device).length === 0) {
        return [
          {
            areatype: '',
            areaitems: [
              {},
            ],
          },
        ];
      }
      return Object.keys(device).reduce((acc, cur, i) => {
        const area = {
          areatype: cur,
          areaitems: [
            device[cur],
          ],
        };
        acc.push(area);
        return acc;
      }, []);
    }

    this.logger.log('make display json start');

    await deleteNull(ios);
    await deleteNull(android);
    await deleteNull(mobile);
    await deleteNull(pc);

    const areas_ios = await makeAreaForm(ios);
    const areas_pc = await makeAreaForm(pc);
    const areas_mobile = await makeAreaForm(mobile);
    const areas_android = await makeAreaForm(android);

    const display = [
        {
        messagecase: messagecase? messagecase : "",
        message: message? message : "",
        messageurl: messageurl? messageurl : "",
        devices: [
          //android
          {
            devicetype: 'android',
            alarm: alarm? alarm : "n",
            push: push? push : "n",
            edm: edm? edm : "n",
            areas: areas_android,
          },
          //ios
          {
            devicetype: 'ios',
            alarm: alarm? alarm : "n",
            push: push? push : "n",
            edm: edm? edm : "n",
            areas: areas_ios,
          },
          //mobile
          {
            devicetype: 'mobile',
            alarm: alarm? alarm : "n",
            push: push? push : "n",
            edm: edm? edm : "n",
            areas: areas_mobile,
          },
          //pc
          {
            devicetype: 'pc',
            alarm: alarm? alarm : "n",
            push: push? push : "n",
            edm: edm? edm : "n",
            areas: areas_pc,
          },
        ],
      }
    ]
    this.logger.log(JSON.stringify(display));
    return display;
  }

  async finalJsonForm(promotionId, infoAndCondition, actions, display) {
    console.log(`promotionId: ${promotionId}`);
    console.log(`infoAndCondition: ${JSON.stringify(infoAndCondition.info)}`);
    console.log(`actions: ${JSON.stringify(actions)}`);
    console.log(`display: ${JSON.stringify(display)}`);

    return  {
      id: promotionId,
      info: infoAndCondition.info,
      actions: actions,
      condition: infoAndCondition.condition,
      display: display,
    };
  }
}
