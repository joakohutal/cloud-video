import { Component, Inject, OnInit } from '@angular/core';
import { IAuthRepository } from 'src/app/domain/repository/auth.repository';
import { Router } from '@angular/router';
import { IUser } from '../../auth/interfaces/auth.interface';
import { AtmService } from '../../core/services/atm.service';
import { ILocalSRepository } from '../../domain/repository/localS.repository';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  user!: IUser;

  constructor(@Inject('authRepository') private authService: IAuthRepository,
    @Inject('localSRepository') private localStorageService: ILocalSRepository,
    private router: Router,
    private atmService: AtmService) { }

  ngOnInit(): void {
    this.getUserInformation();
  }

  logout(): void {
    this.router.navigateByUrl('/auth');
    this.authService.logout();
  }

  getUserInformation(): void {
    this.user = this.localStorageService.getLocalStorage('userAccount');
  }
}
