import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { formatDistanceStrict } from 'date-fns';
import { marked } from 'marked';
import { MessageService } from 'primeng/api';
import { SocketioService } from '../../services/socketio.service';
import { UtilitiesService } from '../../services/utilities.service';

export interface Prompt {
  label: string;
  icon: string;
  style?: string;
}

@Component({
  selector: 'dgx-chat',
  templateUrl: './dgx-chat.component.html',
  styleUrls: ['./dgx-chat.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DgxChatComponent implements OnInit, AfterContentChecked {
  @Input() showChat = false;
  @Input() showChatPage = false;
  @Input() default_prompts: Prompt[] = [];
  @Input() brandIconPath = '';
  @Input() height = '70vh';
  @Input() position: any = {
    right: '20px',
    bottom: '90px',
  };
  @Output() onUserAction: EventEmitter<any> = new EventEmitter<any>();

  placeholder = 'How can I help?';
  disableInput = false;
  userMessage = '';
  messages: any[] = [];
  restart = false;
  journey_type = '';
  scope = '';
  answerMessagesMap: any = {};
  activeCorrelationId = '';
  previousChatLength = 0;

  @ViewChild('scrollMe', { static: false }) scrollMe!: ElementRef;
  @ViewChild('editBox') public editBoxElement!: ElementRef;

  constructor(
    private chatService: SocketioService,
    private utils: UtilitiesService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngAfterContentChecked(): void {
    if (this.previousChatLength != this.messages.length) {
      this.previousChatLength = this.messages.length;
      this.scrollToBottom();
    }
  }

  setInputFocus() {
    setTimeout(() => {
      this.editBoxElement?.nativeElement.focus();
    }, 100);
  }

  private scrollToBottom(): void {
    if (this?.scrollMe?.nativeElement) {
      setTimeout(() => {
        if (this?.scrollMe?.nativeElement) {
          this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight + 200;
        }
      }, 10);
    }
  }

  ngOnInit() {
    this.listenForMessages();
  }

  listenForMessages() {
    this.previousChatLength = this.messages.length;
    let intermittant = 0;

    this.chatService.onMessage().subscribe((message: any) => {
      let answer = '';
      const msg = this.answerMessagesMap[this.activeCorrelationId];
      msg.inProgress = false;
      msg.processing = true;
      if (!message.Is_final) {
        if (intermittant > 0) {
          try {
            answer = JSON.parse(message.result)?.data;
          } catch (e) {
            answer = message.result;
          }
        } else {
          try {
            const data = JSON.parse(message.result);
            answer = JSON.parse(data?.data);
          } catch (e) {
            answer = message.result;
          }
          // msg.type = "inter-message"
        }
        msg.message = answer;
        msg.datetime = this.getISODateTime();
        intermittant++;
        this.cdr.markForCheck();
      } else {
        msg.processing = false;
        let data = message.result,
          cardData = [];
        try {
          data = JSON.parse(message.result);

          cardData = data?.data ? JSON.parse(data?.data) : data;
        } catch (e) {
          data = message.result;
        }
        if (data?.type === 'json') {
          data = data?.data;
        }
        msg.message = message?.response ?? data;
        msg.datetime = this.getISODateTime();
        msg.data = cardData;
        msg.type = 'bot-message';
        msg.suggestions = message.suggestions ?? [];
        this.scrollToBottom();
        intermittant = 0;
        this.toggleState(true);
        this.activeCorrelationId = '';
        this.cdr.markForCheck();
      }
    });
  }

  addResponse(prompt: string, inProgress = true, message = '', suggestions: any[] = []) {
    const correlationId = this.utils.getRandomUID();
    const msg: any = {
      isAI: true,
      id: correlationId,
      datetime: this.getISODateTime(),
      inProgress,
      suggestions,
      message: `<div class="typing">${message} </div>`,
      data: { prompt, correlationId },
      type: 'bot-message',
    };
    this.answerMessagesMap[correlationId] = msg;
    this.activeCorrelationId = correlationId;

    this.messages.push(msg);
    return correlationId;
  }

  addQuestion(question: any, audio?: any) {
    const msg: any = {
      isAI: false,
      id: this.utils.getRandomUID(),
      datetime: this.getISODateTime(),
      message: audio ? '' : question,
      blob: audio,
      mime_type: audio ? 'audio/webm' : 'text/plain',
      type: 'user-message',
    };
    this.messages.push(msg);
    return this.addResponse(msg);
  }

  sendMessage(audio?: any, prompt = '') {
    this.showChatPage = true;
    this.toggleState(false);
    let correlationId = '';
    if ((this.userMessage || prompt).trim() !== '' || audio) {
      const question = this.userMessage || prompt;
      correlationId = this.addQuestion(question ?? '', audio); // Update chat content
      this.chatService.sendMessage(question ?? '', correlationId, audio); // Emit a socket.io request
      this.userMessage = ''; // Clear the input field
      if (audio) {
        this.cdr.detectChanges();
      }
    }

    // setTimeout(() => {
    //   const msg = this.messages.pop();
    //   msg.processing = true;
    //   msg.message = 'This is really***very***important text.';
    //   // msg.message = `<span><i class="pi pi-spin pi-spinner" ></i>Folad</span>`;
    //   msg.data = [
    //     {
    //       referenceType: 'Book',
    //       referenceId: 6606320,
    //       title: 'Decoupled Django: Understand and Build Decoupled Django Architectures for JavaScript Front-ends',
    //       summary:
    //         "Apply decoupling patterns, properly test a decoupled project, and integrate a Django API with React, and Vue.js. This book covers decoupled architectures in Django, with Django REST framework and GraphQL. With practical and simple examples, you\\u2019ll see firsthand how, why, and when to decouple a Django project.\\u00a0Starting with an introduction to decoupled architectures versus monoliths, with a strong focus on the modern JavaScript scene, you\\u2019ll implement REST and GraphQL APIs with Django, add authentication to a decoupled project, and test the backend. You\\u2019ll then review functional testing for JavaScript frontends with Cypress. You will also learn how to integrate GraphQL in a Django project, with a focus on the benefits and drawbacks of this new query language.By the end of this book, you will be able to discern and apply all the different decoupling strategies to any Django project, regardless of its size.What You'll Learn Choose the right approach for decoupling a Django projectBuild REST APIs with Django and a Django REST frameworkIntegrate Vue.js and GraphQL in a Django projectConsume a Django REST API with Next.jsTest decoupled Django projectsWho This Book Is ForSoftware developers with basic Django skills keen to learn decoupled architectures with Django. JavaScript developers interested in learning full-stack development and decoupled architectures with Django.",
    //       url: 'https://learning.oreilly.com/library/view/decoupled-django-understand/ds/',
    //       imageUrl: 'https://learning.oreilly.com/library/view/pro-django/9781430210474/',
    //       isEndorsed: false,
    //       dateCreated: '2021',
    //       durationMinutes: '221 Pages',
    //       re_run: false,
    //     },
    //     {
    //       referenceType: 'Article',
    //       referenceId: 367153,
    //       title: 'Pro Django',
    //       summary:
    //         "Django is the leading Python web application development framework. Learn how to leverage the Django web framework to its full potential in this advanced tutorial and reference. Endorsed by Django, Pro Django more or less picks up where The Definitive Guide to Django left off and examines in greater detail the unusual and complex problems that Python web application developers can face and how to solve them.Provides in\\u2013depth information about advanced tools and techniques available in every Django installationRuns the gamut from the theory of Django's internal operations to actual code that solves real\\u2013world problems for high\\u2013volume environmentsGoes above and beyond other books, leaving the basics behindShows how Django can do things even its core developers never dreamed possibleWhat you'll learnSee how to use Django's models, views, forms, and templatesHandle HTTP and customizing back endsUse Django's common toolingEmploy Django in various environmentsBuild a business software suite for use in the corporate worldMake this code reusable\\u2014even distributableWho this book is forThis book is for companies looking for a framework capable of supporting enterprise needs, as well as advanced Python or web developers looking to solve unusual, complex problems.",
    //       url: 'https://learning.oreilly.com/library/view/pro-django/9781430210474/',
    //       imageUrl: 'https://learning.oreilly.com/library/view/pro-django/9781430210474/',
    //       isEndorsed: false,
    //       dateCreated: '2015',
    //       durationMinutes: '542 Pages',
    //       re_run: false,
    //     },
    //     {
    //       referenceType: 'Video',
    //       is_for_curation: true,
    //       referenceId: 1607059,
    //       title: 'Intermediate Django',
    //       summary:
    //         'In this Intermediate Django training course, expert author Mark Lavin will teach you how to build a modern, scalable, and maintainable web application with Django. This course is designed for users that are already familiar with Django and web development.You will start by learning about customization, then jump into learning about management commands, including how to write a management command, add command options, and test management commands. From there, Mark will teach you about views and templates, AJAX with Django, migrations, and user input and management. This video tutorial also covers asynchronous tasks with Celery, including how to create a task, run periodic tasks, and monitor Celery. Finally, you will learn about settings and configuration and code quality. Once you have completed this computer based training course, you will have learned how to build modern, scalable, and maintainable web applications with Django. Working files are included, allowing you to follow along with the author throughout the lessons.',
    //       url: '',
    //       imageUrl: 'https://learning.oreilly.com/library/view/pro-django/9781430210474/',
    //       isEndorsed: false,
    //       dateCreated: '2019',
    //       durationMinutes: '4 Hours',
    //       re_run: false,
    //     },
    //     {
    //       referenceType: 'Pathway',
    //       referenceId: 1607059,
    //       title: 'Intermediate Django',
    //       summary:
    //         'In this Intermediate Django training course, expert author Mark Lavin will teach you how to build a modern, scalable, and maintainable web application with Django. This course is designed for users that are already familiar with Django and web development.You will start by learning about customization, then jump into learning about management commands, including how to write a management command, add command options, and test management commands. From there, Mark will teach you about views and templates, AJAX with Django, migrations, and user input and management. This video tutorial also covers asynchronous tasks with Celery, including how to create a task, run periodic tasks, and monitor Celery. Finally, you will learn about settings and configuration and code quality. Once you have completed this computer based training course, you will have learned how to build modern, scalable, and maintainable web applications with Django. Working files are included, allowing you to follow along with the author throughout the lessons.',
    //       url: 'https://learning.oreilly.com/videos/intermediate-django/9781771374101/',
    //       imageUrl: 'https://learning.oreilly.com/videos/intermediate-django/9781771374101/',
    //       isEndorsed: false,
    //       dateCreated: '2019',
    //       durationMinutes: '4 Hours',
    //       re_run: false,
    //     },
    //     {
    //       referenceType: 'Course',
    //       referenceId: 1607059,
    //       title: 'Intermediate Django',
    //       summary:
    //         'In this Intermediate Django training course, expert author Mark Lavin will teach you how to build a modern, scalable, and maintainable web application with Django. This course is designed for users that are already familiar with Django and web development.You will start by learning about customization, then jump into learning about management commands, including how to write a management command, add command options, and test management commands. From there, Mark will teach you about views and templates, AJAX with Django, migrations, and user input and management. This video tutorial also covers asynchronous tasks with Celery, including how to create a task, run periodic tasks, and monitor Celery. Finally, you will learn about settings and configuration and code quality. Once you have completed this computer based training course, you will have learned how to build modern, scalable, and maintainable web applications with Django. Working files are included, allowing you to follow along with the author throughout the lessons.',
    //       url: 'https://learning.oreilly.com/videos/intermediate-django/9781771374101/',
    //       imageUrl: 'https://learning.oreilly.com/library/view/pro-django/9781430210474/',
    //       isEndorsed: false,
    //       dateCreated: '2019',
    //       durationMinutes: '4 Hours',
    //       re_run: false,
    //     },
    //     {
    //       referenceType: 'General',
    //       referenceId: 1607059,
    //       title: 'Intermediate Django',
    //       summary:
    //         'In this Intermediate Django training course, expert author Mark Lavin will teach you how to build a modern, scalable, and maintainable web application with Django. This course is designed for users that are already familiar with Django and web development.You will start by learning about customization, then jump into learning about management commands, including how to write a management command, add command options, and test management commands. From there, Mark will teach you about views and templates, AJAX with Django, migrations, and user input and management. This video tutorial also covers asynchronous tasks with Celery, including how to create a task, run periodic tasks, and monitor Celery. Finally, you will learn about settings and configuration and code quality. Once you have completed this computer based training course, you will have learned how to build modern, scalable, and maintainable web applications with Django. Working files are included, allowing you to follow along with the author throughout the lessons.',
    //       url: 'https://learning.oreilly.com/videos/intermediate-django/9781771374101/',
    //       imageUrl: 'https://learning.oreilly.com/library/view/pro-django/9781430210474/',
    //       isEndorsed: false,
    //       dateCreated: '2019',
    //       durationMinutes: '4 Hours',
    //       re_run: false,
    //     },
    //     {
    //       referenceType: 'Podcast',
    //       referenceId: 1607059,
    //       title: 'Intermediate Django',
    //       summary:
    //         'In this Intermediate Django training course, expert author Mark Lavin will teach you how to build a modern, scalable, and maintainable web application with Django. This course is designed for users that are already familiar with Django and web development.You will start by learning about customization, then jump into learning about management commands, including how to write a management command, add command options, and test management commands. From there, Mark will teach you about views and templates, AJAX with Django, migrations, and user input and management. This video tutorial also covers asynchronous tasks with Celery, including how to create a task, run periodic tasks, and monitor Celery. Finally, you will learn about settings and configuration and code quality. Once you have completed this computer based training course, you will have learned how to build modern, scalable, and maintainable web applications with Django. Working files are included, allowing you to follow along with the author throughout the lessons.',
    //       url: 'https://learning.oreilly.com/videos/intermediate-django/9781771374101/',
    //       imageUrl: 'https://learning.oreilly.com/library/view/pro-django/9781430210474/',
    //       isEndorsed: false,
    //       dateCreated: '2019',
    //       durationMinutes: '4 Hours',
    //       re_run: false,
    //     },
    //     {
    //       referenceType: 'Plan',
    //       referenceId: 1607059,
    //       title: 'Intermediate Django',
    //       summary:
    //         'In this Intermediate Django training course, expert author Mark Lavin will teach you how to build a modern, scalable, and maintainable web application with Django. This course is designed for users that are already familiar with Django and web development.You will start by learning about customization, then jump into learning about management commands, including how to write a management command, add command options, and test management commands. From there, Mark will teach you about views and templates, AJAX with Django, migrations, and user input and management. This video tutorial also covers asynchronous tasks with Celery, including how to create a task, run periodic tasks, and monitor Celery. Finally, you will learn about settings and configuration and code quality. Once you have completed this computer based training course, you will have learned how to build modern, scalable, and maintainable web applications with Django. Working files are included, allowing you to follow along with the author throughout the lessons.',
    //       url: 'https://learning.oreilly.com/videos/intermediate-django/9781771374101/',
    //       imageUrl: 'https://learning.oreilly.com/library/view/pro-django/9781430210474/',
    //       isEndorsed: false,
    //       dateCreated: '2019',
    //       durationMinutes: '4 Hours',
    //       re_run: false,
    //     },
    //     {
    //       referenceType: 'Opportunities',
    //       referenceId: 1607059,
    //       title: 'Intermediate Django',
    //       summary:
    //         'In this Intermediate Django training course, expert author Mark Lavin will teach you how to build a modern, scalable, and maintainable web application with Django. This course is designed for users that are already familiar with Django and web development.You will start by learning about customization, then jump into learning about management commands, including how to write a management command, add command options, and test management commands. From there, Mark will teach you about views and templates, AJAX with Django, migrations, and user input and management. This video tutorial also covers asynchronous tasks with Celery, including how to create a task, run periodic tasks, and monitor Celery. Finally, you will learn about settings and configuration and code quality. Once you have completed this computer based training course, you will have learned how to build modern, scalable, and maintainable web applications with Django. Working files are included, allowing you to follow along with the author throughout the lessons.',
    //       url: 'https://learning.oreilly.com/videos/intermediate-django/9781771374101/',
    //       imageUrl: 'https://learning.oreilly.com/library/view/pro-django/9781430210474/',
    //       isEndorsed: false,
    //       dateCreated: '2019',
    //       durationMinutes: '4 Hours',
    //       re_run: false,
    //     },
    //   ];
    //   msg.inProgress = false;
    //   msg.suggestions = [
    //     'test1',
    //     'test33 dsd',
    //     'Highly Effective People',
    //     'Habits of Highly Effective People',
    //     'Habits',
    //   ];
    //   msg.datetime = this.getISODateTime();
    //   msg.rating = [1, 3, 4, 5];
    //   this.messages.push(msg);
    //   if (audio) {
    //     this.cdr.detectChanges();
    //   }
    //   this.scrollToBottom();
    //   this.toggleState(true);
    //   this.cdr.markForCheck();
    // }, 1000);
  }

  getType(item: any) {
    let type = 'book';
    if (
      item['is_for_curation'] ||
      (item['referenceType'] && (item.referenceType + '').toLocaleLowerCase() === 'pathway') ||
      (item['referenceType'] && (item.referenceType + '').toLocaleLowerCase() === 'target')
    )
      type = 'pathway';
    else if (item['referenceType'] && (item.referenceType + '').toLocaleLowerCase() === 'video') type = 'video';
    return type;
  }

  isAudio(message: any) {
    return message?.mime_type === 'audio/webm';
  }

  toggleChat() {
    this.showChatPage = !this.showChatPage;
  }

  getISODateTime() {
    return new Date().toISOString();
  }

  getTimeDiff(datetime: string) {
    return formatDistanceStrict(new Date(datetime), new Date(), {
      addSuffix: true,
    });
  }

  onPromptSelection(prompt: any) {
    this.showChatPage = true;
    this.placeholder = 'Type a reply';
    this.restart = false;
    const { label } = prompt;
    this.journey_type = label;
    const correlationId = this.addResponse(label);
    this.chatService.setScope(label);
    this.chatService.sendMessage('', correlationId);
    this.toggleState(false);
  }

  onSuggestionSelection(selection: any) {
    this.sendMessage(undefined, selection);
  }

  onVideoAction(event: any) {
    const { type, message, video } = event;
    if (type === 'remove') {
      message.data = message.data.filter((item: any) => item.referenceId !== video.referenceId);
      //this.messageService.add({ severity: 'info', summary: 'Success' });
    } else {
      // let isAdded = true;
      message.data.forEach((item: any) => {
        if (item.referenceId === video.referenceId) {
          item.isAdded = !item.isAdded;
          // isAdded = item.isAdded;
        }
      });
      message.data = [...message.data];
      this.emitEvent({ type, video, message });
      //this.messageService.add({ severity: `${isAdded ? "success" : "info"}`, summary: 'Success' });
    }
  }

  showToggleBtn(data: any) {
    return data?.length > 3;
  }

  toggleShowAll(msg: any) {
    msg.showAll = !msg.showAll;
    this.cdr.markForCheck();
  }

  getItems(msg: any) {
    if (msg?.data && Array.isArray(msg?.data)) {
      if (msg?.showAll) {
        return msg?.data ?? [];
      }
      return msg?.data?.slice(0, 3);
    }

    return [];
  }

  toggleState(completed = false) {
    this.disableInput = !completed;
    this.placeholder = this.disableInput ? 'Please wait...' : this.restart ? 'How can I help?' : 'Type a reply';
    if (completed) {
      this.setInputFocus();
    }
  }

  forgetAndRestart(event: Event) {
    event.preventDefault();
    if (this.showChatPage) {
      this.chatService.resetConnection();
      this.reset();
      this.listenForMessages();
    }
  }

  reset() {
    this.messages = [];
    this.showChatPage = false;
    this.userMessage = '';
    this.restart = true;
    this.toggleState(true);
    this.cdr.markForCheck();
  }

  convertToHtml(markdown: string): string | Promise<string> {
    return marked.parse(markdown || '');
  }

  emitEvent(event: any) {
    this.onUserAction.emit(event);
  }
}
