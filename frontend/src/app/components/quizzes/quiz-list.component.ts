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
    @Input() quizType: 'test' | 'training' = 'test';
    displayedColumns: string[] = [];


  dataSource: MatTableDataSource<Quiz> = new MatTableDataSource();
  filter: string = '';
  state: MatTableState;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private quizService: QuizService,
    private stateService: StateService,
    private authService: AuthenticationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    this.state = this.stateService.quizListState;
  }

  ngOnInit():void{
    this.displayedColumns = this.quizType === 'test'
    ? ['name', 'databaseName', 'start', 'end', 'statut', 'evaluation', 'actions']
    : ['name', 'databaseName', 'statut', 'actions'];
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: Quiz, filter: string) => {
      const str = data.name + ' ' + data.statut + ' ' + data.database?.name;
      return str.toLowerCase().includes(filter);
    };

    this.state.bind(this.dataSource);
    this.refresh();
  }

  refresh() {
    const quizObservable = this.quizType === 'test'
      ? this.quizService.getTests()
      : this.quizService.getTrainings();
    
    quizObservable.subscribe(data => {
        this.dataSource.data = data;
        this.state.restoreState(this.dataSource);
        this.filter = this.state.filter;
    });
  }

  //TODO: Fix the Filter only filter the first placed component in the parent

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

  edit(quiz: Quiz) {
    // Implement edit logic
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
