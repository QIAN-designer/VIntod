import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" (click)="close()"></div>

        <!-- Dialog Box -->
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div
            class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full"
            [class]="maxWidthClass"
            (click)="$event.stopPropagation()"
          >
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                {{ title }}
              </h3>
              <button
                type="button"
                (click)="close()"
                class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none transition-colors"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-6">
              <ng-content select="[body]"></ng-content>
              <ng-content></ng-content>
            </div>

            <!-- Modal Footer -->
            @if (showFooter) {
              <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <ng-content select="[footer]"></ng-content>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Modal';
  @Input() maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'lg';
  @Input() showFooter = true;
  @Output() closed = new EventEmitter<void>();

  get maxWidthClass(): string {
    switch (this.maxWidth) {
      case 'sm': return 'sm:max-w-sm';
      case 'md': return 'sm:max-w-md';
      case 'xl': return 'sm:max-w-xl';
      case '2xl': return 'sm:max-w-2xl';
      case 'lg':
      default: return 'sm:max-w-lg';
    }
  }

  close() {
    this.closed.emit();
  }
}

