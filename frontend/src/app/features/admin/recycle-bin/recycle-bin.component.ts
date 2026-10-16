import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsStore } from '../../../core/services/products.store';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../core/models/marketplace.model';
import { TableComponent, TableColumn } from '../../../shared/components/table/table.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { AppCurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { AppDatePipe } from '../../../shared/pipes/date.pipe';

@Component({
  selector: 'app-recycle-bin',
  standalone: true,
  imports: [
    RouterLink,
    TableComponent,
    BadgeComponent,
    SearchBarComponent,
    AppCurrencyPipe,
    AppDatePipe
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">Artículos Eliminados</h1>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              deletedAt ≠ null
            </span>
          </div>
          <p class="text-sm text-slate-500 mt-1">
            Papelera y auditoría de prendas dadas de baja lógicamente (soft delete). Puedes reactivarlas al catálogo activo en cualquier momento.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            (click)="reload()"
            class="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-xs transition-all"
          >
            <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Actualizar</span>
          </button>
          <a
            routerLink="/admin/products"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-all"
          >
            <span>Ir al Catálogo Activo →</span>
          </a>
        </div>
      </div>

      <!-- Info Banner -->
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <svg class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="text-xs text-amber-800 leading-relaxed">
          <strong class="font-semibold">Información de recuperación:</strong> Las prendas listadas a continuación han sido eliminadas mediante <em>Soft Delete</em> (su campo <code class="bg-amber-100 px-1 py-0.5 rounded font-mono">deletedAt</code> contiene una fecha). Al pulsar <strong>Reactivar Prenda</strong>, el backend restablece <code class="bg-amber-100 px-1 py-0.5 rounded font-mono">deletedAt: null</code> mediante <code class="bg-amber-100 px-1 py-0.5 rounded font-mono">POST /api/products/:id/restore</code>, volviendo a estar visible en el catálogo de forma inmediata.
        </div>
      </div>

      <!-- Search Toolbar -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="w-full sm:w-96">
          <app-search-bar
            placeholder="Buscar prenda eliminada por título, marca o descripción..."
            [searchTerm]="searchQuery()"
            (searchChange)="searchQuery.set($event)"
          ></app-search-bar>
        </div>
        <div class="text-xs text-slate-500">
          Total eliminados: <span class="font-bold text-slate-800">{{ store.deletedProducts().length }}</span> prendas
        </div>
      </div>

      <!-- Table -->
      <app-table
        [columns]="columns"
        [data]="filteredDeletedProducts()"
        [loading]="store.loading()"
        emptyMessage="No hay prendas eliminadas en la papelera"
        [hasActions]="true"
        [actionsTemplate]="actionsTemplate"
      >
      </app-table>

      <!-- Cell Templates -->
      <ng-template #titleTpl let-prod="row">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center opacity-75">
            @if (prod.image) {
              <img [src]="prod.image" [alt]="prod.title" class="w-full h-full object-cover">
            } @else {
              <span class="text-xs text-slate-400">👕</span>
            }
          </div>
          <div>
            <div class="font-semibold text-slate-900">{{ prod.title }}</div>
            <div class="text-xs text-slate-400 truncate max-w-xs">{{ prod.description }}</div>
            @if (prod.slug) {
              <span class="inline-block mt-0.5 text-[10px] font-mono text-slate-500 bg-slate-100 px-1 rounded">
                /{{ prod.slug }}
              </span>
            }
          </div>
        </div>
      </ng-template>

      <ng-template #priceTpl let-prod="row">
        <span class="font-bold text-slate-900">{{ prod.price | appCurrency }}</span>
      </ng-template>

      <ng-template #deletedAtTpl let-prod="row">
        <div class="text-xs">
          <span class="font-mono text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
            {{ prod.deletedAt | appDate:'full' }}
          </span>
          <div class="text-[11px] text-slate-400 mt-1">
            {{ prod.deletedAt | appDate:'relative' }}
          </div>
        </div>
      </ng-template>

      <ng-template #statusTpl let-prod="row">
        <app-badge color="danger" [dot]="true">
          Eliminado
        </app-badge>
      </ng-template>

      <ng-template #actionsTemplate let-prod="row">
        <div class="flex items-center justify-end">
          <button
            type="button"
            (click)="restoreProduct(prod)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg shadow-2xs transition-all"
            title="Reactivar y restaurar artículo al catálogo activo"
          >
            <svg class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reactivar Prenda</span>
          </button>
        </div>
      </ng-template>
    </div>
  `
})
export class RecycleBinComponent implements OnInit, AfterViewInit {
  store = inject(ProductsStore);
  notifications = inject(NotificationService);

  @ViewChild('titleTpl') titleTpl!: TemplateRef<any>;
  @ViewChild('priceTpl') priceTpl!: TemplateRef<any>;
  @ViewChild('deletedAtTpl') deletedAtTpl!: TemplateRef<any>;
  @ViewChild('statusTpl') statusTpl!: TemplateRef<any>;

  searchQuery = signal('');
  columns: TableColumn[] = [];

  ngOnInit() {
    this.reload();
  }

  ngAfterViewInit() {
    this.columns = [
      { key: 'title', label: 'Artículo Eliminado', cellTemplate: this.titleTpl },
      { key: 'brand', label: 'Marca' },
      { key: 'size', label: 'Talla', align: 'center' },
      { key: 'price', label: 'Precio', align: 'right', cellTemplate: this.priceTpl },
      { key: 'status', label: 'Estado', align: 'center', cellTemplate: this.statusTpl },
      { key: 'deletedAt', label: 'Fecha Eliminación (deletedAt)', cellTemplate: this.deletedAtTpl }
    ];
  }

  reload() {
    this.store.loadDeletedProducts();
  }

  filteredDeletedProducts() {
    const list = this.store.deletedProducts();
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return list;
    return list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.brand && p.brand.toLowerCase().includes(q))
    );
  }

  async restoreProduct(prod: Product) {
    const id = prod._id || prod.id;
    if (!id) return;

    const confirmed = await this.notifications.confirm(
      '¿Reactivar artículo?',
      `El artículo "${prod.title}" volverá a estar disponible en el catálogo activo y se limpiará su deletedAt.`,
      'Sí, reactivar'
    );

    if (confirmed) {
      this.store.restoreProductData(id);
      this.notifications.success('Reactivado con éxito', `"${prod.title}" ha sido restaurado.`);
    }
  }
}

