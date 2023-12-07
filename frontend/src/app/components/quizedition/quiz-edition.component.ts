import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Quiz } from "src/app/models/quiz";
import { QuizService } from "src/app/services/quiz.service";


@Component({
    selector: 'app-quiz-edition',
    templateUrl: './quiz-edition.component.html'
})
export class QuizEditionComponent{
    quizId!: number;
    quiz!: Quiz;

    constructor(
        private route: ActivatedRoute,
        private quizService: QuizService,
        private router: Router
    ) {}
    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.quizId = +params['quizId']; // convert to number
            // Fetch the specific question based on the question ID
           this.quizService.getQuizById(this.quizId).subscribe(quiz => {
               this.quiz = quiz;
           });
        });
    }
}