import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DefaultValueAccessor, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';
import { AppRoutes } from '../routing/app.routing';
import { AppComponent } from '../components/app/app.component';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { HomeComponent } from '../components/home/home.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { TeacherComponent } from '../components/teacher/teacher.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared.module';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { fr } from 'date-fns/locale';
import { MainQuizListComponent } from '../components/quizzes/main-quizlist.component';
import { QuestionComponent } from '../components/question/question.component';
import { CodeEditorComponent } from '../components/code-editor/code-editor.component';
import { QuizListComponent } from '../components/quizzes/quiz-list.component';
import { QuizEditionComponent } from '../components/quizedition/quiz-edition.component';
import { FilterComponent } from '../components/quizzes/filter.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        QuizListComponent,
        MainQuizListComponent,
        QuestionComponent,
        CodeEditorComponent,
        QuizEditionComponent,
        FilterComponent,
        TeacherComponent,
        LoginComponent,
        SignupComponent,
        UnknownComponent,
        RestrictedComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatRadioModule,
        AppRoutes,
        MatExpansionModule,
        BrowserAnimationsModule,
        SharedModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: fr },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['dd/MM/yyyy'],
        },
        display: {
          dateInput: 'dd/MM/yyyy',
          monthYearLabel: 'MMM yyyy',
          dateA11yLabel: 'dd/MM/yyyy',
          monthYearA11yLabel: 'MMM yyyy',
        },
      },
    },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {
    DefaultValueAccessor.prototype.registerOnChange = function (fn: (_: string | null) => void): void {
      this.onChange = (value: string | null) => {
          fn(value === '' ? null : value);
      };
    };
  }
}
