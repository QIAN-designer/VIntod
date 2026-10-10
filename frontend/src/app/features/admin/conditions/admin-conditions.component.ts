import { Component, AfterViewInit, ViewChild, TemplateRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminStore } from '../../../core/services/admin.store';
import { NotificationService } from '../../../core/services/notification.service';
import { Condition } from '../../../core/models/marketplace.model';
import { TableComponent, TableColumn } from '../../../shared/components/table/table.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-admin-conditions',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TableComponent,
    BadgeComponent,
    ModalComponent
  ],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Estados de Conservación de Prendas</h1>
          <p class="text-sm text-slate-500 mt-1">
            Gestión de las condiciones del catálogo ("Nuevo con etiquetas", "Muy bueno", "Bueno", etc.).
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
          <span>Nueva Condición</span>
        </button>
      </div>

      <!-- Table -->
      <app-table
        [columns]="columns"
        [data]="adminStore.conditions()"
        emptyMessage="No hay estados configurados"
        [hasActions]="true"
        [actionsTemplate]="actionsTemplate"
      >
      </app-table>

      <!-- Cell Templates -->
      <ng-template #badgeTpl let-c="row">
        <app-badge [color]="c.badgeColor">
          {{ c.name }}
        </app-badge>
      </ng-template>

      <ng-template #statusTpl let-c="row">
        <app-badge [color]="c.isActive ? 'emerald' : 'gray'" [dot]="true">
          {{ c.isActive ? 'Activo' : 'Inactivo' }}
        </app-badge>
      </ng-template>

      <ng-template #actionsTemplate let-c="row">
        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            (click)="toggleActive(c)"
            class="p-1.5 rounded-lg border text-xs font-medium transition-colors"
            [class]="c.isActive ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100' : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'"
          >
            {{ c.isActive ? 'Desactivar' : 'Activar' }}
          </button>
          <button
            type="button"
            (click)="openEditModal(c)"
            class="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-teal-700 hover:border-teal-300 bg-white hover:bg-slate-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            type="button"
            (click)="deleteCondition(c)"
            class="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </ng-template>

      <!-- Modal Create / Edit Condition -->
      <app-modal
        [isOpen]="isModalOpen()"
        [title]="editingCondition() ? 'Editar Condición' : 'Nueva Condición'"
        [showFooter]="false"
        (closed)="closeModal()"
      >
        <form [formGroup]="condForm" (ngSubmit)="saveCondition()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase">Nombre</label>
            <input
              type="text"
              formControlName="name"
              placeholder="Ej: Como nuevo (puesto 1 vez)"
              class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase">Descripción</label>
            <textarea
              formControlName="description"
              rows="3"
              placeholder="Guía para compradores sobre qué esperar de este estado..."
              class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase">Color de Distintivo (Badge)</label>
            <select
              formControlName="badgeColor"
              class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="emerald">Verde Esmeralda (Excelente/Nuevo)</option>
              <option value="teal">Verde Azulado</option>
              <option value="blue">Azul (Muy bueno)</option>
              <option value="warning">Ámbar (Bueno/Satisfactorio)</option>
              <option value="gray">Gris neutro</option>
            </select>
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
              [disabled]="condForm.invalid"
              class="px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm disabled:opacity-50 transition-all"
            >
              {{ editingCondition() ? 'Guardar Cambios' : 'Crear Condición' }}
            </button>
          </div>
        </form>
      </app-modal>
    </div>
  `
})
export class AdminConditionsComponent implements AfterViewInit {
  adminStore = inject(AdminStore);
  notifications = inject(NotificationService);
  fb = inject(FormBuilder);

  @ViewChild('badgeTpl') badgeTpl!: TemplateRef<any>;
  @ViewChild('statusTpl') statusTpl!: TemplateRef<any>;

  isModalOpen = signal(false);
  editingCondition = signal<Condition | null>(null);

  columns: TableColumn[] = [];

  ngAfterViewInit() {
    this.columns = [
      { key: 'name', label: 'Distintivo', cellTemplate: this.badgeTpl },
      { key: 'description', label: 'Descripción' },
      { key: 'isActive', label: 'Estado', align: 'center', cellTemplate: this.statusTpl },
      { key: 'createdAt', label: 'Creación' }
    ];
  }

  condForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]],
    badgeColor: ['teal', [Validators.required]]
  });

  toggleActive(c: Condition) {
    this.adminStore.toggleConditionActive(c.id);
    this.notifications.info('Estado modificado', `Condición ${c.name} actualizada.`);
  }

  openCreateModal() {
    this.editingCondition.set(null);
    this.condForm.reset({ name: '', description: '', badgeColor: 'teal' });
    this.isModalOpen.set(true);
  }

  openEditModal(c: Condition) {
    this.editingCondition.set(c);
    this.condForm.patchValue({
      name: c.name,
      description: c.description,
      badgeColor: c.badgeColor
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingCondition.set(null);
  }

  saveCondition() {
    if (this.condForm.invalid) return;
    const val = this.condForm.value;
    const current = this.editingCondition();

    if (current) {
      this.adminStore.saveCondition({ ...val, id: current.id });
      this.notifications.success('Guardado', `Condición ${val.name} actualizada.`);
    } else {
      this.adminStore.saveCondition(val);
      this.notifications.success('Creado', `Condición ${val.name} creada.`);
    }
    this.closeModal();
  }

  async deleteCondition(c: Condition) {
    const ok = await this.notifications.confirm(
      '¿Eliminar condición?',
      `Se eliminará ${c.name}.`
    );
    if (ok) {
      this.adminStore.deleteCondition(c.id);
      this.notifications.success('Eliminado', 'Condición eliminada.');
    }
  }
}

