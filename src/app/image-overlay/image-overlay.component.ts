import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule],
  standalone: true,
  selector: 'app-image-overlay',
  templateUrl: './image-overlay.component.html',
  styleUrls: ['./image-overlay.component.css']
})
export class ImageOverlayComponent {
  @Input() isVisible: boolean = false;
  @Input() currentImage: string = '';
  @Input() mediaItems: { url: string; type: string }[] = []; // Array of media items (images/videos)
  @Input() currentIndex: number = 0;
  @Output() close = new EventEmitter<void>();

  closeOverlay() {
    this.close.emit();
  }

  nextMedia() {
    if (this.currentIndex < this.mediaItems.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Loop back to the first item
    }
    this.currentImage = this.mediaItems[this.currentIndex].url;
  }

  previousMedia() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.mediaItems.length - 1; // Loop back to the last item
    }
    this.currentImage = this.mediaItems[this.currentIndex].url;
  }
}
