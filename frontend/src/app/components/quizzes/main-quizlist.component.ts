import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { QuizListComponent } from './quiz-list.component';

@Component({
    selector: 'app-main-quizlist',
    templateUrl: './main-quizlist.component.html',
})
export class MainQuizListComponent{
    @ViewChild(QuizListComponent) child!: QuizListComponent
    filter: string = '';

    onFilterChanged(value: string) {
        this.filter = value;
        this.child.filterChanged(value);
    }

    

}