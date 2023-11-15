import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { StateService } from '../../helpers/state.service';
import { MatTableState } from '../../helpers/mattable.state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from "@angular/material/sort";
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../services/authentication.service';
import { format, formatISO } from 'date-fns';
import { Quiz } from '../../models/quiz';
import { plainToClass } from 'class-transformer';

@Component({
    selector: 'app-quizlist',
    templateUrl: './quizlist.component.html',
    styleUrls: ['./quizlist.component.css']
})
export class QuizListComponent {
}
