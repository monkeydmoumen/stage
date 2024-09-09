import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainContentComponent } from './main-content/main-content.component';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './auth.guard';
import { ChatUiComponent } from './chat-ui/chat-ui.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '', component: MainContentComponent },
  { path: 'chat-ui', component: ChatUiComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile/:cin', component: ProfileComponent },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'main', component: MainContentComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' },
];
