import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post, Comment } from '../post/post.module';
import { ImageOverlayComponent } from '../image-overlay/image-overlay.component';
import { CommentComponent } from '../comment/comment.component';
import { ThreadComponent } from '../thread/thread.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'post-display',
  standalone: true,
  imports: [CommonModule, ImageOverlayComponent, CommentComponent, ThreadComponent, FormsModule],
  templateUrl: './post-display.component.html',
  styleUrls: ['./post-display.component.css']
})
export class PostDisplayComponent implements OnInit {
  @Input() posts: Post[] = [];
  @Input() currentUserRole: string = '';
  @Input() currentUsername: string = '';

  isOverlayVisible: boolean = false;
  currentImage: string = '';
  currentIndex: number = 0;
  mediaItems: { url: string; type: string }[] = [];
  replyFormVisible: { [commentId: string]: boolean } = {}; // Track visibility of reply forms
  newCommentContent: string = ''; // For new comment input
  newCommentImages: File[] = []; // New image uploads for comments
  newCommentVideos: File[] = []; // New video uploads for comments
  newCommentFiles: File[] = []; // New document uploads for comments
  showComments: { [postId: string]: boolean } = {}; // Track visibility of comments

  ngOnInit() {
    // Initialize any required logic here
  }

  get filteredPosts() {
    if (this.currentUserRole === 'boss') {
      return this.posts; // Boss sees all posts
    }
    return this.posts.filter(post => post.role.includes(this.currentUserRole));
  }

  openOverlay(imageUrl: string, index: number, mediaItems: { url: string; type: string }[]) {
    this.currentImage = imageUrl;
    this.currentIndex = index;
    this.mediaItems = mediaItems;
    this.isOverlayVisible = true;
  }

  closeOverlay() {
    this.isOverlayVisible = false;
    this.currentImage = '';
    this.mediaItems = [];
  }

  likePost(post: Post) {
    const userIndex = post.likedBy.indexOf(this.currentUsername);

    if (userIndex !== -1) {
      post.likesCount -= 1;
      post.likedBy.splice(userIndex, 1); // Remove the username from likedBy
    } else {
      post.likesCount += 1;
      post.likedBy.push(this.currentUsername);
    }

    // Update local storage with the new post information
    this.updatePostInLocalStorage(post);
  }

  toggleComments(postId: string) {
    this.showComments[postId] = !this.showComments[postId];
  }

  addReply(post: Post, comment: Comment, replyContent: string) {
    const reply: Comment = {
      id: this.generateUniqueId(),
      postId: post.id, // Associate the reply with the correct post
      username: this.currentUsername,
      date: new Date(),
      content: replyContent,
      images: [],
      videos: [],
      documents: [],
      likesCount: 0,
      likedBy: [],
      isHidden: false,
      replies: []
    };

    comment.replies.push(reply);

    // Update local storage
    this.updatePostInLocalStorage(post);

    // Hide the reply form after submitting
    this.replyFormVisible[comment.id] = false;
  }

  addComment(post: Post, commentContent: string) {
    if (!commentContent.trim() && !this.newCommentImages.length && !this.newCommentVideos.length && !this.newCommentFiles.length) return; // Ignore empty comments

    const comment: Comment = {
      id: this.generateUniqueId(),
      postId: post.id, // Associate the comment with the correct post
      username: this.currentUsername,
      date: new Date(),
      content: commentContent,
      images: this.prepareMediaFiles(this.newCommentImages, 'image'),
      videos: this.prepareMediaFiles(this.newCommentVideos, 'video'),
      documents: this.prepareMediaFiles(this.newCommentFiles, 'document'),
      likesCount: 0,
      likedBy: [],
      isHidden: false,
      replies: []
    };

    post.comments.push(comment);
    post.commentsCount += 1; // Increment the comment count

    // Update local storage
    this.updatePostInLocalStorage(post);

    // Clear the new comment input fields
    this.newCommentContent = '';
    this.newCommentImages = [];
    this.newCommentVideos = [];
    this.newCommentFiles = [];
  }

  prepareMediaFiles(files: File[], type: string) {
    return files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name
    }));
  }

  handleFileChange(event: any, type: string) {
    const files = event.target.files;
    if (type === 'image') {
      this.newCommentImages = Array.from(files);
    } else if (type === 'video') {
      this.newCommentVideos = Array.from(files);
    } else if (type === 'document') {
      this.newCommentFiles = Array.from(files);
    }
  }

  private generateUniqueId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  private updatePostInLocalStorage(updatedPost: Post) {
    const allPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    const postIndex = allPosts.findIndex((p: Post) => p.id === updatedPost.id);
    if (postIndex !== -1) {
      allPosts[postIndex] = updatedPost;
      localStorage.setItem('posts', JSON.stringify(allPosts));
    }
  }

  getPostClass(post: Post): string {
    return post.role.includes('boss') ? 'card golden-card' : 'card';
  }
}