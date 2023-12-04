import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { QuizListComponent } from '../quizzes/quiz-list.component';

@Component({
    selector: 'app-teacher',
    templateUrl: './teacher.component.html',
})
export class TeacherComponent{
    @ViewChild(QuizListComponent) child!: QuizListComponent
    filter: string = '';

    onFilterChanged(value: string) {
        this.filter = value;
    }

    

}