import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { IUser } from 'src/app/auth/interfaces/auth.interface';
import { AtmService } from 'src/app/core/services/atm.service';
import { ILocalSRepository } from '../../domain/repository/localS.repository';
import { IAuthRepository } from 'src/app/domain/repository/auth.repository';
import { messagesSwalFire } from 'src/app/core/constants/swalFire';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent {
  miFormulario!: FormGroup;
  newUser!: IUser;

  constructor(private fb: FormBuilder, private atmService: AtmService,
    @Inject('localSRepository') private localStorageService: ILocalSRepository,
    @Inject('authRepository') private authService: IAuthRepository) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.miFormulario = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      rol: ['', [Validators.required, Validators.minLength(3)]],
      numberAccountBalance: ['', [Validators.required, Validators.min(0)]],
      accountBalance: ['', [Validators.required, Validators.min(0)]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  getNewUser(): IUser {
    let id = (Date.now() / 1000);
    const { fullName, email, rol, numberAccountBalance, accountBalance, username, password } = this.miFormulario.value;
    this.newUser = {
      id,
      username,
      password,
      fullName,
      email,
      rol,
      numberAccountBalance,
      accountBalance,
      transactions: [],
      friends: []
    }
    return this.newUser;
  }

  createAccountNewUser(): void {
    let newUser = this.atmService.createNewUser(this.getNewUser());
    if (!this.atmService.coincidencias()) {
      this.authService.setMessage(messagesSwalFire.changeCredentials);
    } else {
      this.authService.setMessage(messagesSwalFire.correctRegister);
    }
    this.miFormulario.reset();
  }

  get fullNameField(): AbstractControl | null { return this.miFormulario.get('fullName') };
  get emailField(): AbstractControl | null { return this.miFormulario.get('email') };
  get rolField(): AbstractControl | null { return this.miFormulario.get('rol') };
  get numberAccountBalanceField(): AbstractControl | null { return this.miFormulario.get('numberAccountBalance') };
  get accountBalanceField(): AbstractControl | null { return this.miFormulario.get('accountBalance') };
  get usernameField(): AbstractControl | null { return this.miFormulario.get('username') };
  get passwordField(): AbstractControl | null { return this.miFormulario.get('password') };
}
