import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluralParticipant'
})
export class PluralParticipantePipe implements PipeTransform {
  transform(participants: string[], singularWord: string, pluralWord: string = ''): string {
    let value = 0;
    value = participants.length
    if (isNaN(value) || value === null) {
      return 'Invalid Number';
    }
    const targetWord = value === 1 ? singularWord : pluralWord || `${singularWord}s`;

    return `${targetWord}:`;
  }
}
