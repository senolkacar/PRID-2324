// quiz-list.component.ts

import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy, Input } from '@angular/core';
import * as _ from 'lodash-es';
import { Quiz } from '../../models/quiz';
import { QuizService } from '../../services/quiz.service';
import { StateService } from '../../services/state.service';
import { MatTableState } from '../../helpers/mattable.state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from "@angular/material/sort";
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../services/authentication.service';
import { format, formatISO } from 'date-fns';
import { plainToClass } from 'class-transformer';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent {
    private _filter: string = '';
    get filter(): string {
        return this._filter;
    }
    @Input() set filter(value: string) {
        this._filter = value;
        this.filterChanged(value);
    }

    @Input() quizType: 'test' | 'training' | 'teacher' = 'test';
    displayedColumns: string[] = [];


  dataSource: MatTableDataSource<Quiz> = new MatTableDataSource();
  state: MatTableState;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private quizService: QuizService,
    private stateService: StateService,
    private authService: AuthenticationService,
    private router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    this.state = this.stateService.quizListState;
  }

  ngOnInit():void{
    if(this.quizType === 'teacher'){
      this.displayedColumns = ['name', 'databaseName','type', 'statutForTeacher', 'start', 'end', 'actions'];
    }else if(this.quizType === 'training'){
      this.displayedColumns = ['name', 'databaseName', 'statut', 'actions'];
    }else{
      this.displayedColumns = ['name', 'databaseName', 'start', 'end', 'statut', 'evaluation', 'actions'];
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: Quiz, filter: string) => {
      const str = data.name + ' ' + data.statut + ' ' + data.database?.name + ' ' + data.type + ' ' + data.statutForTeacher;
      return str.toLowerCase().includes(filter);
    };

    this.state.bind(this.dataSource);
    this.refresh();
  }

  refresh() {
    let quizObservable;
    if(this.quizType === 'teacher'){
      quizObservable = this.quizService.getAll();
    }else if(this.quizType === 'training'){
      quizObservable = this.quizService.getTrainings();
    }else{
      quizObservable = this.quizService.getTests();
    }
    
    quizObservable.subscribe(data => {
        this.dataSource.data = data;
        this.state.restoreState(this.dataSource);
        this.filter = this.state.filter;
    });
  }


  filterChanged(filterValue: string) {
    if (filterValue == null) {
      filterValue = '';
    }

    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.state.filter = this.dataSource.filter;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editQuiz(quizId: number): void {
    // Navigate to the first question of the selected quiz
    this.quizService.getFirstQuestionId(quizId).subscribe(questionId => {
      this.router.navigate(['/question', questionId]);
    });
  }

  delete(quiz: Quiz) {
    // Implement delete logic
  }

  read(quiz: Quiz) {
    // Implement read logic
  }

  add(quiz: Quiz) {
    // Implement add logic
  }

  create() {
    // Implement create logic
  }

  ngOnDestroy(): void {
    this.snackBar.dismiss();
  }
}
