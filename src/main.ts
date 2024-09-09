import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { WebSocketService } from './app/web-socket.service'
import { UserService } from './user/user.service';

bootstrapApplication(AppComponent, {
  providers: [
    UserService,
    provideRouter(routes),
    FormsModule,
    provideHttpClient(),
    importProvidersFrom(RouterModule),
    WebSocketService
  ]
}).catch(err => console.error(err));
