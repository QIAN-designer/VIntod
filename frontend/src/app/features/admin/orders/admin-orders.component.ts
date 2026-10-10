import { Component, AfterViewInit, ViewChild, TemplateRef, inject, signal } from '@angular/core';
import { AdminStore } from '../../../core/services/admin.store';
import { NotificationService } from '../../../core/services/notification.service';
import { Order } from '../../../core/models/marketplace.model';
import { TableComponent, TableColumn } from '../../../shared/components/table/table.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AppCurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { AppDatePipe } from '../../../shared/pipes/date.pipe';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    TableComponent,
    BadgeComponent,
    SearchBarComponent,
    ModalComponent,
    AppCurrencyPipe,
    AppDatePipe
  ],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Pedidos & Transacciones</h1>
          <p class="text-sm text-slate-500 mt-1">
            Supervisión, auditoría y moderación de transacciones entre particulares de la plataforma.
          </p>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="w-full sm:w-96">
          <app-search-bar
            placeholder="Buscar por nº de pedido, comprador o vendedor..."
            [searchTerm]="searchQuery()"
            (searchChange)="searchQuery.set($event)"
          ></app-search-bar>
        </div>
        <div class="flex items-center gap-2">
          <select
            [value]="statusFilter()"
            (change)="onStatusChange($event)"
            class="py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente de pago</option>
            <option value="paid">Pagado</option>
            <option value="shipped">En envío</option>
            <option value="delivered">Entregado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <app-table
        [columns]="columns"
        [data]="filteredOrders()"
        emptyMessage="No se encontraron transacciones"
        [hasActions]="true"
        [actionsTemplate]="actionsTemplate"
      >
      </app-table>

      <!-- Cell Templates -->
      <ng-template #orderNumTpl let-o="row">
        <div>
          <span class="font-mono font-bold text-teal-700">{{ o.orderNumber }}</span>
          <div class="text-[11px] text-slate-400">{{ o.paymentMethod }}</div>
        </div>
      </ng-template>

      <ng-template #partiesTpl let-o="row">
        <div class="text-xs">
          <div class="text-slate-900"><span class="text-slate-400">Comprador:</span> {{ o.buyerName }}</div>
          <div class="text-slate-600"><span class="text-slate-400">Vendedor:</span> {{ o.sellerName }}</div>
        </div>
      </ng-template>

      <ng-template #amountTpl let-o="row">
        <div>
          <span class="font-bold text-slate-900">{{ o.totalAmount | appCurrency }}</span>
          <div class="text-[10px] text-slate-400">incl. envío {{ o.shippingFee | appCurrency }}</div>
        </div>
      </ng-template>

      <ng-template #statusTpl let-o="row">
        <app-badge [color]="getStatusColor(o.status)">
          {{ o.status }}
        </app-badge>
      </ng-template>

      <ng-template #auditTpl let-o="row">
        <app-badge [color]="o.isActive ? 'emerald' : 'warning'" [dot]="true">
          {{ o.isActive ? 'Aprobada' : 'En Auditoría' }}
        </app-badge>
      </ng-template>

      <ng-template #actionsTemplate let-o="row">
        <div class="flex items-center justify-end gap-2">
          <!-- Toggle Audit / Hold -->
          <button
            type="button"
            (click)="toggleAudit(o)"
            [title]="o.isActive ? 'Poner en retención / auditar' : 'Liberar transacción'"
            class="p-1.5 rounded-lg border text-xs font-medium transition-colors"
            [class]="o.isActive ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100' : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'"
          >
            {{ o.isActive ? 'Retener' : 'Aprobar' }}
          </button>
          
          <!-- View details button -->
          <button
            type="button"
            (click)="openDetail(o)"
            title="Ver detalle del pedido"
            class="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-teal-700 hover:border-teal-300 bg-white hover:bg-slate-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </ng-template>

      <!-- Modal Detail Order -->
      <app-modal
        [isOpen]="isModalOpen()"
        title="Auditoría de Pedido"
        [showFooter]="true"
        (closed)="isModalOpen.set(false)"
      >
        @if (selectedOrder()) {
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span class="text-xs uppercase font-semibold text-slate-400">Referencia</span>
                <p class="font-mono font-bold text-base text-slate-900">{{ selectedOrder()!.orderNumber }}</p>
              </div>
              <app-badge [color]="getStatusColor(selectedOrder()!.status)">
                {{ selectedOrder()!.status }}
              </app-badge>
            </div>

            <div class="grid grid-cols-2 gap-4 text-xs">
              <div class="p-3 bg-slate-50 rounded-lg">
                <span class="text-slate-400 uppercase font-semibold">Comprador</span>
                <p class="font-bold text-slate-900 mt-1">{{ selectedOrder()!.buyerName }}</p>
                <p class="text-slate-500">{{ selectedOrder()!.buyerEmail }}</p>
              </div>
              <div class="p-3 bg-slate-50 rounded-lg">
                <span class="text-slate-400 uppercase font-semibold">Vendedor</span>
                <p class="font-bold text-slate-900 mt-1">{{ selectedOrder()!.sellerName }}</p>
                <p class="text-slate-500">ID: {{ selectedOrder()!.sellerId }}</p>
              </div>
            </div>

            <div>
              <span class="text-xs font-semibold text-slate-700 uppercase">Prendas incluidas:</span>
              <div class="mt-2 space-y-2">
                @for (item of selectedOrder()!.items; track item.productId) {
                  <div class="flex items-center justify-between p-2 rounded-lg border border-slate-100 text-sm">
                    <div>
                      <span class="font-semibold text-slate-900">{{ item.title }}</span>
                      <span class="text-xs text-slate-400 ml-2">({{ item.brand }})</span>
                    </div>
                    <span class="font-bold text-slate-900">{{ item.price | appCurrency }}</span>
                  </div>
                }
              </div>
            </div>

            <div class="flex justify-between items-center pt-3 border-t border-slate-100 text-sm font-bold text-slate-900">
              <span>Importe total procesado:</span>
              <span>{{ selectedOrder()!.totalAmount | appCurrency }}</span>
            </div>
          </div>
        }

        <div footer class="flex justify-between w-full">
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500">Cambiar estado:</span>
            <select
              #statusSelect
              [value]="selectedOrder()?.status"
              (change)="changeStatus(statusSelect.value)"
              class="text-xs py-1 px-2 border border-slate-300 rounded"
            >
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="shipped">shipped</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
          <button
            type="button"
            (click)="isModalOpen.set(false)"
            class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>
      </app-modal>
    </div>
  `
})
export class AdminOrdersComponent implements AfterViewInit {
  adminStore = inject(AdminStore);
  notifications = inject(NotificationService);

  @ViewChild('orderNumTpl') orderNumTpl!: TemplateRef<any>;
  @ViewChild('partiesTpl') partiesTpl!: TemplateRef<any>;
  @ViewChild('amountTpl') amountTpl!: TemplateRef<any>;
  @ViewChild('statusTpl') statusTpl!: TemplateRef<any>;
  @ViewChild('auditTpl') auditTpl!: TemplateRef<any>;

  searchQuery = signal('');
  statusFilter = signal<string>('all');
  isModalOpen = signal(false);
  selectedOrder = signal<Order | null>(null);

  columns: TableColumn[] = [];

  ngAfterViewInit() {
    this.columns = [
      { key: 'orderNumber', label: 'Pedido', cellTemplate: this.orderNumTpl },
      { key: 'buyerName', label: 'Partes (Comprador / Vendedor)', cellTemplate: this.partiesTpl },
      { key: 'totalAmount', label: 'Total', cellTemplate: this.amountTpl },
      { key: 'status', label: 'Estado Pedido', align: 'center', cellTemplate: this.statusTpl },
      { key: 'isActive', label: 'Auditoría', align: 'center', cellTemplate: this.auditTpl },
      { key: 'createdAt', label: 'Fecha' }
    ];
  }

  filteredOrders() {
    const list = this.adminStore.orders();
    const q = this.searchQuery().toLowerCase().trim();
    const sf = this.statusFilter();

    return list.filter(o => {
      const matchQ = !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.buyerName.toLowerCase().includes(q) ||
        o.sellerName.toLowerCase().includes(q);

      const matchS = sf === 'all' || o.status === sf;
      return matchQ && matchS;
    });
  }

  onStatusChange(e: Event) {
    this.statusFilter.set((e.target as HTMLSelectElement).value);
  }

  getStatusColor(status: string): any {
    switch (status) {
      case 'delivered': return 'emerald';
      case 'shipped': return 'blue';
      case 'paid': return 'teal';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'gray';
    }
  }

  toggleAudit(o: Order) {
    this.adminStore.toggleOrderActive(o.id);
    this.notifications.info('Auditoría', `Estado de moderación de ${o.orderNumber} actualizado.`);
  }

  openDetail(o: Order) {
    this.selectedOrder.set(o);
    this.isModalOpen.set(true);
  }

  changeStatus(newStatus: string) {
    const current = this.selectedOrder();
    if (!current) return;
    this.adminStore.updateOrderStatus(current.id, newStatus as any);
    this.selectedOrder.set({ ...current, status: newStatus as any });
    this.notifications.success('Estado actualizado', `Pedido ${current.orderNumber} pasó a ${newStatus}.`);
  }
}

