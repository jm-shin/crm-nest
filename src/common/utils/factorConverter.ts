import { Logger } from '@nestjs/common';

export class FactorConverter {
  private readonly logger = new Logger(FactorConverter.name);

  //text convert to json
  makeJsonCondition (conditionText) {
    const conditionJsonList = conditionText.split('AND')
      .reduce((acc, cur, i) => {
        const keyAndValues = cur.replace(/ /g, '').split('=');
        const key = keyAndValues[0];
        const value = keyAndValues[1];
        acc[key] = value;
        return acc;
      }, []);

    const convResult = { ...conditionJsonList };

    this.logger.log(`convResult type: ${typeof convResult} convResult: ${JSON.stringify(convResult)}`);

    return convResult;
  }
}

//test
const factor = new FactorConverter();
console.log(factor.makeJsonCondition('isauth=Y AND Group=1'));

