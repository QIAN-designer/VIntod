import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-slate-50 flex">
      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static flex flex-col shadow-xl"
        [class.-translate-x-full]="!isSidebarOpen()"
      >
        <!-- Brand Header -->
        <div class="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-black text-slate-950 text-xl shadow">
              V
            </div>
            <div>
              <span class="text-lg font-bold tracking-tight text-white">Vintod</span>
              <span class="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-teal-950 text-teal-400 border border-teal-800/60 rounded">Admin</span>
            </div>
          </div>
          <!-- Close button for mobile -->
          <button
            type="button"
            (click)="toggleSidebar()"
            class="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div class="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Catálogo & Marketplace
          </div>

          <a
            routerLink="/admin/products"
            routerLinkActive="bg-teal-600/20 text-teal-400 border-l-4 border-teal-500 font-semibold"
            class="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-r-lg text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
          >
            <svg class="w-5 h-5 text-slate-400 group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Productos / Prendas</span>
          </a>

          <a
            routerLink="/admin/recycle-bin"
            routerLinkActive="bg-teal-600/20 text-teal-400 border-l-4 border-teal-500 font-semibold"
            class="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-r-lg text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
          >
            <svg class="w-5 h-5 text-slate-400 group-hover:text-rose-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Papelera (Reactivar)</span>
          </a>

          <a
            routerLink="/admin/brands"
            routerLinkActive="bg-teal-600/20 text-teal-400 border-l-4 border-teal-500 font-semibold"
            class="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-r-lg text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
          >
            <svg class="w-5 h-5 text-slate-400 group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>Marcas</span>
          </a>

          <a
            routerLink="/admin/categories"
            routerLinkActive="bg-teal-600/20 text-teal-400 border-l-4 border-teal-500 font-semibold"
            class="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-r-lg text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
          >
            <svg class="w-5 h-5 text-slate-400 group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Categorías</span>
          </a>

          <a
            routerLink="/admin/conditions"
            routerLinkActive="bg-teal-600/20 text-teal-400 border-l-4 border-teal-500 font-semibold"
            class="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-r-lg text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
          >
            <svg class="w-5 h-5 text-slate-400 group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Estados de Prenda</span>
          </a>

          <div class="pt-4 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Comunidad & Ventas
          </div>

          <a
            routerLink="/admin/users"
            routerLinkActive="bg-teal-600/20 text-teal-400 border-l-4 border-teal-500 font-semibold"
            class="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-r-lg text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
          >
            <svg class="w-5 h-5 text-slate-400 group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Usuarios / Vendedores</span>
          </a>

          <a
            routerLink="/admin/orders"
            routerLinkActive="bg-teal-600/20 text-teal-400 border-l-4 border-teal-500 font-semibold"
            class="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-r-lg text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
          >
            <svg class="w-5 h-5 text-slate-400 group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span>Pedidos & Transacciones</span>
          </a>
        </nav>

        <!-- Sidebar Footer -->
        <div class="p-4 bg-slate-950 border-t border-slate-800">
          <a
            routerLink="/"
            class="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Volver al Marketplace</span>
          </a>
        </div>
      </aside>

      <!-- Main Admin Area -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Topbar -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 shadow-xs">
          <div class="flex items-center gap-3">
            <button
              type="button"
              (click)="toggleSidebar()"
              class="lg:hidden text-slate-500 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <!-- Breadcrumbs -->
            <nav class="flex items-center text-sm font-medium text-slate-500" aria-label="Breadcrumb">
              <ol class="inline-flex items-center space-x-1 sm:space-x-2">
                <li class="inline-flex items-center">
                  <span class="text-slate-400">Admin</span>
                </li>
                <li>
                  <div class="flex items-center">
                    <svg class="w-4 h-4 text-slate-300 mx-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="capitalize text-slate-800 font-semibold">{{ currentSection() }}</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <!-- User Info / Auth Stub -->
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-3">
              <img
                [src]="auth.currentUser().avatar"
                alt="Avatar"
                class="w-9 h-9 rounded-full object-cover ring-2 ring-teal-500/20"
              />
              <div class="hidden sm:block text-left">
                <div class="text-xs font-bold text-slate-800">{{ auth.currentUser().name }}</div>
                <div class="text-[11px] text-slate-400 capitalize">{{ auth.currentUser().role }}</div>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  router = inject(Router);

  isSidebarOpen = signal(false);
  currentSection = signal('products');

  constructor() {
    this.updateCurrentSection(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.updateCurrentSection(event.urlAfterRedirects);
        this.isSidebarOpen.set(false);
      });
  }

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  private updateCurrentSection(url: string) {
    const parts = url.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0] === 'admin') {
      this.currentSection.set(parts[1]);
    } else {
      this.currentSection.set('products');
    }
  }
}

