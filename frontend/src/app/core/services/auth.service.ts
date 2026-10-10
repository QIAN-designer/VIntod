import { Injectable, signal } from '@angular/core';

export interface UserAuth {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Stub de sesión de administrador con Signals
  private currentUserSignal = signal<UserAuth>({
    id: 'usr_admin_001',
    name: 'Admin Vintod',
    email: 'admin@vintod.local',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  });

  readonly currentUser = this.currentUserSignal.asReadonly();

  isAdmin(): boolean {
    return this.currentUserSignal().role === 'admin';
  }

  isModerator(): boolean {
    return ['admin', 'moderator'].includes(this.currentUserSignal().role);
  }
}

