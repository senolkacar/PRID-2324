import {Routes, RouterModule} from '@angular/router';

import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/login/login.component';
import { CounterComponent } from '../components/counter/counter.component';
import { UserListComponent } from '../components/userlist/userlist.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { AuthGuard } from '../services/auth.guard';
import { Role } from '../models/user';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'counter', component: CounterComponent },
  { path: 'login', component: LoginComponent },
  {path: 'users', component: UserListComponent},
  {path: 'restricted', component: RestrictedComponent},
  { path: '**', component: UnknownComponent }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
