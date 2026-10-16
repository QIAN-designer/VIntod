import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsStore } from '../../../core/services/products.store';
import { AdminStore } from '../../../core/services/admin.store';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../core/models/marketplace.model';
import { TableComponent, TableColumn } from '../../../shared/components/table/table.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AppCurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { AppDatePipe } from '../../../shared/pipes/date.pipe';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    TableComponent,
    BadgeComponent,
    SearchBarComponent,
    ModalComponent,
    AppCurrencyPipe,
    AppDatePipe
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Gestión del Catálogo de Prendas</h1>
          <p class="text-sm text-slate-500 mt-1">
            Administración completa de prendas en venta conectadas directamente al backend de Express y MongoDB.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <a
            routerLink="/admin/recycle-bin"
            class="inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg shadow-2xs transition-all"
            title="Ver prendas eliminadas (deletedAt ≠ null) para reactivarlas"
          >
            <svg class="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Papelera / Reactivar</span>
          </a>
          <button
            type="button"
            (click)="openCreateModal()"
            class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-all"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Crear Prenda</span>
          </button>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <!-- Buscador -->
          <div class="lg:col-span-2">
            <app-search-bar
              placeholder="Buscar por título, descripción o marca..."
              [searchTerm]="store.searchFilter()"
              (searchChange)="store.setSearchFilter($event)"
            ></app-search-bar>
          </div>

          <!-- Filtro Marca -->
          <div>
            <select
              [value]="store.brandFilter()"
              (change)="onBrandFilterChange($event)"
              class="block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Todas las Marcas</option>
              @for (b of adminStore.brands(); track b.id) {
                <option [value]="b.name">{{ b.name }}</option>
              }
            </select>
          </div>

          <!-- Filtro Estado Conservación -->
          <div>
            <select
              [value]="store.conditionFilter()"
              (change)="onConditionFilterChange($event)"
              class="block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Todas las Condiciones</option>
              @for (c of adminStore.conditions(); track c.id) {
                <option [value]="c.name">{{ c.name }}</option>
              }
            </select>
          </div>

          <!-- Filtro Visibilidad / Moderación -->
          <div>
            <select
              [value]="store.statusFilter()"
              (change)="onStatusFilterChange($event)"
              class="block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Estado: Todos</option>
              <option value="active">Solo Activos</option>
              <option value="inactive">Solo Pausados</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Mostrando <span class="font-bold text-slate-800">{{ store.filteredProducts().length }}</span> prendas de un total de <span class="font-bold text-slate-800">{{ store.totalProductsCount() }}</span>.
          </div>
          @if (store.searchFilter() || store.brandFilter() || store.conditionFilter() || store.statusFilter() !== 'all') {
            <button
              type="button"
              (click)="store.resetFilters()"
              class="text-teal-600 hover:text-teal-700 font-medium underline"
            >
              Limpiar filtros
            </button>
          }
        </div>
      </div>

      <!-- Custom Data Table -->
      <app-table
        [columns]="columns"
        [data]="store.filteredProducts()"
        [loading]="store.loading()"
        emptyMessage="No se encontraron prendas con los filtros aplicados"
        [hasActions]="true"
        [actionsTemplate]="actionsTemplate"
      >
      </app-table>

      <!-- Cell Templates -->
      <ng-template #titleTpl let-prod="row">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
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
              <span class="inline-block mt-0.5 text-[10px] font-mono text-teal-600 bg-teal-50 px-1 rounded">
                /{{ prod.slug }}
              </span>
            }
          </div>
        </div>
      </ng-template>

      <ng-template #priceTpl let-prod="row">
        <span class="font-bold text-slate-900">{{ prod.price | appCurrency }}</span>
      </ng-template>

      <ng-template #badgeTpl let-prod="row">
        <app-badge [color]="prod.isActive !== false ? 'emerald' : 'gray'" [dot]="true">
          {{ prod.isActive !== false ? 'Activo' : 'Pausado' }}
        </app-badge>
      </ng-template>

      <ng-template #conditionTpl let-prod="row">
        <span class="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
          {{ prod.condition }}
        </span>
      </ng-template>

      <ng-template #actionsTemplate let-prod="row">
        <div class="flex items-center justify-end gap-2">
          <!-- Toggle Active State button -->
          <button
            type="button"
            (click)="toggleActive(prod)"
            [title]="prod.isActive !== false ? 'Desactivar prenda' : 'Activar prenda'"
            class="p-1.5 rounded-lg border text-xs font-medium transition-colors"
            [class]="prod.isActive !== false ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100' : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'"
          >
            @if (prod.isActive !== false) {
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            } @else {
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          </button>

          <!-- Edit button -->
          <button
            type="button"
            (click)="openEditModal(prod)"
            title="Editar prenda"
            class="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-teal-700 hover:border-teal-300 bg-white hover:bg-slate-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <!-- Delete button -->
          <button
            type="button"
            (click)="deleteProduct(prod)"
            title="Eliminar prenda"
            class="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </ng-template>

      <!-- Modal Create / Edit Product -->
      <app-modal
        [isOpen]="isModalOpen()"
        [title]="editingProduct() ? 'Editar Prenda' : 'Nueva Prenda en Venta'"
        [showFooter]="false"
        (closed)="closeModal()"
      >
        <form [formGroup]="productForm" (ngSubmit)="saveProduct()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase">Título de la prenda</label>
            <input
              type="text"
              formControlName="title"
              placeholder="Ej: Sudadera vintage oversized"
              class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
            @if (productForm.get('title')?.invalid && productForm.get('title')?.touched) {
              <p class="text-xs text-rose-600 mt-1">El título debe tener entre 3 y 50 caracteres.</p>
            }
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase">Descripción</label>
            <textarea
              formControlName="description"
              rows="3"
              placeholder="Detalla estado, medidas, tejido y cualquier detalle relevante..."
              class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            ></textarea>
            @if (productForm.get('description')?.invalid && productForm.get('description')?.touched) {
              <p class="text-xs text-rose-600 mt-1">La descripción debe tener al menos 10 caracteres.</p>
            }
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase">Precio (€)</label>
              <input
                type="number"
                step="0.01"
                formControlName="price"
                placeholder="25.00"
                class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              @if (productForm.get('price')?.invalid && productForm.get('price')?.touched) {
                <p class="text-xs text-rose-600 mt-1">Introduce un precio válido mayor a 0.</p>
              }
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase">Marca</label>
              <select
                formControlName="brand"
                class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Selecciona marca</option>
                @for (b of adminStore.brands(); track b.id) {
                  <option [value]="b.name">{{ b.name }}</option>
                }
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase">Talla</label>
              <select
                formControlName="size"
                class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Selecciona talla</option>
                <option value="XXS">XXS</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="W30 L32">W30 L32</option>
                <option value="W32 L30">W32 L30</option>
                <option value="42">42</option>
                <option value="Única">Talla Única</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase">Estado / Condición</label>
              <select
                formControlName="condition"
                class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Selecciona estado</option>
                @for (c of adminStore.conditions(); track c.id) {
                  <option [value]="c.name">{{ c.name }}</option>
                }
              </select>
            </div>
          </div>

          <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              (click)="closeModal()"
              class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="productForm.invalid"
              class="px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm disabled:opacity-50 transition-all"
            >
              {{ editingProduct() ? 'Guardar Cambios' : 'Crear Prenda' }}
            </button>
          </div>
        </form>
      </app-modal>
    </div>
  `
})
export class AdminProductsComponent implements OnInit, AfterViewInit {
  store = inject(ProductsStore);
  adminStore = inject(AdminStore);
  notifications = inject(NotificationService);
  fb = inject(FormBuilder);

  @ViewChild('titleTpl') titleTpl!: TemplateRef<any>;
  @ViewChild('priceTpl') priceTpl!: TemplateRef<any>;
  @ViewChild('badgeTpl') badgeTpl!: TemplateRef<any>;
  @ViewChild('conditionTpl') conditionTpl!: TemplateRef<any>;

  isModalOpen = signal(false);
  editingProduct = signal<Product | null>(null);

  columns: TableColumn[] = [];

  productForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: ['', [Validators.required, Validators.min(0.01)]],
    brand: ['', [Validators.required]],
    size: ['', [Validators.required]],
    condition: ['', [Validators.required]]
  });

  ngOnInit() {
    this.store.loadProducts();
  }

  ngAfterViewInit() {
    this.initColumns();
  }

  private initColumns() {
    this.columns = [
      { key: 'title', label: 'Artículo', cellTemplate: this.titleTpl },
      { key: 'brand', label: 'Marca' },
      { key: 'size', label: 'Talla', align: 'center' },
      { key: 'condition', label: 'Estado', cellTemplate: this.conditionTpl },
      { key: 'price', label: 'Precio', align: 'right', cellTemplate: this.priceTpl },
      { key: 'isActive', label: 'Visibilidad', align: 'center', cellTemplate: this.badgeTpl }
    ];
  }

  onBrandFilterChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    this.store.setBrandFilter(val);
  }

  onConditionFilterChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    this.store.setConditionFilter(val);
  }

  onStatusFilterChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value as 'all' | 'active' | 'inactive';
    this.store.setStatusFilter(val);
  }

  toggleActive(prod: Product) {
    const id = prod._id || prod.id;
    if (!id) return;
    this.store.toggleProductActive(id);
    const newStatus = !(prod.isActive !== false);
    this.notifications.info(
      newStatus ? 'Prenda Activada' : 'Prenda Desactivada',
      `Visibilidad de "${prod.title}" actualizada.`
    );
  }

  openCreateModal() {
    this.editingProduct.set(null);
    this.productForm.reset({
      title: '',
      description: '',
      price: '',
      brand: '',
      size: '',
      condition: ''
    });
    this.isModalOpen.set(true);
  }

  openEditModal(prod: Product) {
    this.editingProduct.set(prod);
    this.productForm.patchValue({
      title: prod.title,
      description: prod.description,
      price: prod.price,
      brand: prod.brand,
      size: prod.size,
      condition: prod.condition
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingProduct.set(null);
  }

  saveProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formVal = this.productForm.value;
    const current = this.editingProduct();

    if (current) {
      const id = current._id || current.id!;
      this.store.updateProductData(id, formVal);
      this.notifications.success('Actualizado', `Prenda "${formVal.title}" actualizada con éxito.`);
    } else {
      this.store.addProduct(formVal);
      this.notifications.success('Creado', `Prenda "${formVal.title}" añadida al catálogo.`);
    }

    this.closeModal();
  }

  async deleteProduct(prod: Product) {
    const id = prod._id || prod.id;
    if (!id) return;

    const confirmed = await this.notifications.confirm(
      '¿Eliminar prenda?',
      `Esta acción dará de baja "${prod.title}" del catálogo.`
    );

    if (confirmed) {
      this.store.deleteProductData(id);
      this.notifications.success('Eliminado', 'Prenda eliminada del catálogo.');
    }
  }
}

