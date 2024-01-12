import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup,Validators,FormControl } from "@angular/forms";
import { CodeEditorComponent } from '../code-editor/code-editor.component';
import { ActivatedRoute, Router } from "@angular/router";
import { NgModule } from '@angular/core';
import { Quiz } from "src/app/models/quiz";
import { QuizService } from "src/app/services/quiz.service";
import { plainToClass, plainToInstance } from "class-transformer";
import * as _ from 'lodash-es';
import { Database } from "src/app/models/database";
import { DatabaseService } from "src/app/services/database.service";
import { Question, Solution } from "src/app/models/question";
import { QuestionService } from "src/app/services/question.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'app-quiz-edition',
    templateUrl: './quiz-edition.component.html'
})
export class QuizEditionComponent implements OnInit{
    @ViewChild('editor') editor!: CodeEditorComponent;
    quizId!: number;
    quiz!: Quiz;
    quizForm!: FormGroup;
    ctlQuizName!: FormControl;
    ctlDescription!: FormControl;
    ctlStartDate!: FormControl;
    ctlEndDate!: FormControl;
    ctlDatabase!: FormControl;
    ctlQuizType!: FormControl;
    ctlPublished!: FormControl;
    ctlQuery!: FormControl;
    submitted=false;
    solutions!: Solution[];
    databases!: Database[];
    questions!: Question[];
    panelStates: boolean[] = [];
    canEdit = true;
    db: string = "";
    

    constructor(
        private route: ActivatedRoute,
        private quizService: QuizService,
        private databaseService: DatabaseService,
        private questionService: QuestionService,
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        private router: Router,
    ) {
        this.ctlQuizName = this.formBuilder.control('', [
            Validators.required,
            Validators.minLength(3),
        ],[]);
        this.ctlDatabase = this.formBuilder.control('', []);
        this.ctlPublished = this.formBuilder.control(false);
        this.ctlQuizType = this.formBuilder.control(false);
        this.ctlDescription = this.formBuilder.control('', []);
        this.ctlStartDate = this.formBuilder.control(null, []);
        this.ctlEndDate = this.formBuilder.control(null, []);


        this.quizForm = this.formBuilder.group({
            name: this.ctlQuizName,
            description: this.ctlDescription,
            startDate: this.ctlStartDate,
            endDate: this.ctlEndDate,
            database: this.ctlDatabase,
            isTest: this.ctlQuizType,
            isPublished: this.ctlPublished,
            questions: this.formBuilder.array([]),
        });

        
        
    }
    private isValidationInProgress = false;

    refresh(){
        this.quizService.getQuizById(this.quizId).subscribe(quiz => {
            this.quiz = quiz;
            if(this.quiz.isTest && this.quiz.attempts && this.quiz.attempts.length > 0){
                this.canEdit = false;
                this.quizForm.disable();
            }
            this.ctlQuizName.setValue(this.quiz.name);
            this.ctlDescription.setValue(this.quiz.description);
            this.ctlStartDate.setValue(this.quiz.startDate);
            this.ctlEndDate.setValue(this.quiz.endDate);
            this.ctlQuizType.setValue(this.quiz.isTest);
            this.ctlPublished.setValue(this.quiz.isPublished);
            this.setSelectedDatabase();
            this.quizForm.updateValueAndValidity();
            if (this.quiz.isTest) {
                this.ctlStartDate.setValidators([Validators.required, this.validateStartDate()]);
                this.ctlEndDate.setValidators([Validators.required, this.validateEndDate()]);
            }
            this.questions = this.quiz.questions ?? [];
            this.questions = this.questions.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            for(let question of this.questions){
                question.solutions = question.solutions?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            }
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if(params['quizId'] === undefined || params['quizId'] === null || params['quizId'] === '' || isNaN(+params['quizId']) ){
                this.router.navigate(['/teacher']);
            }
            this.quizId = +params['quizId']; // convert to number
            if (this.quizId > 0) {
                this.quizService.getQuizById(this.quizId).subscribe(
                  res => {
                    if (res === null) {
                      this.router.navigate(['/teacher']);
                    }
                  },
                  error => {
                    console.error('Error fetching question:', error);
                    this.router.navigate(['/teacher']);
                  }
                );
              }
            // Fetch the specific question based on the question ID
            this.databaseService.getAll().subscribe(databases => {
                this.databases = databases;
            });
            this.quizForm.markAllAsTouched();
            this.ctlQuizType.valueChanges.subscribe(value => {
                if(value===true){
                    this.ctlStartDate.setValidators([Validators.required,this.validateStartDate()]);
                    this.ctlEndDate.setValidators([Validators.required, this.validateEndDate()]);
                }
                else{
                    this.ctlStartDate.clearValidators();
                    this.ctlEndDate.clearValidators();
                }
                this.ctlStartDate.updateValueAndValidity();
                this.ctlEndDate.updateValueAndValidity();
            });

            this.ctlStartDate.valueChanges.subscribe(value => {
                if (!this.isValidationInProgress) {
                    this.isValidationInProgress = true;
                    this.validateDateRange();
                    this.isValidationInProgress = false;
                }
            });
            
            this.ctlEndDate.valueChanges.subscribe(value => {
                if (!this.isValidationInProgress) {
                    this.isValidationInProgress = true;
                    this.validateDateRange();
                    this.isValidationInProgress = false;
                }
            });

            this.subscribeToDatabaseChanges();

            if(this.quizId === 0){
                this.quiz = new Quiz();
                this.questions = [];
            }else{
                this.refresh();
            }
        
            this.ctlQuizName.valueChanges.subscribe(value => {
                const trimmedValue = value.trim();
                if (trimmedValue.length === 0 || trimmedValue.length < 3) {
                    this.ctlQuizName.setErrors({ minlength: true });
                } else {
                    this.ctlQuizName.setErrors(null);
                }
            });
        });
       
        
    }

    subscribeToDatabaseChanges(): void {
        this.ctlDatabase.valueChanges.subscribe(value => {
            this.db = this.databases.find(d => d.id === value)?.name ?? '';
        });
    }

    setSelectedDatabase(): void {
        const selectedDatabaseId = this.quiz.database?.id;
        if (selectedDatabaseId!==undefined) {
            this.ctlDatabase.setValue(selectedDatabaseId);
        }
    }

    getQuestionsErrors(): string[] {
        const errors: string[] = [];
        if (this.questions?.length === 0 || this.questions === undefined || this.questions === null) {
            errors.push('Aucune Question');
        }else{
            for(let question of this.questions){
                if(question.body === undefined || question.body === null || question.body.trim() === ''|| question.body.trim().length < 2 ){
                    errors.push('Intitulé de la question doit contenir minimum 2 caractères ');
                }else{
                    if(question.solutions?.length === 0){
                        errors.push('Aucune Solution');
                    }else{
                        for(let solution of question.solutions ?? []){
                            if(solution.sql === undefined || solution.sql === null || solution.sql.trim() === '' ){
                                errors.push('Aucune solutions ne peut être vide');
                            }
                        }
                    }
                }
               
            }
        }
        return errors;
    }

    update(){
        this.submitted = true;
        if(this.quizForm.invalid || this.getQuestionsErrors().length > 0){
            return;
        }

        if(this.quiz.id === 0 || this.quiz.id === undefined){
            let res = plainToClass(Quiz, this.quizForm.value);
            res.database = this.databases.find(d => d.id === this.ctlDatabase.value);
            res.questions = this.questions;
            this.quizService.createQuiz(res).subscribe(res => {
                this.router.navigate(['/teacher']);
            });
        }else{
            _.assign(this.quiz, this.quizForm.value);
            this.quiz.questions = this.questions;
            this.quiz.database = this.databases.find(d => d.id === this.ctlDatabase.value);
            this.quizService.updateQuiz(this.quiz).subscribe(res => {
                this.router.navigate(['/teacher']);
            });
        }

    }

    getDBName(): string{
        if(this.quiz !== undefined){
            return this.quiz.database?.name ?? '';
        }else{
            return this.db;
        }

    }

    hasQuestionAfter(question: Question): boolean{
        const index = this.questions.indexOf(question);
            return !(index !== undefined && index < this.questions.length-1);
    }

    hasQuestionBefore(question: Question): boolean{
        const index = this.questions.indexOf(question);
        return !(index !== undefined && index > 0);
    }

    hasSolutionAfter(solution: Solution, question: Question): boolean {
        const index = question.solutions?.indexOf(solution);
        return !(index !== undefined && index < (question?.solutions?.length ?? 0) - 1);
    }

    hasSolutionBefore(solution: Solution, question: Question): boolean {
        const index = question.solutions?.indexOf(solution);
        return !(index !== undefined && index > 0);
    }

    moveSolutionUp(solution: Solution, question: Question){
        const index = question.solutions?.indexOf(solution);
        if(index!==undefined && index>0){
            if(question.solutions && question.solutions.length > 0){
            let temp = question.solutions[index-1];
            question.solutions[index-1] = solution;
            question.solutions[index] = temp;
            question.solutions[index-1].order = index;
            question.solutions[index].order = index+1;
            }
        }
    }

    moveSolutionDown(solution: Solution, question: Question){
        const index = question.solutions?.indexOf(solution);
        if(index!==undefined && index<(question?.solutions?.length ?? 0)-1){
            if(question.solutions && question.solutions.length > 0){
                let temp = question.solutions[index+1];
                question.solutions[index+1] = solution;
                question.solutions[index] = temp;
                question.solutions[index+1].order = index+2;
                question.solutions[index].order = index+1;
            }     
        }
    }

    deleteSolution(solution: Solution, question: Question){
        question.solutions = question.solutions?.filter(s => s !== solution);       
    }

    delete(Quiz: Quiz){
        const dialogRef = this.dialog.open(DialogComponent,{data: {title: 'Supprimer ce quiz', message: 'Attention, totutes les questions et tous les essais associés seront supprimé. Etes-vous sûr ?'}});
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                this.quizService.deleteQuiz(Quiz).subscribe(res => {
                    this.router.navigate(['/teacher']);
                });
            } 
        });
        
    }

    deleteQuestion(question: Question){
         this.questions = this.questions?.filter(q => q.id !== question.id);
    }

    moveQuestionUp(question: Question){
        const index = this.questions.indexOf(question);
        if(index>0){
            let temp = this.questions[index-1];
            this.questions[index-1] = question;
            this.questions[index] = temp;
            this.questions[index-1].order = index;
            this.questions[index].order = index+1;
        }
    }

    moveQuestionDown(question: Question){
        const index = this.questions.indexOf(question);
        if(index<this.questions.length-1){
            let temp = this.questions[index+1];
            this.questions[index+1] = question;
            this.questions[index] = temp;
            this.questions[index+1].order = index+2;
            this.questions[index].order = index+1;
            }
    }

    addQuestion(){
        let question = new Question();
        question.order = this.questions.length+1;
        question.solutions = [];
        this.questions.push(question);
        this.subscribeToDatabaseChanges();
    }

    addSolution(question: Question){
        let solution = new Solution();
        solution.order = question.solutions?.length ?? 0;
        question.solutions?.push(solution);
    }

    validateDateRange(): void {
        const startDate: Date | null = this.ctlStartDate.value;
        const endDate: Date | null = this.ctlEndDate.value;
    
        if (startDate && endDate && startDate > endDate) {
            this.ctlStartDate.setErrors({ startDateAfterEndDate: true });
            this.ctlEndDate.setErrors({ endDateBeforeStartDate: true });
        } else {
            this.ctlStartDate.setErrors(null);
            this.ctlEndDate.setErrors(null);
        }
    
        this.ctlStartDate.updateValueAndValidity();
        this.ctlEndDate.updateValueAndValidity();
    }
    validateEndDate():any{
        return (ctl:FormControl) => {
            const startDate: Date = this.ctlStartDate.value;
            const endDate: Date = ctl.value;
            if (startDate && endDate) {
                if (endDate < startDate) {
                    return { endDateBeforeStartDate: true };
                }
            }
            return null;
        }
    }

    validateStartDate():any{
        return (ctl:FormControl) => {
            const startDate: Date = ctl.value;
            const endDate: Date = this.ctlEndDate.value;
            if (startDate && endDate) {
                if (endDate < startDate) {
                    return { startDateAfterEndDate: true };
                }
            }
            return null;
        }
    }

    quizNameUsed(initialValue : string):any{
        let timeout: NodeJS.Timeout;
        let previousValue = initialValue;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const quizName = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    this.quizService.getQuizNameExists(quizName).subscribe(res => {
                        if (ctl.pristine) {
                            resolve(null);
                        } else {
                            resolve(res ? { quizNameUsed: true } : null);
                        }
                    });
                }, 300);
            });
        };
    }
}