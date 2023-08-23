import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { AuthProvider } from '../domain/providers/auth.provider';
import { localSProvider } from '../domain/providers/localS.provider';
import { AtmModule } from '../core/atm.module';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HttpClientModule } from '@angular/common/http';
import { VideosComponent } from './videos/videos.component';
@NgModule({
  declarations: [
    HomeComponent,
    FileUploadComponent,
    VideosComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    AtmModule,
    HttpClientModule
  ],
  providers: [AuthProvider, localSProvider]
})
export class PagesModule { }
