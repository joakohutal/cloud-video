import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AtmService } from 'src/app/core/services/atm.service';
import { ILocalSRepository } from '../../domain/repository/localS.repository';
import { IAuthRepository } from 'src/app/domain/repository/auth.repository';
import { messagesSwalFire } from 'src/app/core/constants/swalFire';

@Component({
  selector: 'app-withdrawals',
  templateUrl: './withdrawals.component.html',
  styleUrls: ['./withdrawals.component.scss']
})
export class WithdrawalsComponent implements OnInit {
  miFormulario!: FormGroup;

  constructor(private fb: FormBuilder, 
    private atmService: AtmService,
     @Inject('localSRepository') 
     private localStorageService: ILocalSRepository,
    @Inject('authRepository') 
    private authService: IAuthRepository) { }

  ngOnInit(): void {
    this.createForm();
  this.getBalanceAccount();
  }

  createForm(): void {
    this.miFormulario = this.fb.group({
      withdrawalValue: ['', [Validators.required, Validators.min(0)]],
    })
  }

  withdrawal(): void {
    const { withdrawalValue } = this.miFormulario.value;
    let dataAccount = this.localStorageService.getLocalStorage('userAccount');
  
    if (dataAccount.accountBalance < withdrawalValue) {
      this.authService.setMessage(messagesSwalFire.withdrawalHighterThanBalance)
    }else{
      this.atmService.withdrawalMoney(withdrawalValue);
      this.authService.setMessage(messagesSwalFire.successfulDrawal)
    }
  }

  getBalanceAccount(): number {
    let dataAccount = this.localStorageService.getLocalStorage('userAccount');
    return dataAccount.accountBalance;
  }

  get withdrawalField(): AbstractControl | null { return this.miFormulario.get('withdrawalValue') }
}
