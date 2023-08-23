export interface ILocalSRepository {
  setLocalStorage(name: string, value: any): void;
  getLocalStorage(name: string): any;
  removeLocalStorage(name: string): void;
}
