import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { twMerge } from '../../utils/tw-merge';
import { LayoutConfiguration } from './layout.model';

const defaultConfiguration = {
  features: {
    search: { enabled: false },
    addContent: { enabled: false },
  },
} satisfies LayoutConfiguration;

@Component({
  selector: 'da-layout',
  template: `
    <div
      [style]="{
        '--apollo-layout-background': configuration?.brand?.colors?.background,
        '--apollo-layout-text': configuration?.brand?.colors?.text,
        '--apollo-layout-highlight': configuration?.brand?.colors?.highlight,
      }"
      [class]="className"
    >
      <!-- Skip To Main Content Link -->
      <a href="#main-content" class="tw-sr-only">Skip to main content</a>

      <!-- Header -->
      <da-header
        [brand]="configuration?.brand"
        [features]="configuration?.features"
        [navigation]="configuration?.navigation"
        [switcherNavigation]="configuration?.switcherNavigation"
        [className]="twMerge('tw-transition-[margin] tw-reset tw-z-20', sidebarExpanded ? 'lg:tw-ml-[200px]' : 'lg:tw-ml-20')"
        (search)="handleSearch($event)"
        (addContent)="handleAddContent($event)"
      ></da-header>

      <!-- Sidebar -->
      <da-sidebar
        [brand]="configuration?.brand"
        [features]="configuration?.features"
        [navigation]="configuration?.navigation"
        [sidebarExpanded]="sidebarExpanded"
        [className]="
          twMerge('tw-transition-[width] tw-hidden lg:tw-block tw-reset tw-z-20', sidebarExpanded ? 'lg:tw-w-[200px]' : 'lg:tw-w-20')
        "
        (toggleExpanded)="sidebarExpanded = !sidebarExpanded"
        (addContent)="handleAddContent($event)"
      ></da-sidebar>

      <!-- Main Content -->
      <main
        id="main-content"
        [class]="
          twMerge(
            'tw-box-border tw-flex tw-min-h-dvh tw-flex-col tw-pt-16 tw-transition-[margin]',
            sidebarExpanded ? 'lg:tw-ml-[200px]' : 'lg:tw-ml-20'
          )
        "
      >
        <div class="tw-grow">
          <ng-content></ng-content>
        </div>

        <!-- Footer -->
        <da-footer className="tw-reset" />
      </main>
    </div>
  `,
})
export class LayoutComponent implements OnInit {
  @Input() className = '';
  @Input() configuration?: LayoutConfiguration;
  @Output() search = new EventEmitter<MouseEvent>();
  @Output() addContent = new EventEmitter<MouseEvent>();

  sidebarExpanded = false;
  twMerge = twMerge;

  ngOnInit(): void {
    this.configuration = {
      ...defaultConfiguration,
      ...this.configuration,
    };
  }

  handleSearch(event: MouseEvent): void {
    this.search.emit(event);
  }

  handleAddContent(event: MouseEvent): void {
    this.addContent.emit(event);
  }
}
