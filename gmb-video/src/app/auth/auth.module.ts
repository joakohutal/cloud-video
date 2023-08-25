import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthProvider } from '../domain/providers/auth.provider';
import { LoginComponent } from './pages/login/login.component';
import { localSProvider } from '../domain/providers/localS.provider';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ],
  providers: [AuthProvider, localSProvider]
})
export class AuthModule { }
