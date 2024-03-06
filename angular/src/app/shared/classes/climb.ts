import { Area } from './area';

export interface Climb {
    _id: string;
    name: string;
    description: string;
    date: string;
    area: string;  //please keep this a string, if you need an object add another field
    areaName: string;   //this is a computed field, it's not in the database
    numberOrder: number;
    grade: string;
  }