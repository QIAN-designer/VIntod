import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide capitalize"
      [class]="getColorClasses()"
    >
      @if (dot) {
        <span class="w-1.5 h-1.5 mr-1.5 rounded-full" [class]="getDotColor()"></span>
      }
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  @Input() color: 'success' | 'warning' | 'danger' | 'info' | 'gray' | 'teal' | 'emerald' | 'blue' = 'gray';
  @Input() dot = false;

  getColorClasses(): string {
    switch (this.color) {
      case 'success':
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'danger':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'info':
      case 'blue':
        return 'bg-sky-50 text-sky-700 border border-sky-200';
      case 'teal':
        return 'bg-teal-50 text-teal-700 border border-teal-200';
      case 'gray':
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  }

  getDotColor(): string {
    switch (this.color) {
      case 'success':
      case 'emerald':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      case 'danger':
        return 'bg-rose-500';
      case 'info':
      case 'blue':
        return 'bg-sky-500';
      case 'teal':
        return 'bg-teal-500';
      case 'gray':
      default:
        return 'bg-gray-400';
    }
  }
}

