import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'dateFormatEvent'
})
export class DateEventFormatPipe implements PipeTransform {

  transform(value: Date, ...args: unknown[]): unknown {
    if (!value) return value;
    try {
      return formatDate(value, 'd MMMM, yyyy', 'sl-SI');
    } catch (e) {
      return value;
    }
  }

}
