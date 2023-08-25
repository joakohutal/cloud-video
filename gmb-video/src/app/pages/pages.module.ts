import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home-component/home.component';
import { SharedModule } from '../shared/shared.module';
import { AuthProvider } from '../domain/providers/auth.provider';
import { localSProvider } from '../domain/providers/localS.provider';
import { AtmModule } from '../core/atm.module';
import { FileUploadComponent } from './file-upload-component/file-upload.component';
import { HttpClientModule } from '@angular/common/http';
import { VideosComponent } from './video-component/videos.component';
import { FormsModule } from '@angular/forms';
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
    HttpClientModule,
    FormsModule
  ],
  providers: [AuthProvider, localSProvider]
})
export class PagesModule { }
