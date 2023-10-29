import { Type } from 'class-transformer';
import 'reflect-metadata';

export class Quiz{
    id?: number;
    name?: string;
    description?: string;
    IsPublished?: boolean;
    IsClosed?: boolean;
    IsTest?: boolean;
    @Type(() => Date)
    Start?: Date;
    @Type(() => Date)
    Finish?: Date;

}