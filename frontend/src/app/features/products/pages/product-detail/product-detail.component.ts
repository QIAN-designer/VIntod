import { Component, OnInit, inject, Input } from '@angular/core';
import { ProductsStore } from '../../../../core/services/products.store';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink, ErrorStateComponent],
  template: `
    @if (store.error()) {
      <app-error-state [message]="store.error()!" (retry)="loadProduct()"></app-error-state>
    } @else if (store.selectedProduct()) {
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="md:flex">
          <div class="md:flex-shrink-0 md:w-1/2 bg-gray-100 flex items-center justify-center">
             <img [src]="store.selectedProduct()!.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80'" [alt]="store.selectedProduct()!.title" class="w-full h-full object-center object-cover">
          </div>
          <div class="p-8 md:w-1/2 flex flex-col">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  {{ store.selectedProduct()!.title }}
                </h2>
                <p class="mt-2 text-xl text-gray-500">{{ store.selectedProduct()!.brand }}</p>
              </div>
              <p class="text-3xl font-bold text-gray-900">{{ store.selectedProduct()!.price | currency:'EUR':'symbol' }}</p>
            </div>

            <div class="mt-6 border-t border-gray-200 pt-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Talla</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ store.selectedProduct()!.size }}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Estado</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ store.selectedProduct()!.condition }}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Descripción</dt>
                  <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{{ store.selectedProduct()!.description }}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Publicado</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ store.selectedProduct()!.createdAt | date:'medium' }}</dd>
                </div>
              </dl>
            </div>

            <div class="mt-auto pt-8 flex gap-4">
              <button class="flex-1 bg-vinted border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-vinted-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vinted">
                Comprar
              </button>
              <button [routerLink]="['/products', store.selectedProduct()!._id, 'edit']" class="bg-white border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vinted">
                Editar
              </button>
              <button (click)="deleteProduct()" class="bg-white border border-red-300 rounded-md shadow-sm py-3 px-4 text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ProductDetailComponent implements OnInit {
  @Input() id!: string;
  store = inject(ProductsStore);
  router = inject(Router);

  ngOnInit() {
    this.loadProduct();
  }

  loadProduct() {
    if (this.id) {
      this.store.loadProduct(this.id);
    }
  }

  deleteProduct() {
    const product = this.store.selectedProduct();
    if (!product || !product._id) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.deleteProductData(product._id!).add(() => {
          Swal.fire('Eliminado!', 'La prenda ha sido eliminada.', 'success');
          this.router.navigate(['/products']);
        });
      }
    });
  }
}