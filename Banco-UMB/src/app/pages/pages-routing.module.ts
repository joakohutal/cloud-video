import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAccountComponent } from './create-account/create-account.component';
import { DepositMoneyComponent } from './deposit-money/deposit-money.component';
import { HomeComponent } from './home/home.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { TranferMoneyComponent } from './tranfer-money/tranfer-money.component';
import { WithdrawalsComponent } from './withdrawals/withdrawals.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { VideosComponent } from './videos/videos.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'upload',
        component:FileUploadComponent
      },
      {
        path:'videos',
        component:VideosComponent

      },
      {
        path: 'myAccount',
        component: MyAccountComponent
      },
      {
        path: 'createAccount',
        component: CreateAccountComponent
      },
      {
        path: 'deposit',
        component: DepositMoneyComponent
      },
      {
        path: 'tranfer',
        component: TranferMoneyComponent
      },
      {
        path: 'withdrawals',
        component: WithdrawalsComponent
      },
      {
        path: '**',
        redirectTo: 'upload'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
