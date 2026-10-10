import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="relative w-full">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <input
        type="text"
        [placeholder]="placeholder"
        [ngModel]="searchTerm"
        (ngModelChange)="onSearchChange($event)"
        class="block w-full pl-9 pr-8 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vinted focus:border-vinted"
      />
      @if (searchTerm) {
        <button
          type="button"
          (click)="clear()"
          class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600"
          title="Borrar búsqueda"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      }
    </div>
  `
})
export class SearchBarComponent {
  @Input() placeholder = 'Buscar...';
  @Input() searchTerm = '';
  @Output() searchChange = new EventEmitter<string>();

  onSearchChange(val: string) {
    this.searchTerm = val;
    this.searchChange.emit(val);
  }

  clear() {
    this.searchTerm = '';
    this.searchChange.emit('');
  }
}

