import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CodeEditorComponent } from '../code-editor/code-editor.component';
import { ActivatedRoute,Router } from '@angular/router';
import { Question } from 'src/app/models/question';
import { QuestionService } from 'src/app/services/question.service';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html'
})
export class QuestionComponent implements OnInit {
    @ViewChild('editor') editor!: CodeEditorComponent;

    questionId!: number;
    question!: Question;
    query = "";




    constructor(
        private route: ActivatedRoute,
        private questionService: QuestionService,
        private router: Router
    ) {}

    ngAfterViewInit(): void {
        this.editor.focus();

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