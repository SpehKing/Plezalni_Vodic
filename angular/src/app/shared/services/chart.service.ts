import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private refreshChartSubject = new Subject<void>();

  refreshChart$ = this.refreshChartSubject.asObservable();

  triggerChartRefresh() {
    console.log('Chart refresh triggered');
    this.refreshChartSubject.next();
  }
}