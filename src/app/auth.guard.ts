import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('authToken');
    const currentUserRole = localStorage.getItem('currentUserRole');

    if (token) {
      // Check if the route has a data property specifying required roles
      const requiredRoles = route.data['roles'] as Array<string>;

      if (requiredRoles && requiredRoles.length > 0) {
        if (currentUserRole && requiredRoles.includes(currentUserRole)) {
          return true;
        } else {
          this.router.navigate(['/unauthorized']);
          return false;
        }
      }

      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
