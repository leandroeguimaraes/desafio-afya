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

  isAfterDay(date: number | Date, dateToCompare: number | Date): boolean {
    return moment(date).isAfter(dateToCompare, 'day');
  }

  isBeforeDay(date: number | Date, dateToCompare: number | Date): boolean {
    return moment(date).isBefore(dateToCompare, 'day');
  }
}
