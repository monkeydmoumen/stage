import { Component } from '@angular/core';
import { FriendsComponent } from '../friends/friends.component';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-chat-ui',
  standalone: true,
  imports: [FriendsComponent, ChatComponent],
  templateUrl: './chat-ui.component.html',
  styleUrls: ['./chat-ui.component.css']
})
export class ChatUiComponent {
  selectedFriend: string = ''; // To store the selected friend's username

  onFriendSelected(friendUsername: string) {
    this.selectedFriend = friendUsername;
  }
}
