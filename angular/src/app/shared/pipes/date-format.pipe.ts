import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: Date, ...args: unknown[]): unknown {
    if (!value) return value;
    try {
      return formatDate(value, 'd MMMM, yyyy, HH:mm', 'sl-SI');
    } catch (e) {
      return value;
    }
  }

}
