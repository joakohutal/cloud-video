import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IAuthRepository } from 'src/app/domain/repository/auth.repository';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{ 

  constructor(
    @Inject('authRepository') private authService: IAuthRepository
  ){ }

  ngOnInit(): void {
      
  }

  logout(): void {
    this.authService.logout();
  }

}
