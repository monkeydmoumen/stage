import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Import ReactiveFormsModule
import { Post } from '../post/post.module'; // Update path if necessary
import { CommonModule } from '@angular/common';

@Component({
  selector: 'add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule] // Add ReactiveFormsModule here
})
export class AddPostComponent {
  postForm: FormGroup;
  selectedFiles: { url: string, type: string, name?: string }[] = [];
  currentDate: Date = new Date();

  @Input() currentUsername: string = '';
  @Input() currentUserRole: string = '';
  @Input() isBoss: boolean = false;
  @Output() postAdded = new EventEmitter<Post>();

  imageVideoTypes = ['image/png', 'image/jpeg', 'image/gif', 'video/mp4'];
  documentTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  selectedRoles: string[] = [];

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.group({
      postContent: ['', Validators.required],
      selectedRoles: []
    });
  }

  onImageVideoFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.selectedFiles = [];

      files.forEach(file => {
        if (this.imageVideoTypes.includes(file.type)) {
          const reader = new FileReader();
          reader.onload = () => {
            this.selectedFiles.push({ url: reader.result as string, type: file.type });
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  onDocumentFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.selectedFiles = [];

      files.forEach(file => {
        if (this.documentTypes.includes(file.type)) {
          const reader = new FileReader();
          reader.onload = () => {
            this.selectedFiles.push({ url: reader.result as string, type: file.type, name: file.name });
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  submitPost() {
    if (this.isBoss) {
      const selectedRoleElements = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked');
      this.selectedRoles = Array.from(selectedRoleElements).map(input => input.value);
    } else {
      this.selectedRoles = [this.currentUserRole];
    }

    const postContent = this.postForm.get('postContent')?.value;

    if (postContent.trim() || this.selectedFiles.length > 0) {
      const newPost: Post = {
        id: this.generateId(),
        username: this.currentUsername,
        role: this.selectedRoles,
        date: this.currentDate,
        content: postContent,
        images: this.selectedFiles.filter(file => file.type.startsWith('image')),
        videos: this.selectedFiles.filter(file => file.type.startsWith('video')),
        documents: this.selectedFiles
          .filter(file => this.documentTypes.includes(file.type))
          .map(file => ({ url: file.url, type: file.type, name: file.name || '' })),
        likesCount: 0,
        commentsCount: 0,
        likedBy: [],
        comments: []
      };

      console.log('Post Object:', newPost);

      this.postAdded.emit(newPost);
      this.postForm.reset();
      this.selectedFiles = [];
      this.selectedRoles = [];
    }
  }

  private generateId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }


onRoleSelectionChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const role = input.value;

  if (input.checked) {
    if (!this.selectedRoles.includes(role)) {
      this.selectedRoles.push(role);
    }
  } else {
    this.selectedRoles = this.selectedRoles.filter(r => r !== role);
  }
}
}
