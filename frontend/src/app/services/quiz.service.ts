import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Quiz } from '../models/quiz';
import { map,catchError } from 'rxjs/operators';
import { Observable,of } from 'rxjs';
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

    getQuizNameExists(quizName : string): Observable<boolean>{
        return this.http.get<boolean>(`${this.baseUrl}api/quizzes/quizNameExists/${quizName}`);
    }

    public updateQuiz(quiz : Quiz): Observable<boolean>{
        return this.http.put<Quiz>(`${this.baseUrl}api/quizzes`, quiz).pipe(
            map(() => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public createQuiz(quiz : Quiz): Observable<boolean>{
       return this.http.post<Quiz>(`${this.baseUrl}api/quizzes/createNewQuiz`, quiz).pipe(
            map(() => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
       );
    }

    public deleteQuiz(quiz : Quiz): Observable<boolean>{
        return this.http.delete<boolean>(`${this.baseUrl}api/quizzes/${quiz.id}`).pipe(
            map(() => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        )
    }
}
