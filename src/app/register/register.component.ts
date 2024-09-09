import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  prenom: string = '';
  role: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  cin: string = '';
  profilePhoto: string = '';

  constructor(private router: Router) {}

  register() {
    const newUser = {
      username: this.username,
      prenom: this.prenom,
      role: this.role,
      email: this.email,
      phone: this.phone,
      password: this.password,
      cinNumber: this.cin, // Store CIN number as unique identifier
      profilePhoto: this.profilePhoto
    };

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    localStorage.setItem('currentUserCin', this.cin); // Store CIN number for the current user

    this.router.navigate(['/login']);
  }
}
