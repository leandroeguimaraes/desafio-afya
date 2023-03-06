import { Injectable } from '@nestjs/common';
import { IDateService } from './interface/date.interface';

import * as moment from 'moment-timezone';

@Injectable()
export class MomentDateService implements IDateService {
  currentUTCDate(): Date {
    return moment.utc().toDate();
  }
  getUTCDate(date: Date): Date {
    return moment.utc(date).toDate();
  }

  isAfter(date: number | Date, dateToCompare: number | Date): boolean {
    return moment(date).isAfter(dateToCompare);
  }

  isBefore(date: number | Date, dateToCompare: number | Date): boolean {
    return moment(date).isBefore(dateToCompare);
  }
}
