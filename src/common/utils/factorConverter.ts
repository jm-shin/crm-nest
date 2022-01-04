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
      isauth, isfirstjoin, joindevice,membertype, nonlogindays, nonlogindaystype, nonloginoverorunder,
      //pay
      continuousoverorunder, continuouspaiddays, continuouspaiddaystype, isableupsell, isexistpaid, ispaid, pgid,
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
          "isauth" : isauth? isauth : "",
          "isfirstjoin": isfirstjoin? isfirstjoin : "",
          "joindevice": joindevice? joindevice : "",
          "membertype": membertype? membertype : "",
          "nonlogindays": nonlogindays? nonlogindays : "",
          "nonlogindaystype": nonlogindaystype? nonlogindaystype : "",
          "nonloginoverorunder": nonloginoverorunder? nonloginoverorunder : "",
        },
        "pay": {
          "continuousoverorunder": continuousoverorunder? continuousoverorunder : "",
          "continuouspaiddays": continuouspaiddays? continuouspaiddays : "",
          "continuouspaiddaystype": continuouspaiddaystype? continuouspaiddaystype : "",
          "isableupsell": isableupsell? isableupsell : "",
          "isexistpaid": isexistpaid? isexistpaid : "",
          "ispaid": ispaid? ispaid : "",
          "pgid": pgid? pgid : "",
        },
        "terminate": {
          "isterminateapplied": isterminateapplied? isterminateapplied : "",
          "isterminatereceipt": isterminatereceipt? isterminatereceipt : "",
        },
        "receive": {
          "discountoverorunder": discountoverorunder? discountoverorunder : "",
          "discountpasseddays": discountpasseddays? discountpasseddays : "",
          "discountpasseddaystype": discountpasseddaystype? discountpasseddaystype : "",
          "isexistdefensivecoin": isexistdefensivecoin? isexistdefensivecoin : "",
          "isexistdiscount": isexistdiscount? isexistdiscount : "",
          "isexistpayback": isexistpayback? isexistpayback : "",
          "isexistupsell": isexistupsell? isexistupsell : "",
          "isvipbenefitsinrcv": isvipbenefitsinrcv? isvipbenefitsinrcv : "",
          "paybackoverorunder": paybackoverorunder? paybackoverorunder : "",
          "paybackpasseddays": paybackpasseddays? paybackpasseddays : "",
          "paybackpasseddaystype": paybackpasseddaystype? paybackpasseddaystype : "",
        }
      }
    };
    this.logger.log(`convResult type: ${typeof condition} convResult: ${JSON.stringify(condition)}`);
    return condition;
  }
}
