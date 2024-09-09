import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FriendItemComponent } from '../friend-item/friend-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, FriendItemComponent],
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  friends: any[] = [];
  isAuthenticated = false;

  @Output() friendSelected = new EventEmitter<string>(); // Emit event when a friend is selected

  constructor(private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('authToken');
    this.isAuthenticated = !!token;

    if (this.isAuthenticated) {
      const currentUserRole = localStorage.getItem('currentUserRole') || 'user';
      this.fetchFriends(currentUserRole);
    }
  }

  onFriendSelect(username: string) {
    this.friendSelected.emit(username); // Emit selected friend's username
  }

  fetchFriends(role: string) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUsername = localStorage.getItem('username') || '';

    if (role === 'boss') {
      // If the current user is the boss, show all users as friends
      this.friends = users.filter((user: any) => user.username !== currentUsername);
    } else {
      // For other roles, show users with the same role and the boss
      this.friends = users.filter((user: any) => 
        user.role === role || user.role === 'boss' // Include users with the same role and the boss
      ).filter((user: any) => user.username !== currentUsername);
    }
  }
}
