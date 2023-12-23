import { Type } from 'class-transformer';
import 'reflect-metadata';
import { Quiz } from './quiz';
import { Query } from './query';
import { format } from 'date-fns';

export class Question{
    id?:number;
    order?:number;
    body?:string;
    @Type(() => Quiz)
    quiz?: Quiz;
    @Type(() => Answer)
    answers?: Answer[];
    @Type(() => Solution)
    solutions?: Solution[];
    previousQuestionId?: number | null;
    nextQuestionId?: number | null;
    hasAnswer?:boolean;
    @Type(() => Answer)
    answer?:Answer;
    @Type(() => Query)
    query?: Query;

   
}
export class Answer{
    id?:number;
    sql?:string;
    @Type(() => Date)
    timestamp?:Date;
    isCorrect?:boolean;
    quizId?:number;

    get timestampAsString(): string {
        return (this.timestamp && this.timestamp!=null) ? format(this.timestamp, 'dd/MM/yyyy HH:mm:ss') : '';
    }
}

export class Solution{
    id?:number;
    order?:number;
    sql?:string;
}