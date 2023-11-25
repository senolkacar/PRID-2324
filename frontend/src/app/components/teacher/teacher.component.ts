import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { TeacherQuizListComponent } from './teacher-quizlist.component';

@Component({
    selector: 'app-teacher',
    templateUrl: './teacher.component.html',
})
export class TeacherComponent{
    @ViewChild(TeacherQuizListComponent) child!: TeacherQuizListComponent;
    filter: string = '';

    onFilterChanged(value: string) {
        this.filter = value;
        this.child.filterChanged(value);
    }

    

}