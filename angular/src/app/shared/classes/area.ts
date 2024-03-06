import { Comment } from "./comment";
import { Route } from "./route";

export class Area {
    _id!: string;
    name!: string;
    description!: string;
    best_period!: string;
    characteristics!: string;
    image!: string;
    coordinates!: number[];
    rating?: number;
    routes!: Route[];
    comments?: Comment[];
}