import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    @if (loadingService.isLoading()) {
      <div class="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-vinted border-t-transparent"></div>
      </div>
    }
  `
})
export class LoaderComponent {
  loadingService = inject(LoadingService);
}