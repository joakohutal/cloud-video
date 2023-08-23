import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { arrayInfoUsers } from 'src/app/auth/constants/arrayUsers';
import { IAuthRepository } from 'src/app/domain/repository/auth.repository';
import { ILocalSRepository } from 'src/app/domain/repository/localS.repository';
import Swal from 'sweetalert2';
import { IUser } from '../interfaces/auth.interface';
import { ISwalfire } from '../../core/interfaces/swalfire.interface';

@Injectable()
export class AuthService implements IAuthRepository {
  constructor(
    private router: Router,
    @Inject('localSRepository') private localStorageService: ILocalSRepository
  ) {}

  validation(username: string, password: string): IUser | undefined {
    if (!localStorage.hasOwnProperty('arrayInfoUsers')) {
      this.localStorageService.setLocalStorage(
        'arrayInfoUsers',
        arrayInfoUsers
      );
      return arrayInfoUsers.find(
        (element) =>
          element.username === username && element.password === password
      );
    } else {
      const arrayInfoUsers: IUser[] =
        this.localStorageService.getLocalStorage('arrayInfoUsers');
      return arrayInfoUsers.find(
        (element) =>
          element.username === username && element.password === password
      );
    }
  }

  setMessage(message: ISwalfire): void {
    Swal.fire(
      message.title, 
      message.text, 
      message.icon);
  }

  verifyAuthentication(): boolean {
    return !localStorage.getItem('userAccount') ? false : true;
  }

  logout(): void {
    this.localStorageService.removeLocalStorage('userAccount');
  }
}
