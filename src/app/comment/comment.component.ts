import { Component, Input } from '@angular/core';
import { Comment } from '../post/post.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  @Input() comment!: Comment;
  @Input() maxLength!: number;
  @Input() allowReplies: boolean = true;
  @Input() maxLevel: number = 20; // Cap the nesting level
  @Input() level: number = 0; // Input for nesting level
  @Input() currentUsername: string = '';
  isHidden: boolean = false;
  showReplyInput: boolean = false;
  newReplyContent: string = '';

  getRelativeTime(postedAt: Date): string {
    const ms = Date.now() - new Date(postedAt).getTime();
    const lookup = ['month', 'week', 'day', 'hour', 'minute', 'second'];
    const values = [
      Math.floor(ms / (30 * 24 * 60 * 60 * 1000)),
      Math.floor((ms % (30 * 24 * 60 * 60 * 1000)) / (7 * 24 * 60 * 60 * 1000)),
      Math.floor((ms % (7 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)),
      Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)),
      Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000)),
      Math.floor((ms % (60 * 1000)) / 1000),
    ];

    for (let i = 0; i < values.length; i++) {
      if (values[i] > 0) {
        return `${values[i]} ${lookup[i]}${values[i] > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  }

  toggleCollapse() {
    this.isHidden = !this.isHidden;
  }

  toggleReplyInput() {
    if (this.level >= this.maxLevel) return; // Prevent replies beyond maxLevel
    this.showReplyInput = !this.showReplyInput;
  }

  submitReply() {
    if (!this.newReplyContent.trim()) return;

    const reply: Comment = {
      id: this.generateUniqueId(),
      postId: this.comment.postId,
      username: this.currentUsername, // Replace with actual username
      date: new Date(),
      content: this.newReplyContent,
      likesCount: 0,
      likedBy: [],
      isHidden: false,
      replies: [],
      images: [], // Default empty array for images
      videos: [], // Default empty array for videos
      documents: [] // Default empty array for documents
    };

    this.comment.replies.push(reply);
    this.newReplyContent = '';
    this.showReplyInput = false; // Hide the reply input after submission
  }

  trimmedBody(text: string): string {
    return text.substr(0, this.maxLength);
  }

  bodySuffix(len: number): string {
    return len > this.maxLength ? '...' : '';
  }

  private generateUniqueId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}
