import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { localSProvider } from '../domain/providers/localS.provider';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
  ],
  providers: [localSProvider]
})
export class AtmModule { }
