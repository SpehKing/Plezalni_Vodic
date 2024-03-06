import { ClimbingRoute } from './climbing-route';

export class ClimbingLocation {
  public showInfo: boolean = false;
    constructor(
      public _id: string = '',
      public name: string = '',
      public description: string = '',
      public best_period: string = '',
      public characteristics: string = '',
      public image: number = 0,
      public coordinates: number[] = [],
      public routes: ClimbingRoute[] = [],
      public comments: string[] = []
    ) {
      this.routes = routes.map(route => new ClimbingRoute(route));
    }
  }
  