import { Component, OnInit,Input,ViewChild, AfterViewInit } from '@angular/core';
import { Quiz } from '../../models/quiz';
import { QuizService } from '../../services/quiz.service';
import { StateService } from '../../helpers/state.service';
import { MatTableState } from '../../helpers/mattable.state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from "@angular/material/sort";
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-teacher-quizlist',
  templateUrl: './teacher-quizlist.component.html',
  styleUrls: ['./teacher-quizlist.component.css']
})
export class TeacherQuizListComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'databaseName', 'type', 'statut', 'start', 'finish', 'actions'];
  dataSource: MatTableDataSource<Quiz> = new MatTableDataSource();
  filter: string = '';
  state: MatTableState;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private quizService: QuizService,
    private stateService: StateService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    this.state = this.stateService.quizListState;
  }

  ngAfterViewInit(): void {
    // lie le datasource au sorter et au paginator
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // définit le predicat qui doit être utilisé pour filtrer les quizzes
    this.dataSource.filterPredicate = (data: Quiz, filter: string) => {
        const str = data.name + ' ' + data.statutForTeacher + ' ' + data.database?.name + ' ' + data.type
        return str.toLowerCase().includes(filter);
    };
    // établit les liens entre le data source et l'état de telle sorte que chaque fois que 
    // le tri ou la pagination est modifié l'état soit automatiquement mis à jour
    this.state.bind(this.dataSource);
    // récupère les données 
    this.refresh();
}


refresh() {
    this.quizService.getAll().subscribe(data => {
        // assigne les données récupérées au datasource
        this.dataSource.data = data;
        // restaure l'état du datasource (tri et pagination) à partir du state
        this.state.restoreState(this.dataSource);
        // restaure l'état du filtre à partir du state
        this.filter = this.state.filter;
    });
}

  filterChanged(filterValue: string) {
    //const filterValue = (e.target as HTMLInputElement).value;
    // applique le filtre au datasource (et provoque l'utilisation du filterPredicate)
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // sauve le nouveau filtre dans le state
    this.state.filter = this.dataSource.filter;
    // comme le filtre est modifié, les données aussi et on réinitialise la pagination
    // en se mettant sur la première page
    if (this.dataSource.paginator)
        this.dataSource.paginator.firstPage();
}

  edit(quiz: Quiz) {
    // Your edit logic
  }

  delete(quiz: Quiz) {
    // Your delete logic
  }

  read(quiz: Quiz) {
    // Your read logic
  }

  add(quiz: Quiz) {
    // Your add logic
  }

  create() {
    // Your create logic
  }
}