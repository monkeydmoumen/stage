import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPostComponent } from '../add-post/add-post.component';
import { PostDisplayComponent } from '../post-display/post-display.component';
import { Router } from '@angular/router';
import { Post } from '../post/post.module';

@Component({
  selector: 'main-content',
  standalone: true,
  imports: [CommonModule, AddPostComponent, PostDisplayComponent],
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit {
  posts: Post[] = [];
  username: string = '';
  isAuthenticated: boolean = false;
  currentUserRole: string = '';
  email: string = '';
  cinNumber: string = '';
  profilePhoto: string = '';
  description: string = '';

  constructor(private router: Router) {}

  navigateToChatUI() {
    this.router.navigate(['/chat-ui']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile', this.cinNumber]);
  }

  ngOnInit() {
    this.username = localStorage.getItem('username') || 'User';
    this.isAuthenticated = !!localStorage.getItem('authToken');
    this.currentUserRole = localStorage.getItem('currentUserRole') || 'user';
    this.email = localStorage.getItem('email') || '';
    this.cinNumber = localStorage.getItem('currentUsercin') || '';
    this.profilePhoto = localStorage.getItem('currentUserphoto') || '';
    this.description = localStorage.getItem('description') || '';
  
    // Load posts based on role
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      const allPosts = JSON.parse(savedPosts);
      if (this.currentUserRole === 'boss') {
        this.posts = allPosts; // Boss sees all posts
      } else {
        this.posts = allPosts.filter((post: Post) => post.role.includes(this.currentUserRole));
      }
    }
  
    console.log('Loaded posts:', this.posts);
  }
  

  onPostAdded(post: Post) {
    console.log('Adding post:', post);
  
    const newPost: Post = {
      ...post,
      username: this.username,
      role: [this.currentUserRole], // Assign as an array of strings
      id: this.generateUniqueId(),
      date: new Date(),
      likesCount: 0,
      commentsCount: 0,
      likedBy: [],
      images: post.images || [],
      documents: post.documents || [],
      comments: []
    };
  
    this.posts = [newPost, ...this.posts];
  
    const allPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    allPosts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(allPosts));
  
    console.log('Current posts after addition:', this.posts);
  }
  

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('currentUserRole');
    
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
  }

  private generateUniqueId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}
