import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CodeEditorComponent } from '../code-editor/code-editor.component';
import { ActivatedRoute,Router } from '@angular/router';
import { Answer, Question } from 'src/app/models/question';
import { Query } from 'src/app/models/query';
import { QuizStateService } from 'src/app/services/quiz-state.service';
import { QuestionService } from 'src/app/services/question.service';
import { QuizService } from 'src/app/services/quiz.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

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
    readonlyMode = false;
    query = "";
    showResultMessage = true;
    sendButtonVisibility = true;
    resetButtonVisibility = true;
    solutionButtonVisibility = true;
  

    constructor(
        private route: ActivatedRoute,
        private questionService: QuestionService,
        private quizService: QuizService,
        private router: Router,
        private quizStateService: QuizStateService,
        public dialog: MatDialog
    ) {}

    ngAfterViewInit(): void {
        this.editor.focus();
    }

    evaluate() { 
      if (this.query.trim() !== '') {
        if(this.question.quiz?.attempts?.length ?? 0 > 0){
          this.createAttempt();
        }
        this.questionService.evaluate(this.questionId, this.query).subscribe(res => {
          this.question.hasAnswer = true;
          this.question.query = res;
          this.displayedColumns = res.columns;
          this.dataSource.data = res.data;
          if(res.errors.length ===0){
            this.answer.isCorrect = true;
          }
          this.refresh();
        });
      }else{
        this.question.query = undefined;
        this.displayedColumns = [];
        this.dataSource.data = [];
        this.showResultMessage = false;
      }
    }

    isAtMinQuestion(): boolean {
      return this.question?.previousQuestionId == null;
    }
  
    isAtMaxQuestion(): boolean {
      return this.question?.nextQuestionId == null;
    }

    hasAttempt(): boolean{
      return (this.question?.quiz?.attempts?.length ?? 0) > 0;
    }

    canSendQuery(): boolean {
      return this.query.trim() !== ''
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
      this.showResultMessage = true;
      if(!this.readonlyMode){
        this.editor.readOnly = false;
      }
      this.router.navigate(['/question', questionId]);
    }

    setSolutionVisible() {
      this.solutionVisible = true;
      this.editor.readOnly = true;
    }

    closeQuiz(): void {
      const dialogRef = this.dialog.open(DialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // User clicked 'Oui', call the service to close the quiz
          const quizId = this.question?.quiz?.id;
          if (quizId !== undefined) {
            this.quizService.closeQuiz(quizId).subscribe(response => {
              // Handle success, e.g., redirect to /quizzes
              this.router.navigate(['/quizzes']);
            }, error => {
              // Handle error
            });
          }
        } else {
          // User clicked 'Non', do nothing or handle as needed
        }
      });
    }

    reset() {
      this.query='';
      this.solutionVisible = false;
      this.editor.readOnly = false;
      this.question.query = undefined;
      this.displayedColumns = []; 
      this.dataSource.data = [];
      this.showResultMessage = false;
    }

    refresh() {
      this.questionService.getQuestion(this.questionId).subscribe(question => {
        //const readonlyMode = this.quizStateService.isReadOnlyMode();
        this.question = question;
        console.log(this.question.quiz)
        this.answer = question?.answer!;
        this.query = question?.answer?.sql ?? '';
        if (this.question.quiz?.statut === 'FINI' || question.quiz?.statut === 'CLOTURE') {
          this.editor.readOnly = true;
          this.readonlyMode = true;
          this.sendButtonVisibility = false;
          this.resetButtonVisibility = false;
          this.solutionButtonVisibility = false;
          this.solutionVisible = true;
        }
        if(this.question.quiz?.isTest && this.question.quiz?.statut === 'EN_COURS'){
          this.solutionButtonVisibility = false;
          this.solutionVisible = false
          this.showResultMessage = false;
        }
        if(this.question.hasAnswer){
          this.questionService.getQuery(this.questionId).subscribe(res => {
            this.question.query = res;
            this.displayedColumns = res.columns;
            this.dataSource.data = res.data;
          });
        }
      });
      
    }

    ngOnInit(): void {
      // Read the question ID from the route parameters
      this.route.params.subscribe(params => {
        this.questionId = +params['questionId']; // convert to number
        // Fetch the specific question based on the question ID
        this.refresh();
    });
  }

    createAttempt():void{
      this.quizService.createAttempt(this.question?.quiz?.id ?? 0).subscribe(response => {
      });
    }

}