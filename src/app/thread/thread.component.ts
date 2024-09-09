import { Component, Input, OnInit } from '@angular/core';
import { Comment, Post } from '../post/post.module';
import { CommentComponent } from '../comment/comment.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommentComponent, FormsModule, CommonModule],
  standalone: true,
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit {
  @Input() comments: Comment[] = [];
  @Input() maxLength: number = 50;
  @Input() allowReplies: boolean = true;
  @Input() postId: string = '';
  @Input() currentUsername: string = ''; 
  newReplyContent: { [commentId: string]: string } = {}; // Track new reply content for each comment

  ngOnInit() {
    this.loadCommentsFromLocalStorage();
  }

  get filteredComments() {
    return this.comments.filter(comment => comment.postId === this.postId);
  }

  addReply(comment: Comment, replyContent: string) {
    if (!replyContent.trim()) return;
  
    const reply: Comment = {
      id: this.generateUniqueId(),
      postId: this.postId,
      username: this.currentUsername,
      date: new Date(),
      content: replyContent,
      likesCount: 0,
      likedBy: [],
      isHidden: false,
      images: [],
      videos: [],
      documents: [],
      replies: []
    };
  
    comment.replies.push(reply);
    this.newReplyContent[comment.id] = ''; // Clear the reply input field
    this.saveCommentsToLocalStorage(); // Save after adding a reply
  }

  private generateUniqueId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  private saveCommentsToLocalStorage(): void {
    const posts = this.loadPostsFromLocalStorage();
    const post = posts.find(p => p.id === this.postId);

    if (post) {
      post.comments = this.comments;
      this.savePostsToLocalStorage(posts);
    }
  }

  private loadCommentsFromLocalStorage(): void {
    const posts = this.loadPostsFromLocalStorage();
    const post = posts.find(p => p.id === this.postId);
    
    if (post) {
      this.comments = post.comments;
    }
  }

  private savePostsToLocalStorage(posts: Post[]): void {
    localStorage.setItem('posts', JSON.stringify(posts));
  }

  private loadPostsFromLocalStorage(): Post[] {
    const posts = localStorage.getItem('posts');
    return posts ? JSON.parse(posts) : [];
  }
}
