import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { QuizListComponent } from '../quizzes/quiz-list.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-teacher',
    templateUrl: './teacher.component.html',
})
export class TeacherComponent{
    @ViewChild(QuizListComponent) child!: QuizListComponent
    filter: string = '';
    constructor(
        private router: Router
    ) {}

    onFilterChanged(value: string) {
        this.filter = value;
    }

    
    createQuiz() {
       this.router.navigate(['/quizedition/0']);
    }
}