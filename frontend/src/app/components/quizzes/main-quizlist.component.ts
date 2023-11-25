import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { TestListComponent } from './test-list.component';
import { TrainingListComponent } from './training-list.component';

@Component({
    selector: 'app-main-quizlist',
    templateUrl: './main-quizlist.component.html',
})
export class MainQuizListComponent{
    @ViewChild(TestListComponent) firstChild!: TestListComponent
    @ViewChild(TrainingListComponent) secondChild!: TrainingListComponent
    filter: string = '';

    onFilterChanged(value: string) {
        this.filter = value;
        this.firstChild.filterChanged(value);
        this.secondChild.filterChanged(value);
      }

    

}