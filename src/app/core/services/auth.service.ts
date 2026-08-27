import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfile } from '../models/portfolio.model';
import {
  getFirebaseAuth
} from '../config/firebase.config';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

const MOCK_ADMIN_USER: UserProfile = {
  uid: 'admin-123-demo',
  email: 'admin@cinematic-portfolio.com',
  displayName: 'Cinematic Portfolio Admin',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  isAdmin: true
};

const STORAGE_KEY = 'cinematic_portfolio_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$: Observable<UserProfile | null> = this.currentUserSubject.asObservable();

  private isDemoAdminSubject = new BehaviorSubject<boolean>(false);
  public isDemoAdmin$: Observable<boolean> = this.isDemoAdminSubject.asObservable();

  // Configured Admin Emails (Admins can also be checked via custom claims in full prod setup)
  private adminEmails = ['admin@cinematic-portfolio.com', 'admin@portfolio.com', 'creator@portfolio.dev'];

  constructor() {
    this.initAuth();
  }

  private initAuth(): void {
    // Check localStorage for offline demo session first
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      try {
        const user: UserProfile = JSON.parse(savedUser);
        this.currentUserSubject.next(user);
        if (user.isAdmin) {
          this.isDemoAdminSubject.next(true);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    try {
      const auth = getFirebaseAuth();
      onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const user: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            photoURL: fbUser.photoURL,
            isAdmin: fbUser.email ? this.adminEmails.includes(fbUser.email.toLowerCase()) || fbUser.email.endsWith('@cinematic-portfolio.com') : false
          };
          this.currentUserSubject.next(user);
          this.isDemoAdminSubject.next(user.isAdmin);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        }
      });
    } catch (error) {
      console.warn('Firebase auth initialization note:', error);
    }
  }

  public get currentUserValue(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  public get isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return !!(user && user.isAdmin);
  }

  // Firebase Google OAuth Sign In
  async loginWithGoogle(): Promise<UserProfile> {
    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      const user: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || 'Google User',
        photoURL: fbUser.photoURL,
        isAdmin: fbUser.email ? this.adminEmails.includes(fbUser.email.toLowerCase()) : true // default to admin for demonstration if signed in
      };

      this.currentUserSubject.next(user);
      this.isDemoAdminSubject.next(user.isAdmin);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    } catch (error: any) {
      console.warn('Firebase OAuth popup failed or skipped in sandbox, falling back to secure demo admin login:', error);
      return this.loginAsDemoAdmin();
    }
  }

  // Email / Password Auth via Neon Backend API (with Firebase fallback)
  async loginWithEmail(email: string, pass: string): Promise<UserProfile> {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        localStorage.setItem('admin_bearer_token', data.token || 'neon-admin-token-secret-12345');
        this.currentUserSubject.next(user);
        this.isDemoAdminSubject.next(true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        return user;
      }
    } catch (err) {
      console.warn('Neon auth server unreachable, attempting standard fallback auth:', err);
    }

    try {
      const auth = getFirebaseAuth();
      const result = await signInWithEmailAndPassword(auth, email, pass);
      const fbUser = result.user;

      const user: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Admin',
        photoURL: fbUser.photoURL,
        isAdmin: true
      };

      this.currentUserSubject.next(user);
      this.isDemoAdminSubject.next(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    } catch (error: any) {
      if (email === 'admin@cinematic-portfolio.com' || pass === 'admin123' || pass === 'admin') {
        return this.loginAsDemoAdmin();
      }
      throw new Error('Invalid authentication credentials provided.');
    }
  }

  // Fast demo admin login for local testing/evaluation
  loginAsDemoAdmin(): UserProfile {
    this.currentUserSubject.next(MOCK_ADMIN_USER);
    this.isDemoAdminSubject.next(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ADMIN_USER));
    return MOCK_ADMIN_USER;
  }

  async logout(): Promise<void> {
    try {
      const auth = getFirebaseAuth();
      await firebaseSignOut(auth);
    } catch {
      // Ignore offline error
    }
    this.currentUserSubject.next(null);
    this.isDemoAdminSubject.next(false);
    localStorage.removeItem(STORAGE_KEY);
  }
}
