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
    startDate?: Date;
    @Type(() => Date)
    endDate?: Date;
    @Type(() => Attempt)
    attempts?: Attempt[];
    @Type(()=> Database)
    database?: Database;
    statut?: string;

    get statutForTeacher(): string{
        if(this.isClosed){
            return 'CLOTURE';
        }else{
            return this.isPublished ? 'PUBLIE' : 'PAS_PUBLIE';
        }
    }

    get type(): string{
        return this.isTest ? 'Test' : 'Training';
    }

    get testStart(): string{
        return this.startDate !== null && this.startDate? this.startDate?.toLocaleDateString('fr-BE') : 'N/A';
    }

    get testEnd(): string{
        return this.endDate !== null && this.endDate? this.endDate?.toLocaleDateString('fr-BE') : 'N/A';
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