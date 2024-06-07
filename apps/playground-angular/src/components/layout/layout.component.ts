import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header.component';
import { SidebarComponent } from './components/sidebar.component';
import { defaultConfiguration } from './default.config';
import {
  LayoutConfiguration,
  LayoutConfigurationToken,
  LayoutTheme,
} from './layout.model';

@Component({
  selector: 'app-layout',
  template: `
    <div
      [style]="{
        '--layout-background': theme?.colors?.background,
        '--layout-text':
          theme?.text === 'light' ? 'white' : 'var(--tw-color-neutral-800)',
        '--layout-highlight': theme?.colors?.highlight
      }"
    >
      <!-- Skip To Main Content Link -->
      <a href="#main-content" class="sr-only">Skip to main content</a>

      <!-- Header -->
      <app-header
        [logos]="configuration?.logos"
        [features]="configuration?.features"
        [navigation]="configuration?.navigation"
        [className]="
          [
            'transition-[margin]',
            sidebarExpanded ? 'lg:ml-52' : 'lg:ml-20'
          ].join(' ')
        "
        (search)="handleSearch($event)"
        (themeChange)="setTheme($event)"
      ></app-header>

      <!-- Sidebar -->
      <app-sidebar
        [logos]="configuration?.logos"
        [features]="configuration?.features"
        [navigation]="configuration?.navigation"
        [sidebarExpanded]="sidebarExpanded"
        [className]="
          ['transition-[width]', sidebarExpanded ? 'lg:w-52' : 'lg:w-20'].join(
            ' '
          )
        "
        (toggleExpanded)="toggleSidebar()"
        (add)="handleAdd($event)"
      ></app-sidebar>

      <!-- Main Content -->
      <main
        id="main-content"
        class="flex min-h-dvh flex-col px-4 pb-4 pt-20 transition-[margin] lg:px-8"
        [class]="sidebarExpanded ? 'lg:ml-52' : 'lg:ml-20'"
      >
        <section class="grow">
          <ng-content></ng-content>
        </section>

        <!-- Footer -->
        <footer class="grid h-20 place-content-center">Footer</footer>
      </main>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    RouterOutlet,
  ],
})
export class LayoutComponent implements OnInit {
  @Input() configuration?: LayoutConfiguration;
  @Output() search = new EventEmitter<MouseEvent>();
  @Output() add = new EventEmitter<MouseEvent>();

  theme?: LayoutTheme;
  sidebarExpanded = false;

  constructor(
    @Inject(LayoutConfigurationToken)
    private providedConfiguration: LayoutConfiguration,
  ) {}

  ngOnInit(): void {
    this.configuration = {
      ...defaultConfiguration,
      ...this.providedConfiguration,
      ...this.configuration,
    };
    this.theme = this.configuration?.theme;
  }

  handleSearch(event: MouseEvent): void {
    this.search.emit(event);
  }

  handleAdd(event: MouseEvent): void {
    this.add.emit(event);
  }

  setTheme(theme: LayoutTheme): void {
    this.theme = theme;
  }

  toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
  }
}
