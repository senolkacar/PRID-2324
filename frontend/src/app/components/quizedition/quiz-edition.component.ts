import { Component } from "@angular/core";
import { FormBuilder, FormGroup,Validators,FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Quiz } from "src/app/models/quiz";
import { QuizService } from "src/app/services/quiz.service";
import { plainToClass, plainToInstance } from "class-transformer";
import { Database } from "src/app/models/database";
import { DatabaseService } from "src/app/services/database.service";

@Component({
    selector: 'app-quiz-edition',
    templateUrl: './quiz-edition.component.html'
})
export class QuizEditionComponent{
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
    submitted=false;
    databases!: Database[];

    constructor(
        private route: ActivatedRoute,
        private quizService: QuizService,
        private databaseService: DatabaseService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
        this.ctlQuizName = this.formBuilder.control('', [
            Validators.required,
            Validators.minLength(3)
        ], [this.quizNameUsed()]);
        this.ctlDatabase = this.formBuilder.control('', [Validators.required]);
        this.ctlPublished = this.formBuilder.control(false);
        this.ctlQuizType = this.formBuilder.control(false);
        this.ctlDescription = this.formBuilder.control('', []);
        this.ctlStartDate = this.formBuilder.control('', []);
        this.ctlEndDate = this.formBuilder.control('', []);


        this.quizForm = this.formBuilder.group({
            name: this.ctlQuizName,
            description: this.ctlDescription,
            startDate: this.ctlStartDate,
            endDate: this.ctlEndDate,
            database: this.ctlDatabase,
            isTest: this.ctlQuizType,
            isPublished: this.ctlPublished
        });
        
    }
    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.quizId = +params['quizId']; // convert to number
            // Fetch the specific question based on the question ID
            if(this.quizId === 0){
                this.quiz = new Quiz();
                this.quiz.id = 0;
                this.quiz.name = '';
                this.quiz.description = '';
                this.quiz.startDate = new Date();
                this.quiz.endDate = new Date();
                this.quiz.isTest = false;
                this.quiz.isPublished = false;
                this.quiz.database = new Database();
                this.quiz.database.id = 0;
                this.quiz.database.name = '';
                this.quiz.questions = [];
            }else{
                this.quizService.getQuizById(this.quizId).subscribe(quiz => {
                    this.quiz = quiz;
                    this.ctlQuizName.setValue(this.quiz.name);
                    this.ctlDescription.setValue(this.quiz.description);
                    this.ctlStartDate.setValue(this.quiz.startDate);
                    this.ctlEndDate.setValue(this.quiz.endDate);
                    this.ctlQuizType.setValue(this.quiz.isTest);
                    this.ctlPublished.setValue(this.quiz.isPublished);
                    this.setSelectedDatabase();
                });
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

    refresh(): void {
        this.quiz.name = this.ctlQuizName.value;
        this.quiz.description = this.ctlDescription.value;
        this.quiz.startDate = this.ctlStartDate.value;
        this.quiz.endDate = this.ctlEndDate.value;
        this.quiz.isTest = this.ctlQuizType.value;
        this.quiz.isPublished = this.ctlPublished.value;
        this.quiz.database = this.databases.find(d => d.id === this.ctlDatabase.value);
    }


    update(){
        this.submitted = true;
        if(this.quizForm.invalid){
            return;
        }
        if(this.quiz.id === 0 || this.quiz.id === undefined){
            this.quizService.createQuiz(this.quiz).subscribe(res => {
                this.router.navigate(['/teacher']);
            });
        }else{
            this.quiz.name = this.ctlQuizName.value;
            this.quiz.description = this.ctlDescription.value;
            this.quiz.startDate = this.ctlStartDate.value;
            this.quiz.endDate = this.ctlEndDate.value;
            this.quiz.isTest = this.ctlQuizType.value;
            this.quiz.isPublished = this.ctlPublished.value;
            this.quiz.database = this.databases.find(d => d.id === this.ctlDatabase.value);
            this.quizService.updateQuiz(this.quiz).subscribe(res => {
                this.router.navigate(['/teacher']);
            });
        }

    }

    delete(Quiz: Quiz){
        this.quizService.deleteQuiz(Quiz).subscribe(res => {
            this.router.navigate(['/teacher']);
        });
    }

    quizNameUsed():any{
        let timeout: NodeJS.Timeout;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const quizName = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    this.quizService.getQuizNameExists(quizName).subscribe(res => {
                        if (res) {
                            resolve({ quizNameUsed: true });
                        } else {
                            resolve(null);
                        }
                    });
                }, 300);
            });
        };
    }
}