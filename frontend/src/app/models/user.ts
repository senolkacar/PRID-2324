import { Type } from 'class-transformer';
import 'reflect-metadata';
import { differenceInYears } from 'date-fns';

export enum Role {
    Student = 1,
    Teacher = 2,
}

export class User {
    id?: number;
    pseudo?: string;
    password?: string;
    email?: string;
    lastName?: string;
    firstName?: string;
    @Type(() => Date)
    birthDate?: Date;
    role?: Role;
    token?: string;

    get roleAsString(): string {
        return this.role === 1 ? 'Student' : 'Teacher';
    }

    get display(): string {
        return `${this.pseudo} (${this.birthDate ? this.age + ' years old' : 'age unknown'})`;
    }

    get age(): number | undefined {
        if (!this.birthDate)
            return undefined;
        var today = new Date();
        return differenceInYears(today, this.birthDate);
    }
}
