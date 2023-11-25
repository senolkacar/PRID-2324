import {Routes, RouterModule} from '@angular/router';

import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { AuthGuard } from '../services/auth.guard';
import { Role } from '../models/user';
import { TeacherComponent } from '../components/teacher/teacher.component';
import { MainQuizListComponent } from '../components/quizzes/main-quizlist.component';


const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'quizzes', component: MainQuizListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Student,Role.Teacher] } 
  },
  {path:'teacher',component: TeacherComponent,
    canActivate:[AuthGuard],
    data: {roles: [Role.Teacher]}
    },
  {path: 'restricted', component: RestrictedComponent},
  { path: '**', component: UnknownComponent }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
