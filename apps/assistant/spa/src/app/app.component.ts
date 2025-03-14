import { Component } from '@angular/core';

@Component({
  selector: 'dgx-assistant-root',
  template: `
    <dgx-chatbot
      [serverConfig]="serverCofig"
      [aiButtonPos]="{ right: '2%', bottom: '2%' }"
      (onUserAction)="onUserAction($event)"
    ></dgx-chatbot>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Digital Assistant';
  serverCofig = {
    url: 'http://localhost:8000',
    authToken: 'username:adminsdet;password:SDET1234!',
    config: {
      path: '/ws/socket.io/',
      reconnectionAttempts: -1,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUserAction(event: any) {
    console.log(event);
  }
}
