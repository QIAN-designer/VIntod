import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsStore } from '../../../core/services/products.store';
import { AdminStore } from '../../../core/services/admin.store';
import { AppCurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { AppDatePipe } from '../../../shared/pipes/date.pipe';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, AppCurrencyPipe, AppDatePipe, BadgeComponent],
  template: `
    <div class="space-y-6">
      <!-- Welcome Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Panel de Control General</h1>
          <p class="text-sm text-slate-500 mt-1">Supervisión en tiempo real de catálogo, moderación, vendedores y pedidos.</p>
        </div>
        <div class="flex items-center gap-2">
          <a
            routerLink="/admin/recycle-bin"
            class="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg shadow-2xs transition-all"
            title="Ver y reactivar artículos eliminados (deletedAt)"
          >
            <svg class="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Papelera ({{ productsStore.deletedProducts().length }})</span>
          </a>
          <a
            routerLink="/admin/products/new"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-all"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Nueva Prenda</span>
          </a>
        </div>
      </div>

      <!-- Stat Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Products Card -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-300 transition-colors">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Prendas en Catálogo</span>
            <div class="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-baseline justify-between">
            <span class="text-3xl font-extrabold text-slate-900">{{ productsStore.totalProductsCount() }}</span>
            <span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {{ productsStore.activeProductsCount() }} activas
            </span>
          </div>
          <div class="mt-3 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-3">
            <span>Valor catálogo:</span>
            <span class="font-bold text-slate-700">{{ productsStore.totalCatalogValue() | appCurrency }}</span>
          </div>
        </div>

        <!-- Orders & GMV Card -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-300 transition-colors">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Volumen Ventas</span>
            <div class="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-baseline justify-between">
            <span class="text-3xl font-extrabold text-slate-900">{{ adminStore.totalOrdersVolume() | appCurrency }}</span>
            <span class="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
              {{ adminStore.orders().length }} pedidos
            </span>
          </div>
          <div class="mt-3 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-3">
            <span>Ticket medio:</span>
            <span class="font-bold text-slate-700">
              {{ (adminStore.totalOrdersVolume() / (adminStore.orders().length || 1)) | appCurrency }}
            </span>
          </div>
        </div>

        <!-- Community Users Card -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-300 transition-colors">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Usuarios Registrados</span>
            <div class="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-baseline justify-between">
            <span class="text-3xl font-extrabold text-slate-900">{{ adminStore.users().length }}</span>
            <span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {{ adminStore.activeUsersCount() }} activos
            </span>
          </div>
          <div class="mt-3 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-3">
            <span>Comunidad:</span>
            <span class="font-bold text-slate-700">Compradores y vendedores</span>
          </div>
        </div>

        <!-- Brands & Categories Card -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-300 transition-colors">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Taxonomía / Marcas</span>
            <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-baseline justify-between">
            <span class="text-3xl font-extrabold text-slate-900">{{ adminStore.brands().length }}</span>
            <span class="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {{ adminStore.categories().length }} categorías
            </span>
          </div>
          <div class="mt-3 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-3">
            <span>Estados activos:</span>
            <span class="font-bold text-slate-700">{{ adminStore.activeConditionsCount() }} condiciones</span>
          </div>
        </div>
      </div>

      <!-- Quick Action / Moderation Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Latest Products Table -->
        <div class="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div class="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-slate-900">Últimas Prendas Publicadas</h2>
              <p class="text-xs text-slate-500">Catálogo directo desde la API de backend de Vintod</p>
            </div>
            <a routerLink="/admin/products" class="text-xs font-semibold text-teal-600 hover:text-teal-700">
              Ver todas ({{ productsStore.totalProductsCount() }}) →
            </a>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-100 text-left text-sm">
              <thead class="bg-slate-50/75">
                <tr>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Prenda</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Marca / Talla</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Precio</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Estado</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500 text-right">Moderación</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (prod of productsStore.products().slice(0, 5); track prod._id || prod.id) {
                  <tr class="hover:bg-slate-50/60 transition-colors">
                    <td class="px-4 py-3.5">
                      <div class="font-medium text-slate-900">{{ prod.title }}</div>
                      <div class="text-xs text-slate-400 truncate max-w-xs">{{ prod.description }}</div>
                    </td>
                    <td class="px-4 py-3.5">
                      <div class="font-medium text-slate-700">{{ prod.brand }}</div>
                      <div class="text-xs text-slate-400">Talla {{ prod.size }}</div>
                    </td>
                    <td class="px-4 py-3.5 font-bold text-slate-900">
                      {{ prod.price | appCurrency }}
                    </td>
                    <td class="px-4 py-3.5">
                      <app-badge [color]="prod.isActive !== false ? 'emerald' : 'gray'" [dot]="true">
                        {{ prod.isActive !== false ? 'Activo' : 'Pausado' }}
                      </app-badge>
                    </td>
                    <td class="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        (click)="productsStore.toggleProductActive(prod._id || prod.id!)"
                        class="text-xs font-medium px-2.5 py-1 rounded-md border transition-colors"
                        [class]="prod.isActive !== false ? 'text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100' : 'text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100'"
                      >
                        {{ prod.isActive !== false ? 'Desactivar' : 'Activar' }}
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Latest Orders Feed -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div class="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-slate-900">Últimas Transacciones</h2>
              <p class="text-xs text-slate-500">Pedidos entre usuarios</p>
            </div>
            <a routerLink="/admin/orders" class="text-xs font-semibold text-teal-600 hover:text-teal-700">
              Ver todas →
            </a>
          </div>

          <div class="p-4 flex-1 space-y-3 overflow-y-auto">
            @for (order of adminStore.orders(); track order.id) {
              <div class="p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors bg-slate-50/50">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono font-bold text-teal-700">{{ order.orderNumber }}</span>
                  <span class="text-xs font-bold text-slate-900">{{ order.totalAmount | appCurrency }}</span>
                </div>
                <div class="mt-2 text-xs text-slate-600 flex items-center justify-between">
                  <span>{{ order.buyerName }} ← {{ order.sellerName }}</span>
                  <app-badge [color]="getOrderStatusColor(order.status)">
                    {{ order.status }}
                  </app-badge>
                </div>
                <div class="mt-1 text-[11px] text-slate-400">
                  {{ order.createdAt | appDate:'relative' }} • {{ order.paymentMethod }}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  productsStore = inject(ProductsStore);
  adminStore = inject(AdminStore);

  ngOnInit() {
    this.productsStore.loadProducts();
    this.productsStore.loadDeletedProducts();
  }

  getOrderStatusColor(status: string): any {
    switch (status) {
      case 'delivered': return 'emerald';
      case 'shipped': return 'blue';
      case 'paid': return 'teal';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'gray';
    }
  }
}

