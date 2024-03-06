// show-closest-date-first.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showClosestDateFirst'
})
export class ShowClosestDateFirstPipe implements PipeTransform {
  transform(events: any[]): any[] {
    if (!events || events.length === 0) {
      return [];
    }
    const sortedEvents = events.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });

    return sortedEvents;
  }
}
