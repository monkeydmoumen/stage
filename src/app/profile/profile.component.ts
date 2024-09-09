import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../user/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = {
    userId: 0,
    username: '',
    firstName: '',
    role: '',
    email: '',
    phone: '',
    password: '',
    cinNumber: '',
    profilePhoto: '',
    description: ''
  };
  newPassword: string = ''; // For updating the password
  editMode: boolean = false;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const cin = params['cin'];
      this.loadUserProfile(cin);
    });
  }

  loadUserProfile(cin: string) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find((user: User) => user.cinNumber === cin);
    if (currentUser) {
      this.user = currentUser;
    } else {
      console.error('User not found in local storage.');
    }
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  onProfilePicSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.user.profilePhoto = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async saveChanges() {
    try {
      const updates: Partial<User> = {
        username: this.user.username,
        email: this.user.email,
        description: this.user.description,
      };

      if (this.newPassword) {
        updates.password = this.newPassword;
      }

      const updatedUser = await this.userService.updateProfile(this.user.cinNumber, updates);

      if (updatedUser) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const index = users.findIndex((user: User) => user.cinNumber === this.user.cinNumber);
        if (index !== -1) {
          users[index] = updatedUser;
          localStorage.setItem('users', JSON.stringify(users));
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
        this.toggleEdit();
      } else {
        console.error('Failed to update user profile.');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  }
}
