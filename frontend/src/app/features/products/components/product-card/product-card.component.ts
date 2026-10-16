import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/models/product.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer" [routerLink]="['/products', product.slug || product._id]">
      <div class="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-64">
        <img [src]="product.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=80'" [alt]="product.title" class="w-full h-full object-center object-cover sm:w-full sm:h-full">
      </div>
      <div class="flex-1 p-4 flex flex-col">
        <h3 class="text-sm font-medium text-gray-900 line-clamp-1">
          {{ product.title }}
        </h3>
        <p class="text-sm text-gray-500 line-clamp-1">{{ product.brand }}</p>
        <div class="mt-2 flex items-center justify-between">
          <p class="text-base font-bold text-gray-900">{{ product.price | currency:'EUR':'symbol' }}</p>
          <p class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ product.size }}</p>
        </div>
        <div class="mt-2">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-vinted-light/10 text-vinted">
            {{ product.condition }}
          </span>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
}