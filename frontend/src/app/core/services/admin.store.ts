import { Injectable, signal, computed } from '@angular/core';
import { User, Brand, Category, Condition, Order, DashboardStats } from '../models/marketplace.model';

@Injectable({
  providedIn: 'root'
})
export class AdminStore {
  // Users state
  private usersSignal = signal<User[]>([
    {
      id: 'usr_001',
      name: 'Elena Morales',
      email: 'elena.morales@example.com',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      isActive: true,
      city: 'Madrid',
      productsCount: 14,
      salesCount: 8,
      rating: 4.9,
      createdAt: '2025-03-12'
    },
    {
      id: 'usr_002',
      name: 'Carlos Ruiz',
      email: 'carlos.vintage@example.com',
      role: 'moderator',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      isActive: true,
      city: 'Barcelona',
      productsCount: 32,
      salesCount: 25,
      rating: 5.0,
      createdAt: '2025-01-20'
    },
    {
      id: 'usr_003',
      name: 'Sara Benítez',
      email: 'sara.fashion@example.com',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
      isActive: false,
      city: 'Valencia',
      productsCount: 6,
      salesCount: 1,
      rating: 3.8,
      createdAt: '2025-06-15'
    },
    {
      id: 'usr_004',
      name: 'Marcos Gil',
      email: 'marcos.streetwear@example.com',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      isActive: true,
      city: 'Sevilla',
      productsCount: 19,
      salesCount: 12,
      rating: 4.8,
      createdAt: '2025-04-05'
    },
    {
      id: 'usr_005',
      name: 'Admin Vintod',
      email: 'admin@vintod.local',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      isActive: true,
      city: 'Bilbao',
      productsCount: 0,
      salesCount: 0,
      rating: 5.0,
      createdAt: '2024-11-01'
    }
  ]);

  // Brands state
  private brandsSignal = signal<Brand[]>([
    {
      id: 'brd_001',
      name: "Levi's",
      slug: 'levis',
      description: 'Icónica marca estadounidense de prendas denim y vaqueros desde 1853.',
      logo: '👖',
      isActive: true,
      itemCount: 48,
      featured: true,
      createdAt: '2025-01-01'
    },
    {
      id: 'brd_002',
      name: 'Nike',
      slug: 'nike',
      description: 'Líder mundial en ropa deportiva, calzado y estética streetwear.',
      logo: '✔️',
      isActive: true,
      itemCount: 65,
      featured: true,
      createdAt: '2025-01-01'
    },
    {
      id: 'brd_003',
      name: 'Zara',
      slug: 'zara',
      description: 'Moda rápida de tendencia internacional perteneciente al grupo Inditex.',
      logo: '👗',
      isActive: true,
      itemCount: 82,
      featured: false,
      createdAt: '2025-01-10'
    },
    {
      id: 'brd_004',
      name: 'Adidas',
      slug: 'adidas',
      description: 'Referente alemán de ropa deportiva clásica con las icónicas tres bandas.',
      logo: '👟',
      isActive: true,
      itemCount: 41,
      featured: true,
      createdAt: '2025-01-12'
    },
    {
      id: 'brd_005',
      name: 'Vans',
      slug: 'vans',
      description: 'Zapatillas y ropa informal inspiradas en la cultura skateboard y callejera.',
      logo: '🛹',
      isActive: true,
      itemCount: 29,
      featured: false,
      createdAt: '2025-02-01'
    },
    {
      id: 'brd_006',
      name: 'Vintage Collection',
      slug: 'vintage-collection',
      description: 'Piezas únicas y prendas retro de los años 70, 80 y 90 sin marca específica.',
      logo: '📻',
      isActive: true,
      itemCount: 54,
      featured: true,
      createdAt: '2025-02-10'
    }
  ]);

  // Categories state
  private categoriesSignal = signal<Category[]>([
    { id: 'cat_001', name: 'Mujer', slug: 'mujer', icon: '👠', itemCount: 142, isActive: true, parent: null, createdAt: '2025-01-01' },
    { id: 'cat_002', name: 'Hombre', slug: 'hombre', icon: '👔', itemCount: 98, isActive: true, parent: null, createdAt: '2025-01-01' },
    { id: 'cat_003', name: 'Niños', slug: 'ninos', icon: '🧸', itemCount: 37, isActive: true, parent: null, createdAt: '2025-01-05' },
    { id: 'cat_004', name: 'Calzado', slug: 'calzado', icon: '👟', itemCount: 64, isActive: true, parent: null, createdAt: '2025-01-05' },
    { id: 'cat_005', name: 'Accesorios', slug: 'accesorios', icon: '🎒', itemCount: 53, isActive: true, parent: null, createdAt: '2025-01-08' },
    { id: 'cat_006', name: 'Vintage Especial', slug: 'vintage-especial', icon: '✨', itemCount: 28, isActive: false, parent: null, createdAt: '2025-02-15' }
  ]);

  // Conditions state
  private conditionsSignal = signal<Condition[]>([
    {
      id: 'cnd_001',
      name: 'Nuevo con etiquetas',
      slug: 'nuevo-con-etiquetas',
      description: 'Artículo nuevo sin estrenar, conservando sus etiquetas o embalaje original intacto.',
      badgeColor: 'emerald',
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: 'cnd_002',
      name: 'Nuevo sin etiquetas',
      slug: 'nuevo-sin-etiquetas',
      description: 'Artículo a estrenar pero sin las etiquetas originales de venta.',
      badgeColor: 'teal',
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: 'cnd_003',
      name: 'Muy bueno',
      slug: 'muy-bueno',
      description: 'Prenda apenas usada con mínimos signos de uso apenas perceptibles.',
      badgeColor: 'cyan',
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: 'cnd_004',
      name: 'Bueno',
      slug: 'bueno',
      description: 'Usado con frecuencia moderada pero bien conservado, sin roturas ni manchas severas.',
      badgeColor: 'blue',
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: 'cnd_005',
      name: 'Satisfactorio',
      slug: 'satisfactorio',
      description: 'Presenta desgaste evidente o pequeños desperfectos detallados en las fotos.',
      badgeColor: 'amber',
      isActive: true,
      createdAt: '2025-01-01'
    }
  ]);

  // Orders / Transactions state
  private ordersSignal = signal<Order[]>([
    {
      id: 'ord_1001',
      orderNumber: 'VT-2026-9812',
      buyerId: 'usr_001',
      buyerName: 'Elena Morales',
      buyerEmail: 'elena.morales@example.com',
      sellerId: 'usr_002',
      sellerName: 'Carlos Ruiz',
      items: [
        { productId: 'p1', title: 'Sudadera con capucha vintage', price: 24.99, brand: 'Nike' }
      ],
      totalAmount: 28.49,
      shippingFee: 3.50,
      status: 'delivered',
      isActive: true,
      createdAt: '2026-03-28T14:20:00Z',
      paymentMethod: 'Tarjeta de crédito (Stripe)'
    },
    {
      id: 'ord_1002',
      orderNumber: 'VT-2026-9813',
      buyerId: 'usr_003',
      buyerName: 'Sara Benítez',
      buyerEmail: 'sara.fashion@example.com',
      sellerId: 'usr_004',
      sellerName: 'Marcos Gil',
      items: [
        { productId: 'p2', title: 'Pantalones vaqueros 501', price: 38.00, brand: "Levi's" }
      ],
      totalAmount: 41.50,
      shippingFee: 3.50,
      status: 'shipped',
      isActive: true,
      createdAt: '2026-04-01T09:12:00Z',
      paymentMethod: 'PayPal'
    },
    {
      id: 'ord_1003',
      orderNumber: 'VT-2026-9814',
      buyerId: 'usr_004',
      buyerName: 'Marcos Gil',
      buyerEmail: 'marcos.streetwear@example.com',
      sellerId: 'usr_001',
      sellerName: 'Elena Morales',
      items: [
        { productId: 'p3', title: 'Zapatillas deportivas retro', price: 45.50, brand: 'Adidas' }
      ],
      totalAmount: 49.00,
      shippingFee: 3.50,
      status: 'paid',
      isActive: true,
      createdAt: '2026-04-02T18:45:00Z',
      paymentMethod: 'Apple Pay'
    },
    {
      id: 'ord_1004',
      orderNumber: 'VT-2026-9815',
      buyerId: 'usr_001',
      buyerName: 'Elena Morales',
      buyerEmail: 'elena.morales@example.com',
      sellerId: 'usr_004',
      sellerName: 'Marcos Gil',
      items: [
        { productId: 'p4', title: 'Cazadora vaquera borreguillo', price: 55.00, brand: 'Zara' }
      ],
      totalAmount: 58.50,
      shippingFee: 3.50,
      status: 'pending',
      isActive: false, // En auditoría de seguridad
      createdAt: '2026-04-03T11:05:00Z',
      paymentMethod: 'Bizum'
    }
  ]);

  // Read-only signals
  readonly users = this.usersSignal.asReadonly();
  readonly brands = this.brandsSignal.asReadonly();
  readonly categories = this.categoriesSignal.asReadonly();
  readonly conditions = this.conditionsSignal.asReadonly();
  readonly orders = this.ordersSignal.asReadonly();

  // Computeds
  readonly activeUsersCount = computed(() => this.usersSignal().filter(u => u.isActive).length);
  readonly activeBrandsCount = computed(() => this.brandsSignal().filter(b => b.isActive).length);
  readonly activeCategoriesCount = computed(() => this.categoriesSignal().filter(c => c.isActive).length);
  readonly activeConditionsCount = computed(() => this.conditionsSignal().filter(c => c.isActive).length);
  readonly totalOrdersVolume = computed(() =>
    this.ordersSignal().reduce((acc, order) => acc + (order.isActive ? order.totalAmount : 0), 0)
  );

  // User Actions
  toggleUserActive(id: string) {
    this.usersSignal.update(users =>
      users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u)
    );
  }

  saveUser(user: Partial<User> & { name: string; email: string }) {
    if (user.id) {
      this.usersSignal.update(users =>
        users.map(u => u.id === user.id ? { ...u, ...user } as User : u)
      );
    } else {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        isActive: user.isActive ?? true,
        city: user.city || 'Madrid',
        productsCount: 0,
        salesCount: 0,
        rating: 5.0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      this.usersSignal.update(users => [newUser, ...users]);
    }
  }

  deleteUser(id: string) {
    this.usersSignal.update(users => users.filter(u => u.id !== id));
  }

  // Brand Actions
  toggleBrandActive(id: string) {
    this.brandsSignal.update(brands =>
      brands.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b)
    );
  }

  saveBrand(brand: Partial<Brand> & { name: string }) {
    if (brand.id) {
      this.brandsSignal.update(brands =>
        brands.map(b => b.id === brand.id ? { ...b, ...brand } as Brand : b)
      );
    } else {
      const newBrand: Brand = {
        id: `brd_${Date.now()}`,
        name: brand.name,
        slug: brand.name.toLowerCase().trim().replace(/[\s\W-]+/g, '-'),
        description: brand.description || '',
        logo: brand.logo || '🏷️',
        isActive: brand.isActive ?? true,
        itemCount: 0,
        featured: brand.featured ?? false,
        createdAt: new Date().toISOString().split('T')[0]
      };
      this.brandsSignal.update(brands => [newBrand, ...brands]);
    }
  }

  deleteBrand(id: string) {
    this.brandsSignal.update(brands => brands.filter(b => b.id !== id));
  }

  // Category Actions
  toggleCategoryActive(id: string) {
    this.categoriesSignal.update(cats =>
      cats.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c)
    );
  }

  saveCategory(cat: Partial<Category> & { name: string }) {
    if (cat.id) {
      this.categoriesSignal.update(cats =>
        cats.map(c => c.id === cat.id ? { ...c, ...cat } as Category : c)
      );
    } else {
      const newCategory: Category = {
        id: `cat_${Date.now()}`,
        name: cat.name,
        slug: cat.name.toLowerCase().trim().replace(/[\s\W-]+/g, '-'),
        icon: cat.icon || '🛍️',
        itemCount: 0,
        isActive: cat.isActive ?? true,
        parent: cat.parent || null,
        createdAt: new Date().toISOString().split('T')[0]
      };
      this.categoriesSignal.update(cats => [newCategory, ...cats]);
    }
  }

  deleteCategory(id: string) {
    this.categoriesSignal.update(cats => cats.filter(c => c.id !== id));
  }

  // Condition Actions
  toggleConditionActive(id: string) {
    this.conditionsSignal.update(conds =>
      conds.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c)
    );
  }

  saveCondition(condition: Partial<Condition> & { name: string }) {
    if (condition.id) {
      this.conditionsSignal.update(conds =>
        conds.map(c => c.id === condition.id ? { ...c, ...condition } as Condition : c)
      );
    } else {
      const newCond: Condition = {
        id: `cnd_${Date.now()}`,
        name: condition.name,
        slug: condition.name.toLowerCase().trim().replace(/[\s\W-]+/g, '-'),
        description: condition.description || '',
        badgeColor: condition.badgeColor || 'teal',
        isActive: condition.isActive ?? true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      this.conditionsSignal.update(conds => [newCond, ...conds]);
    }
  }

  deleteCondition(id: string) {
    this.conditionsSignal.update(conds => conds.filter(c => c.id !== id));
  }

  // Order Actions
  toggleOrderActive(id: string) {
    this.ordersSignal.update(orders =>
      orders.map(o => o.id === id ? { ...o, isActive: !o.isActive } : o)
    );
  }

  updateOrderStatus(id: string, status: Order['status']) {
    this.ordersSignal.update(orders =>
      orders.map(o => o.id === id ? { ...o, status } : o)
    );
  }
}

