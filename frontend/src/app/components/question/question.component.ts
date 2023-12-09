import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CodeEditorComponent } from '../code-editor/code-editor.component';
import { ActivatedRoute,Router } from '@angular/router';
import { Answer, Question } from 'src/app/models/question';
import { Query } from 'src/app/models/query';
import { QuestionService } from 'src/app/services/question.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableState } from 'src/app/helpers/mattable.state';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html'
})
export class QuestionComponent implements OnInit {
    @ViewChild('editor') editor!: CodeEditorComponent;

    dataSource: MatTableDataSource<Query> = new MatTableDataSource();
    displayedColumns: string[] = [];
    questionId!: number;
    question!: Question;
    queryResponse!: Query;
    query = "";


    constructor(
        private route: ActivatedRoute,
        private questionService: QuestionService,
        private router: Router
    ) {}

    ngAfterViewInit(): void {
        this.editor.focus();

    }

    evaluate() { 
      this.questionService.evaluate(this.questionId, this.query).subscribe(res => {
        this.question.hasAnswer = true;
        this.queryResponse = res;
        this.displayedColumns = res.columns;
        this.dataSource.data = res.data;
      });
    }

    isAtMinQuestion(): boolean {
      return this.question?.previousQuestionId == null;
    }
  
    isAtMaxQuestion(): boolean {
      return this.question?.nextQuestionId == null;
    }

    navigateToPreviousQuestion() {
        if (this.question?.previousQuestionId !== null && this.question?.previousQuestionId !== undefined) {
          this.navigateToQuestion(this.question.previousQuestionId);
        }
      }

    navigateToNextQuestion() {
        if (this.question?.nextQuestionId !== null && this.question?.nextQuestionId !== undefined) {
          this.navigateToQuestion(this.question.nextQuestionId);
        }
      }
    
    navigateToQuestion(questionId: number) {
      this.router.navigate(['/question', questionId]);
    }

    reset() {
      this.query='';
    }

    ngOnInit(): void {
      // Read the question ID from the route parameters
      this.route.params.subscribe(params => {
        this.questionId = +params['questionId']; // convert to number
        // Fetch the specific question based on the question ID
        this.questionService.getQuestion(this.questionId).subscribe(question => {
          this.question = question;
          this.query = question?.answer ?? ''; 
        });
      });
    }

}