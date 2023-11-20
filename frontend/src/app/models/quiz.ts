import { Type } from 'class-transformer';
import 'reflect-metadata';

export class Quiz{
    id?: number;
    name?: string;
    description?: string;
    isPublished?: boolean;
    isClosed?: boolean;
    isTest?: boolean;
    @Type(() => Date)
    startdate?: Date;
    @Type(() => Date)
    enddate?: Date;
    @Type(() => Attempt)
    attempts?: Attempt[];
    @Type(()=> Database)
    database?: Database;

    get statut(): string {
      //if it is not closed should check if there is an attempt should check if the attempt has a finish date, if not it is in progress
      if(this.isClosed){
            return 'CLOTURE';
        }else{
            if (this.attempts?.length == 0||this.attempts==null){
                return 'PAS_COMMENCE';
            }else{
                return this.attempts[0]?.finish !== null ? 'FINI' : 'EN_COURS';
            }
        }
    }
}
export class Attempt{
    id? : number;
    @Type(() => Date)
    start?: Date;
    @Type(() => Date)
    finish?: Date;
   }

export class Database{
    id? : number;
    name? : string;
}