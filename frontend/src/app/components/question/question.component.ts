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

    query = "SELECT *\nFROM P\nWHERE COLOR='Red'";

    questionId!: number;
    firstQuestionId!: number;
    lastQuestionId!: number;
    question!: Question;




    constructor(
        private route: ActivatedRoute,
        private questionService: QuestionService,
        private router: Router
    ) {}

    ngAfterViewInit(): void {
        this.editor.focus();

    }

    isAtMinQuestion(): boolean {
      return this.questionId <= this.firstQuestionId;
    }
  
    isAtMaxQuestion(): boolean {
      return this.questionId >= this.lastQuestionId;
    }

    navigateToPreviousQuestion() {
        if (this.questionId > this.firstQuestionId) {
          this.navigateToQuestion(this.questionId - 1);
        }
      }
    
    navigateToNextQuestion() {
        if (this.questionId < this.lastQuestionId) {
          this.navigateToQuestion(this.questionId + 1);
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
                this.questionService.getFirstQuestionId(this.question.quiz?.id!).subscribe(id => {
                    this.firstQuestionId = id;
                });
                this.questionService.getLastQuestionId(this.question.quiz?.id!).subscribe(id => {
                    this.lastQuestionId = id;
                });

            });
        });
    }

}