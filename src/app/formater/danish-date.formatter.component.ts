import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';

@Injectable()
export class DanishDateFormatter implements NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    const chunks = value.substr(0,10).split('-');
    return {
      day: Number(chunks[2]),
      month: Number(chunks[1]),
      year: Number(chunks[0])};
  }

  format(date: NgbDateStruct): string {
    if (date === null) {
      return '';
    }
    return `${date.day}-${date.month}-${date.year}`;
  }

}
