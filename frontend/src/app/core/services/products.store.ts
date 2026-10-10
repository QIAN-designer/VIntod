import { Injectable, signal, computed, inject } from '@angular/core';
import { Product } from '../models/marketplace.model';
import { ApiService } from './api.service';

export interface ProductsState {
  products: Product[];
  deletedProducts: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  hasLoaded: boolean;
  searchFilter: string;
  brandFilter: string;
  categoryFilter: string;
  conditionFilter: string;
  statusFilter: 'all' | 'active' | 'inactive';
}

@Injectable({
  providedIn: 'root'
})
export class ProductsStore {
  private api = inject(ApiService);

  private state = signal<ProductsState>({
    products: [],
    deletedProducts: [],
    selectedProduct: null,
    loading: false,
    error: null,
    hasLoaded: false,
    searchFilter: '',
    brandFilter: '',
    categoryFilter: '',
    conditionFilter: '',
    statusFilter: 'all'
  });

  readonly products = computed(() => this.state().products);
  readonly visibleProducts = computed(() => this.state().products.filter(p => p.isActive !== false));
  readonly deletedProducts = computed(() => this.state().deletedProducts);
  readonly selectedProduct = computed(() => this.state().selectedProduct);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly hasLoaded = computed(() => this.state().hasLoaded);
  readonly searchFilter = computed(() => this.state().searchFilter);
  readonly brandFilter = computed(() => this.state().brandFilter);
  readonly categoryFilter = computed(() => this.state().categoryFilter);
  readonly conditionFilter = computed(() => this.state().conditionFilter);
  readonly statusFilter = computed(() => this.state().statusFilter);

  // Computeds for metrics and filtered lists
  readonly filteredProducts = computed(() => {
    const list = this.state().products;
    const search = this.state().searchFilter.toLowerCase().trim();
    const brand = this.state().brandFilter;
    const category = this.state().categoryFilter;
    const condition = this.state().conditionFilter;
    const status = this.state().statusFilter;

    return list.filter(p => {
      const matchesSearch = !search ||
        p.title.toLowerCase().includes(search) ||
        (p.description && p.description.toLowerCase().includes(search)) ||
        (p.brand && p.brand.toLowerCase().includes(search));

      const matchesBrand = !brand || p.brand.toLowerCase() === brand.toLowerCase();
      const matchesCategory = !category || (p.category && p.category.toLowerCase() === category.toLowerCase());
      const matchesCondition = !condition || p.condition.toLowerCase() === condition.toLowerCase();

      const isActive = p.isActive !== false;
      const matchesStatus =
        status === 'all' ||
        (status === 'active' && isActive) ||
        (status === 'inactive' && !isActive);

      return matchesSearch && matchesBrand && matchesCategory && matchesCondition && matchesStatus;
    });
  });

  readonly totalProductsCount = computed(() => this.state().products.length);
  readonly activeProductsCount = computed(() => this.state().products.filter(p => p.isActive !== false).length);
  readonly inactiveProductsCount = computed(() => this.state().products.filter(p => p.isActive === false).length);
  readonly totalCatalogValue = computed(() =>
    this.state().products.reduce((acc, p) => acc + (p.price || 0), 0)
  );

  setSearchFilter(term: string) {
    this.state.update(s => ({ ...s, searchFilter: term }));
  }

  setBrandFilter(brand: string) {
    this.state.update(s => ({ ...s, brandFilter: brand }));
  }

  setCategoryFilter(category: string) {
    this.state.update(s => ({ ...s, categoryFilter: category }));
  }

  setConditionFilter(condition: string) {
    this.state.update(s => ({ ...s, conditionFilter: condition }));
  }

  setStatusFilter(status: 'all' | 'active' | 'inactive') {
    this.state.update(s => ({ ...s, statusFilter: status }));
  }

  resetFilters() {
    this.state.update(s => ({
      ...s,
      searchFilter: '',
      brandFilter: '',
      categoryFilter: '',
      conditionFilter: '',
      statusFilter: 'all'
    }));
  }

  loadProducts(force = false) {
    if (this.state().hasLoaded && !force) return;

    this.state.update(s => ({ ...s, loading: true, error: null }));
    this.api.getProducts().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // Normalize _id or id
          const normalized = res.data.map(p => ({
            ...p,
            _id: p._id || p.id,
            isActive: p.isActive !== undefined ? p.isActive : true
          }));
          this.state.update(s => ({ ...s, products: normalized, loading: false, hasLoaded: true }));
        } else {
          this.state.update(s => ({ ...s, error: res.error || 'Error cargando productos', loading: false }));
        }
      },
      error: (err) => {
        this.state.update(s => ({ ...s, error: err.message, loading: false }));
      }
    });
  }

  loadProduct(idOrSlug: string) {
    this.state.update(s => ({ ...s, loading: true, error: null, selectedProduct: null }));

    const isMongoId = /^[a-fA-F0-9]{24}$/.test(idOrSlug);
    const req = isMongoId ? this.api.getProduct(idOrSlug) : this.api.getProductBySlug(idOrSlug);

    req.subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.state.update(s => ({ ...s, selectedProduct: res.data!, loading: false }));
        } else {
          this.state.update(s => ({ ...s, error: res.error || 'Error cargando producto', loading: false }));
        }
      },
      error: (err) => {
        this.state.update(s => ({ ...s, error: err.message, loading: false }));
      }
    });
  }

  addProduct(product: Partial<Product>) {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    return this.api.createProduct(product).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const newProduct = { ...res.data, _id: res.data._id || res.data.id };
          this.state.update(s => ({
            ...s,
            products: [newProduct, ...s.products],
            loading: false
          }));
        }
      },
      error: (err) => {
        this.state.update(s => ({ ...s, error: err.message, loading: false }));
      }
    });
  }

  updateProductData(id: string, product: Partial<Product>) {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    return this.api.updateProduct(id, product).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const updated = { ...res.data, _id: res.data._id || res.data.id || id };
          this.state.update(s => ({
            ...s,
            products: s.products.map(p => (p._id === id || p.id === id) ? updated : p),
            selectedProduct: (s.selectedProduct?._id === id || s.selectedProduct?.id === id) ? updated : s.selectedProduct,
            loading: false
          }));
        }
      },
      error: (err) => {
        this.state.update(s => ({ ...s, error: err.message, loading: false }));
      }
    });
  }

  toggleProductActive(id: string) {
    const current = this.state().products.find(p => p._id === id || p.id === id);
    if (!current) return;

    const newActiveState = !(current.isActive !== false);

    // Optimistic Signal Update for snappy UI
    this.state.update(s => ({
      ...s,
      products: s.products.map(p =>
        (p._id === id || p.id === id) ? { ...p, isActive: newActiveState } : p
      )
    }));

    const action = newActiveState ? this.api.activateProduct(id) : this.api.deactivateProduct(id);
    action.subscribe({
      next: (res) => {
        if (!res.success) {
          // Revert optimistic update
          this.state.update(s => ({
            ...s,
            products: s.products.map(p =>
              (p._id === id || p.id === id) ? { ...p, isActive: !newActiveState } : p
            )
          }));
        }
      },
      error: () => {
        // Revert on error
        this.state.update(s => ({
          ...s,
          products: s.products.map(p =>
            (p._id === id || p.id === id) ? { ...p, isActive: !newActiveState } : p
          )
        }));
      }
    });
  }

  deleteProductData(id: string) {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    return this.api.deleteProduct(id).subscribe({
      next: (res) => {
        if (res.success) {
          const deletedItem = this.state().products.find(p => p._id === id || p.id === id);
          this.state.update(s => ({
            ...s,
            products: s.products.filter(p => p._id !== id && p.id !== id),
            deletedProducts: deletedItem
              ? [{ ...deletedItem, deletedAt: new Date().toISOString() }, ...s.deletedProducts]
              : s.deletedProducts,
            selectedProduct: (s.selectedProduct?._id === id || s.selectedProduct?.id === id) ? null : s.selectedProduct,
            loading: false
          }));
        }
      },
      error: (err) => {
        this.state.update(s => ({ ...s, error: err.message, loading: false }));
      }
    });
  }

  loadDeletedProducts() {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    return this.api.getDeletedProducts().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const normalized = res.data.map(p => ({
            ...p,
            _id: p._id || p.id
          }));
          this.state.update(s => ({ ...s, deletedProducts: normalized, loading: false }));
        } else {
          this.state.update(s => ({ ...s, error: res.error || 'Error cargando artículos eliminados', loading: false }));
        }
      },
      error: (err) => {
        this.state.update(s => ({ ...s, error: err.message, loading: false }));
      }
    });
  }

  restoreProductData(id: string) {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    return this.api.restoreProduct(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const restoredItem = { ...res.data, _id: res.data._id || res.data.id || id, deletedAt: null };
          this.state.update(s => ({
            ...s,
            products: [restoredItem, ...s.products],
            deletedProducts: s.deletedProducts.filter(p => p._id !== id && p.id !== id),
            loading: false
          }));
        }
      },
      error: (err) => {
        this.state.update(s => ({ ...s, error: err.message, loading: false }));
      }
    });
  }
}