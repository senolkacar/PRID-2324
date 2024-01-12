import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { Database } from '../models/database';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<Database[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/database`).pipe(
            map(res => plainToInstance(Database, res))
        );
    }

    getTables(name : string): Observable<any> {
        return this.http.post<string>(`${this.baseUrl}api/database/gettables`, { name });
    }

    getColumns(name : string): Observable<any> {
        return this.http.post<string>(`${this.baseUrl}api/database/getcolumns`, { name });
    }

}