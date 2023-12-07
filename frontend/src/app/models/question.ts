import { Type } from 'class-transformer';
import 'reflect-metadata';
import { Quiz } from './quiz';

export class Question{
    id?:number;
    order?:number;
    body?:string;
    @Type(() => Quiz)
    quiz?: Quiz;
    @Type(() => Answer)
    answers?: Answer[];
    solutions?: Solution[];
    previousQuestionId?: number | null;
    nextQuestionId?: number | null;
    hasAnswer?:boolean;

   
}
export class Answer{
    id?:number;
    sql?:string;
    @Type(() => Date)
    timestamp?:Date;
    isCorrect?:boolean;
    quizId?:number;
}

export class Solution{
    id?:number;
    order?:number;
    sql?:string;
}