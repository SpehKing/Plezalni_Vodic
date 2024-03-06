import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addEur'
})
export class AddEurPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value) || value === null) {
      return 'Invalid Number';
    }

    return `${value / 1000000000000000000} eth`;
  }
}
