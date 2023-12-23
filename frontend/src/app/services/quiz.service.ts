import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Quiz } from '../models/quiz';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';

@Injectable({ providedIn: 'root' })
export class QuizService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<Quiz[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/quizzes/all`).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }

    getTests(): Observable<Quiz[]>{
        return this.http.get<any[]>(`${this.baseUrl}api/quizzes/tests`).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }

    getTrainings(): Observable<Quiz[]>{
        return this.http.get<any[]>(`${this.baseUrl}api/quizzes/trainings`).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }

    getFirstQuestionId(id : number): Observable<number>{
        return this.http.get<number>(`${this.baseUrl}api/quizzes/getFirstQuestionId/${id}`);
    }

    getQuizById(id : number): Observable<Quiz>{
        return this.http.get<any>(`${this.baseUrl}api/quizzes/getQuizById/${id}`).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }

    public closeQuiz(id : number): Observable<any>{
        return this.http.post<any>(`${this.baseUrl}api/quizzes/closeQuiz`, {id});
    }

    public createAttempt(id : number): Observable<any>{
        return this.http.post<any>(`${this.baseUrl}api/quizzes/createAttempt`, {id});
    }
}
