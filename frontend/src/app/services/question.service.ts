import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Question, Solution } from '../models/question';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';

@Injectable({ providedIn: 'root' })
export class QuestionService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getQuestion(id: number){
        return this.http.get<Question>(`${this.baseUrl}api/question/${id}`).pipe(
            map(res => plainToInstance(Question, res))
        );
    }

    public evaluate(questionId: number, query: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}api/question/eval/`, { questionId, query });
    }

    getQuery(questionId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}api/question/getquery/${questionId}`);
    }

    getAnswer(questionId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}api/question/getanswer/${questionId}`);
    }

    getQuestionByQuizId(quizId: number): Observable<Question[]> {
        return this.http.get<Question[]>(`${this.baseUrl}api/question/getQuestionsByQuizId/${quizId}`).pipe(
            map(res => plainToInstance(Question, res))
        );
    }

    public deleteQuestion(questionId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/question/delete/${questionId}`).pipe(
            map(() => true)
        );
    }

    public deleteSolution(solution: Solution): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/question/solution/${solution.id}`).pipe(
            map(() => true)
        );
    }
}
