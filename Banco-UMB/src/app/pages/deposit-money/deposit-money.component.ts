import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AtmService } from '../../core/services/atm.service';
import { ILocalSRepository } from 'src/app/domain/repository/localS.repository';
import { IUser } from '../../auth/interfaces/auth.interface';

@Component({
  selector: 'app-deposit-money',
  templateUrl: './deposit-money.component.html',
  styleUrls: ['./deposit-money.component.scss']
})
export class DepositMoneyComponent implements OnInit {
  myUser!: IUser;
  miFormulario!: FormGroup;

  constructor(@Inject('localSRepository') private localStorageService: ILocalSRepository, private fb: FormBuilder, private atmService: AtmService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.miFormulario = this.fb.group({
      depositValue: ['', [Validators.required, Validators.min(0)]],
    })
  }

  deposit(): void {
    const { depositValue } = this.miFormulario.value;
    this.atmService.depositMoney(depositValue);
  }

  getBalanceAccount(): number {
    let dataAccount: IUser = this.localStorageService.getLocalStorage('userAccount')
    this.myUser = dataAccount;
    return this.myUser.accountBalance;
  }

  get depositField(): AbstractControl | null { return this.miFormulario.get('depositValue') }
}
