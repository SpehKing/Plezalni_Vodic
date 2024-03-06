export class Comment {
    _id!: string;
    author!: string;
    rating!: number;
    comment!: string;
    createdOn!: Date;

    constructor(author: string, rating: number, comment: string) {
        this.author = author;
        this.rating = rating;
        this.comment = comment;
        this.createdOn = new Date();
    }
}