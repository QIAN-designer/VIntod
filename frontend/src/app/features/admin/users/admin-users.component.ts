import { Component, AfterViewInit, ViewChild, TemplateRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminStore } from '../../../core/services/admin.store';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models/marketplace.model';
import { TableComponent, TableColumn } from '../../../shared/components/table/table.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AppDatePipe } from '../../../shared/pipes/date.pipe';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TableComponent,
    BadgeComponent,
    SearchBarComponent,
    ModalComponent,
    AppDatePipe
  ],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Usuarios & Vendedores</h1>
          <p class="text-sm text-slate-500 mt-1">
            Gestión de permisos, roles, moderación de perfiles y actividad de la comunidad.
          </p>
        </div>
        <button
          type="button"
          (click)="openCreateModal()"
          class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-all"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>Añadir Usuario</span>
        </button>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="w-full sm:w-96">
          <app-search-bar
            placeholder="Buscar por nombre, correo o ciudad..."
            [searchTerm]="searchQuery()"
            (searchChange)="searchQuery.set($event)"
          ></app-search-bar>
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <select
            [value]="roleFilter()"
            (change)="onRoleChange($event)"
            class="py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">Todos los roles</option>
            <option value="user">Usuario / Vendedor</option>
            <option value="moderator">Moderador</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>

      <!-- Users Table -->
      <app-table
        [columns]="columns"
        [data]="filteredUsers()"
        emptyMessage="No se encontraron usuarios"
        [hasActions]="true"
        [actionsTemplate]="actionsTemplate"
      >
      </app-table>

      <!-- Cell Templates -->
      <ng-template #userTpl let-u="row">
        <div class="flex items-center gap-3">
          <img [src]="u.avatar" alt="Avatar" class="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200" />
          <div>
            <div class="font-semibold text-slate-900">{{ u.name }}</div>
            <div class="text-xs text-slate-400">{{ u.email }}</div>
          </div>
        </div>
      </ng-template>

      <ng-template #roleTpl let-u="row">
        <app-badge [color]="getRoleColor(u.role)">
          {{ u.role }}
        </app-badge>
      </ng-template>

      <ng-template #statusTpl let-u="row">
        <app-badge [color]="u.isActive ? 'emerald' : 'gray'" [dot]="true">
          {{ u.isActive ? 'Activo' : 'Suspendido' }}
        </app-badge>
      </ng-template>

      <ng-template #activityTpl let-u="row">
        <div class="text-xs text-slate-600">
          <span class="font-semibold text-slate-800">{{ u.productsCount }}</span> prendas • 
          <span class="font-semibold text-slate-800">{{ u.salesCount }}</span> ventas
        </div>
      </ng-template>

      <ng-template #actionsTemplate let-u="row">
        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            (click)="toggleActive(u)"
            [title]="u.isActive ? 'Suspender cuenta' : 'Reactivar cuenta'"
            class="p-1.5 rounded-lg border text-xs font-medium transition-colors"
            [class]="u.isActive ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100' : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'"
          >
            {{ u.isActive ? 'Suspender' : 'Activar' }}
          </button>
          <button
            type="button"
            (click)="openEditModal(u)"
            title="Editar usuario"
            class="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-teal-700 hover:border-teal-300 bg-white hover:bg-slate-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            type="button"
            (click)="deleteUser(u)"
            title="Eliminar usuario"
            class="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </ng-template>

      <!-- Modal Create / Edit User -->
      <app-modal
        [isOpen]="isModalOpen()"
        [title]="editingUser() ? 'Editar Perfil de Usuario' : 'Registrar Nuevo Usuario'"
        [showFooter]="false"
        (closed)="closeModal()"
      >
        <form [formGroup]="userForm" (ngSubmit)="saveUser()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase">Nombre completo</label>
            <input
              type="text"
              formControlName="name"
              placeholder="Ej: Laura Gómez"
              class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase">Correo electrónico</label>
            <input
              type="email"
              formControlName="email"
              placeholder="laura@ejemplo.com"
              class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase">Rol</label>
              <select
                formControlName="role"
                class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="user">Usuario estándar</option>
                <option value="moderator">Moderador de contenido</option>
                <option value="admin">Administrador global</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase">Ciudad</label>
              <input
                type="text"
                formControlName="city"
                placeholder="Madrid"
                class="mt-1 block w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
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
              [disabled]="userForm.invalid"
              class="px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm disabled:opacity-50 transition-all"
            >
              {{ editingUser() ? 'Guardar Cambios' : 'Registrar' }}
            </button>
          </div>
        </form>
      </app-modal>
    </div>
  `
})
export class AdminUsersComponent implements AfterViewInit {
  adminStore = inject(AdminStore);
  notifications = inject(NotificationService);
  fb = inject(FormBuilder);

  @ViewChild('userTpl') userTpl!: TemplateRef<any>;
  @ViewChild('roleTpl') roleTpl!: TemplateRef<any>;
  @ViewChild('statusTpl') statusTpl!: TemplateRef<any>;
  @ViewChild('activityTpl') activityTpl!: TemplateRef<any>;

  searchQuery = signal('');
  roleFilter = signal<'all' | 'user' | 'moderator' | 'admin'>('all');
  isModalOpen = signal(false);
  editingUser = signal<User | null>(null);

  columns: TableColumn[] = [];

  ngAfterViewInit() {
    this.columns = [
      { key: 'name', label: 'Usuario', cellTemplate: this.userTpl },
      { key: 'role', label: 'Rol', align: 'center', cellTemplate: this.roleTpl },
      { key: 'city', label: 'Ciudad' },
      { key: 'productsCount', label: 'Actividad', cellTemplate: this.activityTpl },
      { key: 'isActive', label: 'Estado', align: 'center', cellTemplate: this.statusTpl },
      { key: 'createdAt', label: 'Registro' }
    ];
  }

  userForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['user', [Validators.required]],
    city: ['Madrid']
  });

  filteredUsers() {
    const list = this.adminStore.users();
    const q = this.searchQuery().toLowerCase().trim();
    const role = this.roleFilter();

    return list.filter(u => {
      const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.city && u.city.toLowerCase().includes(q));
      const matchRole = role === 'all' || u.role === role;
      return matchQ && matchRole;
    });
  }

  onRoleChange(e: Event) {
    this.roleFilter.set((e.target as HTMLSelectElement).value as any);
  }

  getRoleColor(role: string): any {
    switch (role) {
      case 'admin': return 'danger';
      case 'moderator': return 'teal';
      default: return 'gray';
    }
  }

  toggleActive(u: User) {
    this.adminStore.toggleUserActive(u.id);
    this.notifications.info('Estado actualizado', `El estado de ${u.name} se ha modificado.`);
  }

  openCreateModal() {
    this.editingUser.set(null);
    this.userForm.reset({ name: '', email: '', role: 'user', city: 'Madrid' });
    this.isModalOpen.set(true);
  }

  openEditModal(u: User) {
    this.editingUser.set(u);
    this.userForm.patchValue({
      name: u.name,
      email: u.email,
      role: u.role,
      city: u.city || 'Madrid'
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingUser.set(null);
  }

  saveUser() {
    if (this.userForm.invalid) return;
    const val = this.userForm.value;
    const current = this.editingUser();

    if (current) {
      this.adminStore.saveUser({ ...val, id: current.id });
      this.notifications.success('Usuario actualizado', `Los datos de ${val.name} han sido guardados.`);
    } else {
      this.adminStore.saveUser(val);
      this.notifications.success('Usuario creado', `El usuario ${val.name} se ha registrado.`);
    }
    this.closeModal();
  }

  async deleteUser(u: User) {
    const ok = await this.notifications.confirm(
      '¿Eliminar usuario?',
      `Se eliminará el perfil de ${u.name} permanentemente.`
    );
    if (ok) {
      this.adminStore.deleteUser(u.id);
      this.notifications.success('Usuario eliminado', 'El usuario ha sido retirado.');
    }
  }
}

