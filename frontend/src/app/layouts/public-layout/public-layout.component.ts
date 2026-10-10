import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NavbarComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <!-- Public Top Bar Notice / Admin Switcher -->
      <div class="bg-gray-900 text-gray-200 text-xs py-1.5 px-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Vintod Marketplace Público (v20+)</span>
          </div>
          <div class="flex items-center gap-4">
            <a routerLink="/admin/products" class="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Ir al Panel de Administración →</span>
            </a>
          </div>
        </div>
      </div>

      <app-navbar></app-navbar>

      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <router-outlet></router-outlet>
      </main>

      <!-- Public Footer -->
      <footer class="bg-white border-t border-gray-200 mt-auto">
        <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div class="flex items-center gap-2">
            <span class="text-xl font-black text-vinted tracking-tight">Vintod</span>
            <span>&copy; 2026 Todos los derechos reservados.</span>
          </div>
          <div class="flex gap-6">
            <a routerLink="/" class="hover:text-vinted transition-colors">Explorar Prendas</a>
            <a routerLink="/products/new" class="hover:text-vinted transition-colors">Vender</a>
            <a routerLink="/admin/products" class="font-medium text-vinted hover:underline">Acceso Admin</a>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class PublicLayoutComponent {}

