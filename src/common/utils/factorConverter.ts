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
      group,
      ci,
      cipromotionid,
      prevpromotionid,
      nextpromotionid,
      pkgscount,
      prevPromotionPassedMonths,
      freeEndReceivePassedDays,
      startdate,
      enddate,
      retentionpkgs,
      purchasepkgs,
      phase,
      //join
      isauth,
      isfirstjoin,
      joindevice,
      membertype,
      nonlogindays,
      nonlogindaystype,
      nonloginoverorunder,
      ismembertypesocial,
      ismembertypesimple,
      ismembertypeb2b,
      nologinpasseddays,
      //pay
      continuousoverorunder,
      continuouspaiddays,
      continuouspaiddaystype,
      isableupsell,
      isexistpaid,
      ispaid,
      pgid,
      iscouponcharged,
      ispaylettercharged,
      isexternalpgcharged,
      isitunesstore,
      iststore,
      continuouspaidcount,
      discountpassedmonth,
      paybackreceivepassedmonth,
      //terminate
      isterminateapplied,
      isterminatereceipt,
      //receive
      discountoverorunder,
      discountpasseddays,
      discountpasseddaystype,
      isexistdefensivecoin,
      isexistdiscount,
      isexistpayback,
      isexistupsell,
      isvipbenefitsinrcv,
      paybackoverorunder,
      paybackpasseddays,
      paybackpasseddaystype,
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

  async makeJsonAction(cond) {
    const {
      actioncode, actiontype, benefitdays, benefitdaystype, discounttype, discountamount, discountrate,
      bonuscointype, cointype, bonuscoinamount, bonuscoinrate, bonuscoindays, bonuspackageid, bonuscoupon,
    } = cond;

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

  async makeJsonDisplay() {
    // const {messagecase, message, messageurl, devicetype,
    //   alarm, push, edm, android} = cond;
    const android = {
      'layerpopup': {
        'text': '1',
        'color': 'red',
        'url': '',
      },
      'lnbtoptext': {
        'text': '2',
        'color': '',
        'url': '',
      },
      'lnbtopbutton': {
        'text': '3',
        'color': '',
        'url': '',
      },
      'homeband': {
        'image': '4',
        'text': '',
        'color': '',
        'url': '',
      },
      'voucher_index': {
        'image': '',
        'text': '',
        'color': '',
        'url': '',
      },
    };

    const mobile = {
      'layerpopup': {
        'image': '',
        'text': '',
        'color': '',
        'url': '',
      },
      'lnbtoptext': {
        'image': '',
        'text': '',
        'color': '',
        'url': '',
      },
      'lnbtopbutton': {
        'image': '',
        'text': '',
        'color': '',
        'url': '',
      },
      'homeband': {
        'image': '',
        'text': '',
        'color': '',
        'url': '',
      },
      'voucher_index': {
        'image': '',
        'text': '',
        'color': '',
        'url': '',
      },
    };

    const pc = {
      'layerpopup': {
        'image': '',
        'text': '',
        'color': '',
        'url': '',
      },
      'lnbtoptext': {
        'image': '',
        'text': '',
        'color': '',
        'url': '',
      },
      'lnbtopbutton': {
        'image': '',
        'text': '',
        'color': '',
        'url': '',
      },
      'homeband': {
        'image': '',
        'text': '',
        'color': '',
        'url': '',
      },
      'voucher_index': {
        'image': '',
        'text': '',
        'color': '',
        'url': '',
      },
    };

    const ios = {
      'layerpopup': {
        'image': '',
        'text': '',
        'color': '',
        'url': '',
      },
      'lnbtoptext': {
        'image': '',
        'text': '',
        'color': '',
        'url': '',
      },
      'lnbtopbutton': {
        'image': '',
        'text': '',
        'color': '',
        'url': '',
      },
      'homeband': {
        'image': '',
        'text': '',
        'color': '',
        'url': '',
      },
      'voucher_index': {
        'image': '',
        'text': '',
        'color': '',
        'url': '',
      },
    };

    const deviceArray = [
      { device: 'android', ...android },
      { device: 'mobile', ...mobile },
      { device: 'pc', ...pc },
      { device: 'ios', ...ios },
    ];

    let device_area = [];

    /*
    const final = {
      messagecase: messagecase? messagecase : "",
      message: message? message : "",
      messageurl: messageurl? messageurl : "",
      devices: [
        //android
        {
          devicetype: "android",
          alarm: alarm? alarm : "n",
          push: push? push : "n",
          edm: edm? edm : "n",
          areas: [
            {
              areatype: "layerpopup",
              areaitems: [android.layerpopup]
            },
            {
              areatype: "lnbtopbutton",
              areaitems: [android.lnbtopbutton]
            },
            {
              areatype: "homeband",
              areaitems: [android.homeband]
            },
            {
              areatype: "voucher_index",
              areaitems: [android.voucher_index]
            }
          ]
        },
        //ios
      ]
    }
    */

  }

  async finalJsonForm(promotionId, actions, cond) {

    const final = {
      id: promotionId,
      info: cond.info,
      actions: actions,
      condition: cond.condition,
      display: {},
    };

    return final;
  }

}