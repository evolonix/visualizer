import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServerConfig } from '../../model/server';
import { SocketioService } from '../../services/socketio.service';
import { Prompt } from '../dgx-chat/dgx-chat.component';

@Component({
  selector: 'dgx-chatbot',
  templateUrl: `./dgx-chatbot.component.html`,
  styleUrls: ['./dgx-chatbot.component.scss'],
})
export class DgxChatbotComponent implements OnInit {
  constructor(private socketIO: SocketioService) {}

  @Input() serverConfig!: ServerConfig;
  @Input() default_prompts: Prompt[] = [
    {
      label: 'Find skill-related content',
      icon: 'search',
    },
    { label: 'Curate pathway', icon: 'sparkles', style: 'solid' },
    {
      label: 'Update your skills',
      icon: 'tag',
      style: 'solid',
    },
    {
      label: 'Recommend content to my team',
      icon: 'arrow_up_tray',
      style: 'solid',
    },
  ];
  @Input() authToken = '';
  @Input() userName = '';
  @Input() aiButtonPos: any = { right: '2%', bottom: '2%' };
  @Input() height = '70vh';
  @Output() onUserAction: EventEmitter<any> = new EventEmitter<any>();

  showChat = false;

  ngOnInit(): void {
    this.socketIO.init(this.serverConfig);
    console.log(this.aiButtonPos);
  }

  toggleChat() {
    this.showChat = !this.showChat;
  }
}
