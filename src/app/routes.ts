import { Routes } from '@angular/router';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { TopicComponent } from './components/topic/topic.component';
import { UsersPageComponent } from './components/users-page/users-page.component';
import { EditUserGuard } from './guards/edit-user.guard';
import { userPageGuard } from './guards/userpage.guard';

export const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'sign-in', component: SignInComponent },
    { path: 'login', component: LoginComponent },
    { path: 'edit-user', canActivate: [EditUserGuard], component: EditUserComponent },
    { path: 'topic/:id', component: TopicComponent },
    { path: 'logout', component: LogoutComponent },
    // { path: 'users-page', canActivate: [userPageGuard] ,component: UsersPageComponent }
    { path: 'users-page',component: UsersPageComponent }
];