import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { PagesModule } from '../pages/pages.module';
import { RouterModule } from '@angular/router';
import { localSProvider } from '../domain/providers/localS.provider';

@NgModule({
  declarations: [
    SidebarComponent,
    TopbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    SidebarComponent,
    TopbarComponent
  ]
})
export class SharedModule { }
