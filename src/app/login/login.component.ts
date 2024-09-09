import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.username === this.username && u.password === this.password);

    if (user) {
      // Store the token and user details
      localStorage.setItem('authToken', 'dummy-token');
      localStorage.setItem('username', user.username);
      localStorage.setItem('currentUserRole', user.role); // Store role*
      localStorage.setItem('currentUsercin',user.cinNumber);
      localStorage.setItem('currentUserphoto',user.profilePhoto);
      localStorage.setItem('description',user.description);
      localStorage.setItem('email',user.email)
      this.router.navigate(['/main']);
    } else {
      alert('Invalid credentials');
    }
  }
}
