import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-contact',
  template: `
    <header class="mb-4">
      <h1 class="text-4xl font-bold">Contact</h1>
      <p class="text-sm text-neutral-600">Summary of the content</p>
    </header>

    <button type="button" class="{{ buttonClasses }}">Content Button</button>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class ContactComponent {
  get buttonClasses(): string {
    return twMerge(
      'rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-neutral-900 shadow-md ring-1 ring-inset ring-neutral-300',
      'hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none active:bg-neutral-100',
      '[&_*]:pointer-events-none',
    );
  }
}
