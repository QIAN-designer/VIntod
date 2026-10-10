import { Component, AfterViewInit, ViewChild, TemplateRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminStore } from '../../../core/services/admin.store';
import { NotificationService } from '../../../core/services/notification.service';
import { Category } from '../../../core/models/marketplace.model';
import { TableComponent, TableColumn } from '../../../shared/components/table/table.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-admin-categories',
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
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Categorías del Catálogo</h1>
          <p class="text-sm text-slate-500 mt-1">
            Organiza las secciones y categorías principales de la tienda (Hombre, Mujer, Niños, Calzado, etc.).
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
          <span>Nueva Categoría</span>
        </button>
      </div>

      <!-- Search Toolbar -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="w-full sm:w-96">
          <app-search-bar
            placeholder="Buscar categoría..."
            [searchTerm]="searchQuery()"
            (searchChange)="searchQuery.set($event)"
          ></app-search-bar>
        </div>
        <div class="text-xs text-slate-500">
          Total categorías: <span class="font-bold text-slate-800">{{ adminStore.categories().length }}</span>
        </div>
      </div>

      <!-- Table -->
      <app-table
        [columns]="columns"
        [data]="filteredCategories()"
        emptyMessage="No se encontraron categorías"
        [hasActions]="true"
        [actionsTemplate]="actionsTemplate"
      >
      </app-table>

      <!-- Cell Templates -->
      <ng-template #catTpl let-c="row">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center text-lg">
            {{ c.icon || '🛍️' }}
          </div>
          <div>
            <div class="font-semibold text-slate-900">{{ c.name }}</div>
            <div class="text-xs text-slate-400 font-mono">slug: {{ c.slug }}</div>
          </div>
        </div>
      </ng-template>

      <ng-template #statusTpl let-c="row">
        <app-badge [color]="c.isActive ? 'emerald' : 'gray'" [dot]="true">
          {{ c.isActive ? 'Visible' : 'Oculta' }}
        </app-badge>
      </ng-template>

      <ng-template #actionsTemplate let-c="row">
        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            (click)="toggleActive(c)"
            [title]="c.isActive ? 'Ocultar categoría' : 'Mostrar categoría'"
            class="p-1.5 rounded-lg border text-xs font-medium transition-colors"
            [class]="c.isActive ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100' : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'"
          >
            {{ c.isActive ? 'Ocultar' : 'Activar' }}
          </button>
          <button
            type="button"
            (click)="openEditModal(c)"
            title="Editar categoría"
            class="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-teal-700 hover:border-teal-300 bg-white hover:bg-slate-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            type="button"
            (click)="deleteCategory(c)"
            title="Eliminar categoría"
            class="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </ng-template>

      <!-- Modal Create / Edit Category -->
      <app-modal
        [isOpen]="isModalOpen()"
        [title]="editingCategory() ? 'Editar Categoría' : 'Nueva Categoría'"
        [showFooter]="false"
        (closed)="closeModal()"
      >
        <form [formGroup]="categoryForm" (ngSubmit)="saveCategory()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase">Nombre</label>
            <input
              type="text"
              formControlName="name"
              placeholder="Ej: Accesorios y Joyería"
              class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase">Emoji o Icono</label>
            <input
              type="text"
              formControlName="icon"
              placeholder="Ej: 💍 o 👜"
              class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
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
              [disabled]="categoryForm.invalid"
              class="px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm disabled:opacity-50 transition-all"
            >
              {{ editingCategory() ? 'Guardar Cambios' : 'Crear Categoría' }}
            </button>
          </div>
        </form>
      </app-modal>
    </div>
  `
})
export class AdminCategoriesComponent implements AfterViewInit {
  adminStore = inject(AdminStore);
  notifications = inject(NotificationService);
  fb = inject(FormBuilder);

  @ViewChild('catTpl') catTpl!: TemplateRef<any>;
  @ViewChild('statusTpl') statusTpl!: TemplateRef<any>;

  searchQuery = signal('');
  isModalOpen = signal(false);
  editingCategory = signal<Category | null>(null);

  columns: TableColumn[] = [];

  ngAfterViewInit() {
    this.columns = [
      { key: 'name', label: 'Categoría', cellTemplate: this.catTpl },
      { key: 'itemCount', label: 'Prendas asociadas', align: 'center' },
      { key: 'isActive', label: 'Visibilidad', align: 'center', cellTemplate: this.statusTpl },
      { key: 'createdAt', label: 'Fecha' }
    ];
  }

  categoryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    icon: ['🛍️']
  });

  filteredCategories() {
    const list = this.adminStore.categories();
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return list;
    return list.filter(c => c.name.toLowerCase().includes(q));
  }

  toggleActive(c: Category) {
    this.adminStore.toggleCategoryActive(c.id);
    this.notifications.info('Estado actualizado', `Visibilidad de categoría ${c.name} modificada.`);
  }

  openCreateModal() {
    this.editingCategory.set(null);
    this.categoryForm.reset({ name: '', icon: '🛍️' });
    this.isModalOpen.set(true);
  }

  openEditModal(c: Category) {
    this.editingCategory.set(c);
    this.categoryForm.patchValue({
      name: c.name,
      icon: c.icon || '🛍️'
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingCategory.set(null);
  }

  saveCategory() {
    if (this.categoryForm.invalid) return;
    const val = this.categoryForm.value;
    const current = this.editingCategory();

    if (current) {
      this.adminStore.saveCategory({ ...val, id: current.id });
      this.notifications.success('Categoría actualizada', `Categoría ${val.name} guardada.`);
    } else {
      this.adminStore.saveCategory(val);
      this.notifications.success('Categoría creada', `Categoría ${val.name} creada con éxito.`);
    }
    this.closeModal();
  }

  async deleteCategory(c: Category) {
    const ok = await this.notifications.confirm(
      '¿Eliminar categoría?',
      `Se eliminará la categoría ${c.name}.`
    );
    if (ok) {
      this.adminStore.deleteCategory(c.id);
      this.notifications.success('Categoría eliminada', 'La categoría ha sido eliminada.');
    }
  }
}

