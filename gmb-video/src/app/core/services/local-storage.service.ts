import { Injectable } from '@angular/core';
import { ILocalSRepository } from '../../domain/repository/localS.repository';

@Injectable()
export class LocalStorageService implements ILocalSRepository {
  setLocalStorage(name: string, value: any): void {
    localStorage.setItem(name, JSON.stringify(value));
  }

  getLocalStorage(name: string): any {
    return JSON.parse(localStorage.getItem(name) || '{}');
  }

  removeLocalStorage(name: string): void {
    localStorage.removeItem(name);
  }
}
