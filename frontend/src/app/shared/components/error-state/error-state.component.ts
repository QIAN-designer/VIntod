import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  template: `
    <div class="text-center py-12 bg-red-50 rounded-lg border border-red-200">
      <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-red-800">Error</h3>
      <p class="mt-1 text-sm text-red-600">{{ message }}</p>
      <div class="mt-6">
        <button (click)="retry.emit()" type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          Reintentar
        </button>
      </div>
    </div>
  `
})
export class ErrorStateComponent {
  @Input() message = 'Ha ocurrido un error inesperado.';
  @Output() retry = new EventEmitter<void>();
}