import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Question } from '../models/question';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';

@Injectable({ providedIn: 'root' })
export class QuestionService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getQuestionsByQuizId(id: number): Observable<Question[]>{
        return this.http.get<any[]>(`${this.baseUrl}api/question/${id}`).pipe(
            map(res => plainToInstance(Question, res))
        );
    }

}
