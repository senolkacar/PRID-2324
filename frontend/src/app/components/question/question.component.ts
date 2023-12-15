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
    solutionVisible = false;
    questionId!: number;
    question!: Question;
    answer!: Answer;
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
      if (this.query !== '') {
        this.questionService.evaluate(this.questionId, this.query).subscribe(res => {
          this.question.hasAnswer = true;
          this.question.query = res;
          this.displayedColumns = res.columns;
          this.dataSource.data = res.data;
          if(res.errors.length ===0){
            this.answer.isCorrect = true;
          }
        });
      }
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
      this.solutionVisible = false;
      this.router.navigate(['/question', questionId]);
    }

    setSolutionVisible() {
      this.solutionVisible = true;
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
          this.answer = question?.answer!;
          this.query = question?.answer?.sql ?? '';
          if(this.question.hasAnswer && this.answer.isCorrect){
            let queryResponse = this.questionService.getQuery(this.questionId);
            queryResponse.subscribe(res => {
              this.question.query = res;
              this.displayedColumns = res.columns;
              this.dataSource.data = res.data;
            });
          }
          console.log(this.question);
        });
      });
    }

}