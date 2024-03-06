export class ClimbingRoute {
    numberOrder: number;
    name: string;
    height: number;
    grade: string;
  
    constructor(data: ClimbingRoute) {
      this.numberOrder = data.numberOrder;
      this.name = data.name;
      this.height = data.height;
      this.grade = data.grade;
    }
  }
  