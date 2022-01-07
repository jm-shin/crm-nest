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
      group, ci, cipromotionid, prevpromotionid, nextpromotionid, pkgscount, prevPromotionPassedMonths,
      freeEndReceivePassedDays, startdate, enddate, retentionpkgs, purchasepkgs, phase,
      //join
      isauth, isfirstjoin, joindevice,membertype, nonlogindays, nonlogindaystype, nonloginoverorunder, ismembertypesocial,
      ismembertypesimple, ismembertypeb2b, nologinpasseddays,
      //pay
      continuousoverorunder, continuouspaiddays, continuouspaiddaystype, isableupsell, isexistpaid, ispaid, pgid,
      iscouponcharged, ispaylettercharged, isexternalpgcharged, isitunesstore, iststore, continuouspaidcount, discountpassedmonth,
      paybackreceivepassedmonth,
      //terminate
      isterminateapplied, isterminatereceipt,
      //receive
      discountoverorunder, discountpasseddays, discountpasseddaystype, isexistdefensivecoin, isexistdiscount, isexistpayback, isexistupsell,
      isvipbenefitsinrcv, paybackoverorunder, paybackpasseddays, paybackpasseddaystype,
    } = convArr;

    const condition = {
      "info": {
        "group": group? group : "",
        "ci": ci? ci : "",
        "cipromotionid": cipromotionid? cipromotionid : "",
        "prevpromotionid": prevpromotionid? prevpromotionid : "",
        "nextpromotionid": nextpromotionid? nextpromotionid : "",
        "pkgscount": pkgscount? pkgscount : "",
        "prevPromotionPassedMonths": prevPromotionPassedMonths? prevPromotionPassedMonths : "",
        "freeEndReceivePassedDays": freeEndReceivePassedDays? freeEndReceivePassedDays : "",
        "startdate": startdate? startdate : "",
        "enddate": enddate? enddate : "",
        "retentionpkgs": retentionpkgs? retentionpkgs : "",
        "purchasepkgs": purchasepkgs? purchasepkgs : "",
        "phase": phase? phase : ""
      },
      "condition" : {
        "join": {
          "isauth" : isauth? isauth : "N",
          "isfirstjoin": isfirstjoin? isfirstjoin : "N",
          "joindevice": joindevice? joindevice : "",
          "membertype": membertype? membertype : "",
          "nonlogindays": nonlogindays? nonlogindays : "",
          "nonlogindaystype": nonlogindaystype? nonlogindaystype : "",
          "nonloginoverorunder": nonloginoverorunder? nonloginoverorunder : "",
          "ismembertypesocial": ismembertypesocial? ismembertypesocial: "N",
          "ismembertypesimple": ismembertypesimple? ismembertypesimple: "N",
          "ismembertypeb2b": ismembertypeb2b? ismembertypeb2b: "N",
          "nologinpasseddays": nologinpasseddays? nologinpasseddays: "",
        },
        "pay": {
          "continuousoverorunder": continuousoverorunder? continuousoverorunder : "",
          "continuouspaiddays": continuouspaiddays? continuouspaiddays : "",
          "continuouspaiddaystype": continuouspaiddaystype? continuouspaiddaystype : "",
          "isableupsell": isableupsell? isableupsell : "N",
          "isexistpaid": isexistpaid? isexistpaid : "N",
          "ispaid": ispaid? ispaid : "N",
          "pgid": pgid? pgid : "",
          "iscouponcharged": iscouponcharged?  iscouponcharged: "N",
          "ispaylettercharged": ispaylettercharged? ispaylettercharged: "N",
          "isexternalpgcharged": isexternalpgcharged? isexternalpgcharged : "N",
          "isitunesstore": isitunesstore? isitunesstore : "N",
          "iststore": iststore? iststore : "N",
          "continuouspaidcount": continuouspaidcount? continuouspaidcount : "",
          "discountpassedmonth": discountpassedmonth? discountpassedmonth : "",
          "paybackreceivepassedmonth": paybackreceivepassedmonth? paybackreceivepassedmonth : "",
        },
        "terminate": {
          "isterminateapplied": isterminateapplied? isterminateapplied : "N",
          "isterminatereceipt": isterminatereceipt? isterminatereceipt : "N",
        },
        "receive": {
          "discountoverorunder": discountoverorunder? discountoverorunder : "",
          "discountpasseddays": discountpasseddays? discountpasseddays : "",
          "discountpasseddaystype": discountpasseddaystype? discountpasseddaystype : "",
          "isexistdefensivecoin": isexistdefensivecoin? isexistdefensivecoin : "N",
          "isexistdiscount": isexistdiscount? isexistdiscount : "N",
          "isexistpayback": isexistpayback? isexistpayback : "N",
          "isexistupsell": isexistupsell? isexistupsell : "N",
          "isvipbenefitsinrcv": isvipbenefitsinrcv? isvipbenefitsinrcv : "N",
          "paybackoverorunder": paybackoverorunder? paybackoverorunder : "",
          "paybackpasseddays": paybackpasseddays? paybackpasseddays : "",
          "paybackpasseddaystype": paybackpasseddaystype? paybackpasseddaystype : "",
        }
      }
    };
    this.logger.log(`factorConvertor Result: ${JSON.stringify(condition)}`);
    return condition;
  }
}
