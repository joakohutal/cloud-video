import { Component, Inject, OnInit } from '@angular/core';
import { IUser } from '../../auth/interfaces/auth.interface';
import { ILocalSRepository } from '../../domain/repository/localS.repository';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  user!: IUser;

  constructor(
    @Inject('localSRepository') private localStorageService: ILocalSRepository,
    ) { }

  ngOnInit(): void {
    this.getUserInformation();
  }

  getUserInformation(): void {
    this.user = this.localStorageService.getLocalStorage('userAccount');
  }
}
