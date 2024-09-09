import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'friend-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friend-item.component.html',
  styleUrls: ['./friend-item.component.css']
})
export class FriendItemComponent {
  @Input() profilePic!: string;
  @Input() username!: string;

  @Output() select = new EventEmitter<string>();

  onSelect() {
    this.select.emit(this.username);
  }
}
