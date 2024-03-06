import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstSentence'
})
export class FirstSentencePipe implements PipeTransform {

  transform(value: string): string {
    const sentences = value.split('.');
    return sentences[0];
  }

}