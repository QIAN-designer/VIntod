import { Routes } from '@angular/router';

export const routes: Routes = [
  // Public Marketplace Layout
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/pages/product-list/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: 'products/new',
        loadComponent: () => import('./features/products/pages/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: 'products/:id',
        loadComponent: () => import('./features/products/pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
      },
      {
        path: 'products/:id/edit',
        loadComponent: () => import('./features/products/pages/product-form/product-form.component').then(m => m.ProductFormComponent)
      }
    ]
  },

  // Admin Dashboard Layout (Feature-based)
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      },
      {
        path: 'products',
        loadComponent: () => import('./features/admin/products/admin-products.component').then(m => m.AdminProductsComponent)
      },
      {
        path: 'recycle-bin',
        loadComponent: () => import('./features/admin/recycle-bin/recycle-bin.component').then(m => m.RecycleBinComponent)
      },
      {
        path: 'products/new',
        loadComponent: () => import('./features/products/pages/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/users/admin-users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'brands',
        loadComponent: () => import('./features/admin/brands/admin-brands.component').then(m => m.AdminBrandsComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/admin/categories/admin-categories.component').then(m => m.AdminCategoriesComponent)
      },
      {
        path: 'conditions',
        loadComponent: () => import('./features/admin/conditions/admin-conditions.component').then(m => m.AdminConditionsComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/admin/orders/admin-orders.component').then(m => m.AdminOrdersComponent)
      }
    ]
  },

  // Fallback Route
  {
    path: '**',
    loadComponent: () => import('./shared/components/empty-state/empty-state.component').then(m => m.EmptyStateComponent)
  }
];