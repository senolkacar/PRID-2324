import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DefaultValueAccessor, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutes } from '../routing/app.routing';
import { AppComponent } from '../components/app/app.component';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { HomeComponent } from '../components/home/home.component';
import { TrainingListComponent } from '../components/quizzes/training-list.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';
import { LoginComponent } from '../components/login/login.component';
import { TeacherQuizListComponent } from '../components/teacher/teacher-quizlist.component';
import { SignupComponent } from '../components/signup/signup.component';
import { FilterComponent } from '../components/teacher/filter.component';
import { TeacherComponent } from '../components/teacher/teacher.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared.module';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { fr } from 'date-fns/locale';
import { TestListComponent } from '../components/quizzes/test-list.component';
import { MainQuizListComponent } from '../components/quizzes/main-quizlist.component';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        TrainingListComponent,
        TestListComponent,
        MainQuizListComponent,
        FilterComponent,
        TeacherQuizListComponent,
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
        AppRoutes,
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
