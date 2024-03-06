export class GroupEvent {
  showInfo?: boolean = false;
  _id!: string;
  author!: string;
  name!: string;
  image?: string;
  description!: string;
  date!: Date;
  area!: string;
  price!: number;
  maxParticipants!: number;
  currentNumParticipants?: number;
  participants?: string[];
  }