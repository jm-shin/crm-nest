export class CsvConverter {

  async unoToCsv(text: string) {
    const targetText = JSON.parse(text);

    let csvStr = 'uno\r\n';

    for (let i = 0; i < targetText.length; i++) {
      csvStr += (i !== targetText.length - 1 ? targetText[i] + `\r\n` : targetText[i]);
    }
    return csvStr;
  }
}
