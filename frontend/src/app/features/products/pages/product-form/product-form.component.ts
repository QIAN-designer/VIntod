import { Component, OnInit, inject, Input, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductsStore } from '../../../../core/services/products.store';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ isEditMode() ? 'Editar prenda' : 'Vender nueva prenda' }}
        </h3>
        
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="mt-5 space-y-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Título</label>
            <input type="text" id="title" formControlName="title" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vinted focus:border-vinted sm:text-sm">
            @if (productForm.get('title')?.invalid && productForm.get('title')?.touched) {
              <p class="mt-2 text-sm text-red-600">El título es obligatorio y debe tener entre 3 y 50 caracteres.</p>
            }
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea id="description" formControlName="description" rows="4" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vinted focus:border-vinted sm:text-sm"></textarea>
            @if (productForm.get('description')?.invalid && productForm.get('description')?.touched) {
              <p class="mt-2 text-sm text-red-600">La descripción es obligatoria (mínimo 10 caracteres).</p>
            }
          </div>

          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700">Precio (€)</label>
              <input type="number" step="0.01" id="price" formControlName="price" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vinted focus:border-vinted sm:text-sm">
              @if (productForm.get('price')?.invalid && productForm.get('price')?.touched) {
                <p class="mt-2 text-sm text-red-600">Precio inválido (debe ser mayor a 0).</p>
              }
            </div>

            <div>
              <label for="brand" class="block text-sm font-medium text-gray-700">Marca</label>
              <input type="text" id="brand" formControlName="brand" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vinted focus:border-vinted sm:text-sm">
              @if (productForm.get('brand')?.invalid && productForm.get('brand')?.touched) {
                <p class="mt-2 text-sm text-red-600">La marca es obligatoria.</p>
              }
            </div>

            <div>
              <label for="size" class="block text-sm font-medium text-gray-700">Talla</label>
              <select id="size" formControlName="size" class="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vinted focus:border-vinted sm:text-sm">
                <option value="">Selecciona una talla</option>
                <option value="XXS">XXS</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
              @if (productForm.get('size')?.invalid && productForm.get('size')?.touched) {
                <p class="mt-2 text-sm text-red-600">Selecciona una talla.</p>
              }
            </div>

            <div>
              <label for="condition" class="block text-sm font-medium text-gray-700">Estado</label>
              <select id="condition" formControlName="condition" class="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-vinted focus:border-vinted sm:text-sm">
                <option value="">Selecciona el estado</option>
                <option value="Nuevo con etiquetas">Nuevo con etiquetas</option>
                <option value="Nuevo sin etiquetas">Nuevo sin etiquetas</option>
                <option value="Muy bueno">Muy bueno</option>
                <option value="Bueno">Bueno</option>
                <option value="Satisfactorio">Satisfactorio</option>
              </select>
              @if (productForm.get('condition')?.invalid && productForm.get('condition')?.touched) {
                <p class="mt-2 text-sm text-red-600">Selecciona el estado de la prenda.</p>
              }
            </div>
          </div>

          <div class="pt-5 flex justify-end gap-3">
            <button type="button" (click)="goBack()" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vinted">
              Cancelar
            </button>
            <button type="submit" [disabled]="productForm.invalid || isSubmitting()" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-vinted hover:bg-vinted-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vinted disabled:opacity-50">
              {{ isEditMode() ? 'Actualizar' : 'Publicar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  @Input() id?: string;
  
  fb = inject(FormBuilder);
  store = inject(ProductsStore);
  router = inject(Router);

  isEditMode = signal(false);
  isSubmitting = signal(false);

  productForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: ['', [Validators.required, Validators.min(0.01)]],
    brand: ['', [Validators.required]],
    size: ['', [Validators.required]],
    condition: ['', [Validators.required]]
  });

  ngOnInit() {
    if (this.id) {
      this.isEditMode.set(true);
      this.loadProductData();
    }
  }

  loadProductData() {
    // Si ya lo tenemos en el store y coincide, lo usamos. Si no, lo cargamos.
    const selected = this.store.selectedProduct();
    if (selected && selected._id === this.id) {
      this.productForm.patchValue(selected);
    } else {
      this.store.loadProduct(this.id!);
      // Esperaríamos a que se cargue... En un caso real usaríamos un effect o un observable, 
      // pero para simplificar aquí:
      setTimeout(() => {
        const prod = this.store.selectedProduct();
        if (prod) this.productForm.patchValue(prod);
      }, 500); // Polling simple
    }
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const productData = this.productForm.value;

    if (this.isEditMode()) {
      this.store.updateProductData(this.id!, productData).add(() => {
        this.isSubmitting.set(false);
        if (!this.store.error()) {
          Swal.fire('Actualizado', 'Prenda actualizada con éxito', 'success');
          this.router.navigate(['/products', this.id]);
        }
      });
    } else {
      this.store.addProduct(productData).add(() => {
        this.isSubmitting.set(false);
        if (!this.store.error()) {
          Swal.fire('Publicado', 'Prenda publicada con éxito', 'success');
          this.router.navigate(['/products']);
        }
      });
    }
  }

  goBack() {
    if (this.isEditMode()) {
      this.router.navigate(['/products', this.id]);
    } else {
      this.router.navigate(['/products']);
    }
  }
}