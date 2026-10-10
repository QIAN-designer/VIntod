import { Component, AfterViewInit, ViewChild, TemplateRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminStore } from '../../../core/services/admin.store';
import { NotificationService } from '../../../core/services/notification.service';
import { Brand } from '../../../core/models/marketplace.model';
import { TableComponent, TableColumn } from '../../../shared/components/table/table.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-admin-brands',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TableComponent,
    BadgeComponent,
    SearchBarComponent,
    ModalComponent
  ],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Gestión de Marcas</h1>
          <p class="text-sm text-slate-500 mt-1">
            Administra las marcas de moda disponibles para categorizar los artículos del catálogo.
          </p>
        </div>
        <button
          type="button"
          (click)="openCreateModal()"
          class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-all"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nueva Marca</span>
        </button>
      </div>

      <!-- Search Toolbar -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="w-full sm:w-96">
          <app-search-bar
            placeholder="Buscar marca por nombre o descripción..."
            [searchTerm]="searchQuery()"
            (searchChange)="searchQuery.set($event)"
          ></app-search-bar>
        </div>
        <div class="text-xs text-slate-500">
          Total marcas: <span class="font-bold text-slate-800">{{ adminStore.brands().length }}</span>
        </div>
      </div>

      <!-- Table -->
      <app-table
        [columns]="columns"
        [data]="filteredBrands()"
        emptyMessage="No se encontraron marcas"
        [hasActions]="true"
        [actionsTemplate]="actionsTemplate"
      >
      </app-table>

      <!-- Cell Templates -->
      <ng-template #brandTpl let-b="row">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-lg">
            {{ b.logo || '🏷️' }}
          </div>
          <div>
            <div class="font-semibold text-slate-900">{{ b.name }}</div>
            <div class="text-xs text-slate-400 font-mono">slug: {{ b.slug }}</div>
          </div>
        </div>
      </ng-template>

      <ng-template #statusTpl let-b="row">
        <app-badge [color]="b.isActive ? 'emerald' : 'gray'" [dot]="true">
          {{ b.isActive ? 'Activa' : 'Desactivada' }}
        </app-badge>
      </ng-template>

      <ng-template #actionsTemplate let-b="row">
        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            (click)="toggleActive(b)"
            [title]="b.isActive ? 'Desactivar marca' : 'Activar marca'"
            class="p-1.5 rounded-lg border text-xs font-medium transition-colors"
            [class]="b.isActive ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100' : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'"
          >
            {{ b.isActive ? 'Desactivar' : 'Activar' }}
          </button>
          <button
            type="button"
            (click)="openEditModal(b)"
            title="Editar marca"
            class="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-teal-700 hover:border-teal-300 bg-white hover:bg-slate-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            type="button"
            (click)="deleteBrand(b)"
            title="Eliminar marca"
            class="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </ng-template>

      <!-- Modal Create / Edit Brand -->
      <app-modal
        [isOpen]="isModalOpen()"
        [title]="editingBrand() ? 'Editar Marca' : 'Nueva Marca de Moda'"
        [showFooter]="false"
        (closed)="closeModal()"
      >
        <form [formGroup]="brandForm" (ngSubmit)="saveBrand()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase">Nombre de la marca</label>
            <input
              type="text"
              formControlName="name"
              placeholder="Ej: Ralph Lauren"
              class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase">Icono / Emoji o Logo</label>
            <input
              type="text"
              formControlName="logo"
              placeholder="Ej: 👕 o 🏇"
              class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase">Descripción</label>
            <textarea
              formControlName="description"
              rows="3"
              placeholder="Breve reseña sobre la marca o estilo..."
              class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            ></textarea>
          </div>

          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              formControlName="featured"
              class="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <label for="featured" class="text-sm text-slate-700">Marca destacada en portada</label>
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
              [disabled]="brandForm.invalid"
              class="px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm disabled:opacity-50 transition-all"
            >
              {{ editingBrand() ? 'Guardar Cambios' : 'Crear Marca' }}
            </button>
          </div>
        </form>
      </app-modal>
    </div>
  `
})
export class AdminBrandsComponent implements AfterViewInit {
  adminStore = inject(AdminStore);
  notifications = inject(NotificationService);
  fb = inject(FormBuilder);

  @ViewChild('brandTpl') brandTpl!: TemplateRef<any>;
  @ViewChild('statusTpl') statusTpl!: TemplateRef<any>;

  searchQuery = signal('');
  isModalOpen = signal(false);
  editingBrand = signal<Brand | null>(null);

  columns: TableColumn[] = [];

  ngAfterViewInit() {
    this.columns = [
      { key: 'name', label: 'Marca', cellTemplate: this.brandTpl },
      { key: 'description', label: 'Descripción' },
      { key: 'itemCount', label: 'Artículos', align: 'center' },
      { key: 'isActive', label: 'Visibilidad', align: 'center', cellTemplate: this.statusTpl },
      { key: 'createdAt', label: 'Alta' }
    ];
  }

  brandForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    logo: ['🏷️'],
    description: [''],
    featured: [false]
  });

  filteredBrands() {
    const list = this.adminStore.brands();
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return list;
    return list.filter(b => b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q));
  }

  toggleActive(b: Brand) {
    this.adminStore.toggleBrandActive(b.id);
    this.notifications.info('Estado actualizado', `Visibilidad de ${b.name} modificada.`);
  }

  openCreateModal() {
    this.editingBrand.set(null);
    this.brandForm.reset({ name: '', logo: '🏷️', description: '', featured: false });
    this.isModalOpen.set(true);
  }

  openEditModal(b: Brand) {
    this.editingBrand.set(b);
    this.brandForm.patchValue({
      name: b.name,
      logo: b.logo || '🏷️',
      description: b.description || '',
      featured: b.featured ?? false
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingBrand.set(null);
  }

  saveBrand() {
    if (this.brandForm.invalid) return;
    const val = this.brandForm.value;
    const current = this.editingBrand();

    if (current) {
      this.adminStore.saveBrand({ ...val, id: current.id });
      this.notifications.success('Marca actualizada', `Marca ${val.name} actualizada.`);
    } else {
      this.adminStore.saveBrand(val);
      this.notifications.success('Marca creada', `Marca ${val.name} añadida al catálogo.`);
    }
    this.closeModal();
  }

  async deleteBrand(b: Brand) {
    const ok = await this.notifications.confirm(
      '¿Eliminar marca?',
      `Se eliminará la marca ${b.name}.`
    );
    if (ok) {
      this.adminStore.deleteBrand(b.id);
      this.notifications.success('Marca eliminada', 'La marca ha sido eliminada.');
    }
  }
}

