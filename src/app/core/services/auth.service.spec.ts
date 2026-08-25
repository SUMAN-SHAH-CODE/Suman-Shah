import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to non-admin / unauthenticated user state', () => {
    expect(service.currentUserValue).toBeNull();
    expect(service.isAdmin).toBeFalse();
  });

  it('should allow demo admin login and set admin state', () => {
    const user = service.loginAsDemoAdmin();
    expect(user.isAdmin).toBeTrue();
    expect(service.isAdmin).toBeTrue();
    expect(service.currentUserValue?.email).toBe('admin@cinematic-portfolio.com');
  });

  it('should clear user state upon logout', async () => {
    service.loginAsDemoAdmin();
    expect(service.isAdmin).toBeTrue();
    await service.logout();
    expect(service.currentUserValue).toBeNull();
    expect(service.isAdmin).toBeFalse();
  });
});
