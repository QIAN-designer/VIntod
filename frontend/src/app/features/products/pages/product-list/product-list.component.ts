import { Component, OnInit, inject } from '@angular/core';
import { ProductsStore } from '../../../../core/services/products.store';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, EmptyStateComponent, ErrorStateComponent, NgxSkeletonLoaderModule],
  template: `
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Novedades</h1>
        <p class="mt-1 text-sm text-gray-500">Descubre las últimas prendas añadidas a Vintod.</p>
      </div>

      @if (store.error()) {
        <app-error-state [message]="store.error()!" (retry)="loadProducts()"></app-error-state>
      } @else if (store.loading() && !store.hasLoaded()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (i of [1,2,3,4,5,6,7,8]; track i) {
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <ngx-skeleton-loader count="1" appearance="line" [theme]="{ height: '200px', 'border-radius': '0.5rem' }"></ngx-skeleton-loader>
              <ngx-skeleton-loader count="1" appearance="line" [theme]="{ height: '20px', width: '80%', 'margin-top': '10px' }"></ngx-skeleton-loader>
              <ngx-skeleton-loader count="1" appearance="line" [theme]="{ height: '15px', width: '50%' }"></ngx-skeleton-loader>
            </div>
          }
        </div>
      } @else {
        @defer (when store.hasLoaded()) {
          @if (store.visibleProducts().length === 0) {
            <app-empty-state></app-empty-state>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (product of store.visibleProducts(); track product._id) {
                <app-product-card [product]="product"></app-product-card>
              }
            </div>
          }
        }
      }
    </div>
  `
})
export class ProductListComponent implements OnInit {
  store = inject(ProductsStore);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.store.loadProducts();
  }
}