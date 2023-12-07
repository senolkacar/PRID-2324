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
    @Type(() => Solution)
    solutions?: Solution[];
    previousQuestionId?: number | null;
    nextQuestionId?: number | null;
    hasAnswer?:boolean;
    answer?:string;

   
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