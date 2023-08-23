import { Inject, Injectable } from '@angular/core';
import { ILocalSRepository } from '../../domain/repository/localS.repository';
import { ITransaction, IUser } from '../../auth/interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AtmService {
  currentValueUser: number = 0;
  coincidence!: boolean;

  constructor(@Inject('localSRepository') private localStorageService: ILocalSRepository) { }

  getAccountValue(): number {
    const user: IUser = this.localStorageService.getLocalStorage('userAccount');
    const userBalance: number = user.accountBalance;
    return userBalance;
  }

  updateArrayInfoUsers(user: IUser): void {
    const arrayInfoUsers: IUser[] = this.localStorageService.getLocalStorage('arrayInfoUsers')
    arrayInfoUsers.find((element, index) => {
      if (element.id === user.id) {
        arrayInfoUsers[index] = user;
        this.localStorageService.setLocalStorage('arrayInfoUsers', arrayInfoUsers);
      }
    })
  }

  depositMoney(depositValue: number): void {
    const currentUser = this.localStorageService.getLocalStorage('userAccount');
    this.currentValueUser = this.getAccountValue() + depositValue;
    currentUser.accountBalance = this.currentValueUser;
    this.localStorageService.setLocalStorage('userAccount', currentUser);
    this.updateArrayInfoUsers(currentUser);
  }

  setCurrentValueUser(withdrawalValue: number): void {
    this.currentValueUser = this.getAccountValue() - withdrawalValue;
    let dataAccount = this.localStorageService.getLocalStorage('userAccount');
    dataAccount.accountBalance = this.currentValueUser;
    this.localStorageService.setLocalStorage('userAccount', dataAccount);
    this.updateArrayInfoUsers(dataAccount);
  }

  withdrawalMoney(withdrawalValue: number): boolean {
    console.log(withdrawalValue);
    console.log(this.getAccountValue());
    
    if (withdrawalValue > this.getAccountValue()) {
      this.coincidence = false;
    } else {
      this.setCurrentValueUser(withdrawalValue);
    }
    return this.coincidence;
  }

  createNewUser(person: IUser): boolean {
    const arrayInfoUsers: IUser[] = this.localStorageService.getLocalStorage('arrayInfoUsers')
    const currentUser: IUser = this.localStorageService.getLocalStorage('userAccount');
    const coincidences = arrayInfoUsers.find(element => (element.username === person.username.trim()) || (element.password === person.password.trim()) || (element.fullName === person.fullName.trim()) || (element.email === person.email.trim()) || (element.numberAccountBalance === person.numberAccountBalance));
    if (!coincidences) {
      this.coincidence = true;
      currentUser.friends.push(person);
      this.localStorageService.setLocalStorage('userAccount', currentUser);
      arrayInfoUsers.push(person);
      this.localStorageService.setLocalStorage('arrayInfoUsers', arrayInfoUsers);
      this.updateArrayInfoUsers(currentUser);
    }
    return this.coincidence;
  }

  userToTransfer(transferAccount: number): IUser | undefined {
    const arrayInfoUsers: IUser[] = this.localStorageService.getLocalStorage('arrayInfoUsers')
    return arrayInfoUsers.find(user => user.numberAccountBalance === transferAccount);
  }

  transferMoney(dataTransaction: ITransaction): boolean {
    const currentUser: IUser = this.localStorageService.getLocalStorage('userAccount');
    const userToTransfer: IUser | undefined = this.userToTransfer(dataTransaction.transferAccount);
    if (userToTransfer) {
      if (dataTransaction.transferValue <= currentUser.accountBalance) {
        currentUser.accountBalance -= dataTransaction.transferValue;
        userToTransfer.accountBalance += dataTransaction.transferValue;
        currentUser.transactions.push(dataTransaction);
        this.localStorageService.setLocalStorage('userAccount', currentUser);
        this.updateArrayInfoUsers(currentUser);
        this.updateArrayInfoUsers(userToTransfer);
        this.coincidence = true;
      }
      return true;
    } else {
      return false;
    }
  }

  coincidencias(): boolean {
    return (this.coincidence) ? true : false;
  }
}
