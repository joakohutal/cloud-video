import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { localSProvider } from '../domain/providers/localS.provider';
import { BrokeImageDirective } from './directives/broke-image.directive';

@NgModule({
  declarations: [
    BrokeImageDirective
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    BrokeImageDirective
  ],
  providers: [localSProvider]
})
export class AtmModule { }
