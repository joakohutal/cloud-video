import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IAuthRepository } from '../../../domain/repository/auth.repository';
import { ILocalSRepository } from 'src/app/domain/repository/localS.repository';
import { messagesSwalFire } from '../../../core/constants/swalFire';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  miFormulario!: FormGroup;

  constructor(
    @Inject('authRepository') private authService: IAuthRepository, 
    private fb: FormBuilder, 
    private router: Router,
    @Inject('localSRepository') private localStorageService: ILocalSRepository) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.miFormulario = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  login(): void {
    const { username, password } = this.miFormulario.value;
    const userFind = this.authService.validation(username, password);
    if (userFind) {
      this.localStorageService.setLocalStorage('userAccount', userFind)
      this.router.navigateByUrl('/pages/videos');
    } else {
      this.authService.setMessage(messagesSwalFire.accessDenied);
    }
    this.miFormulario.reset();
  }

  get usernameField(): AbstractControl | null { return this.miFormulario.get('username') }
  get passwordField(): AbstractControl | null { return this.miFormulario.get('password') }
}
