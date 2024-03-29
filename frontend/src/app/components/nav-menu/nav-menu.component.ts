import { Component } from '@angular/core';
import { User, Role } from '../../models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
    isExpanded = false;

    constructor(public authenticationService: AuthenticationService, private router: Router) { }

    collapse() {
        this.isExpanded = false;
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
    }

    get currentUser() {
        return this.authenticationService.currentUser;
    }
    get isTeacher() {
        return this.currentUser && this.currentUser.role === Role.Teacher;
    }
    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
