import { Climb } from './climb';

export class User {
    _id!: string;
    name!: string;
    surname!: string;
    birthday!: string;
    email!: string;
    publicKey?: string;
    is_guide!: boolean;
    climbs?: Climb[];
    profile_picture?: string;
    bio!: string;
  }
