import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { IAuthRepository } from 'src/app/domain/repository/auth.repository';

@Injectable({
  providedIn: 'root'
})
export class ValidationGuard implements CanActivate {
  constructor(
    @Inject('authRepository') private authService: IAuthRepository
    ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.authService.verifyAuthentication();
  }
}
