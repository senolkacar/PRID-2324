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
    previousQuestionId?: number | null;
    nextQuestionId?: number | null;

   
}
export class Answer{
    id?:number;
    sql?:string;
    @Type(() => Date)
    timestamp?:Date;
    isCorrect?:boolean;
    quizId?:number;
}