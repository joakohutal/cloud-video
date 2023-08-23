import { Component, OnInit, Inject } from '@angular/core';
import { AtmService } from '../../core/services/atm.service';
import { ILocalSRepository } from '../../domain/repository/localS.repository';
import Swal from 'sweetalert2';
import { IUser } from '../../auth/interfaces/auth.interface';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent {
  title = "Información Personal"
  myUser!: IUser;
  date = new Date();

  constructor(private AtmService: AtmService, @Inject('localSRepository') private localStorageService: ILocalSRepository) { }

  ngOnInit(): void {
    this.myAccount();
  }

  myAccount(): void {
    this.myUser = this.localStorageService.getLocalStorage('userAccount');
  }
}
