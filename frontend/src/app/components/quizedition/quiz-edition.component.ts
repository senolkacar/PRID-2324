import { Component, ViewChild } from "@angular/core";
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
import { pl } from "date-fns/locale";
import { Question, Solution } from "src/app/models/question";
import { QuestionService } from "src/app/services/question.service";

@Component({
    selector: 'app-quiz-edition',
    templateUrl: './quiz-edition.component.html'
})
export class QuizEditionComponent{
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
    panelOpenState = false;

    constructor(
        private route: ActivatedRoute,
        private quizService: QuizService,
        private databaseService: DatabaseService,
        private questionService: QuestionService,
        private formBuilder: FormBuilder,
        private router: Router,
    ) {
        this.ctlQuizName = this.formBuilder.control('', [
            Validators.required,
            Validators.minLength(3)
        ], [this.quizNameUsed()]);
        this.ctlDatabase = this.formBuilder.control('', []);
        this.ctlPublished = this.formBuilder.control(false);
        this.ctlQuizType = this.formBuilder.control(false);
        this.ctlDescription = this.formBuilder.control('', []);
        this.ctlStartDate = this.formBuilder.control('', []);
        this.ctlEndDate = this.formBuilder.control('', []);
        this.ctlQuery = this.formBuilder.control('', []);


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

    refresh(){
        this.quizService.getQuizById(this.quizId).subscribe(quiz => {
            this.quiz = quiz;
            this.ctlQuizName.setValue(this.quiz.name);
            this.ctlDescription.setValue(this.quiz.description);
            this.ctlStartDate.setValue(this.quiz.startDate);
            this.ctlEndDate.setValue(this.quiz.endDate);
            this.ctlQuizType.setValue(this.quiz.isTest);
            this.ctlPublished.setValue(this.quiz.isPublished);
            this.questionService.getQuestionByQuizId(this.quizId).subscribe(questions => {
                this.setSelectedDatabase();
                this.questions = questions;
                for (let question of this.questions) {
                    question.solutions = question.solutions?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                }
            });
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.quizId = +params['quizId']; // convert to number
            // Fetch the specific question based on the question ID
            if(this.quizId === 0){
                this.quiz = new Quiz();
            }else{
                this.refresh();
            }
         
        });
        this.databaseService.getAll().subscribe(databases => {
            this.databases = databases;
        });
        
    }

    setSelectedDatabase(): void {
        const selectedDatabaseId = this.quiz.database?.id;
        if (selectedDatabaseId!==undefined) {
            this.ctlDatabase.setValue(selectedDatabaseId);
        }
    }

    update(){
        this.submitted = true;
        if(this.quizForm.invalid){
            return;
        }

        if(this.quiz.id === 0 || this.quiz.id === undefined){
            let res = plainToClass(Quiz, this.quizForm.value);
            res.database = this.databases.find(d => d.id === this.ctlDatabase.value);
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

    hasQuestionAfter(question: Question): boolean{
        const index = this.questions.indexOf(question);
        return !(index < this.questions.length-1);  
    }

    hasQuestionBefore(question: Question): boolean{
        const index = this.questions.indexOf(question);
        return !(index > 0);
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
        if(solution.id !== undefined){
            question.solutions = question.solutions?.filter(s => s.id !== solution.id);
        }
       
    }

    delete(Quiz: Quiz){
        this.quizService.deleteQuiz(Quiz).subscribe(res => {
            this.router.navigate(['/teacher']);
        });
    }

    deleteQuestion(question: Question){
         this.questions = this.questions.filter(q => q.id !== question.id);
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
    }

    addSolution(question: Question){
        let solution = new Solution();
        solution.order = question.solutions?.length ?? 0;
        question.solutions?.push(solution);
    }
    quizNameUsed():any{
        let timeout: NodeJS.Timeout;
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