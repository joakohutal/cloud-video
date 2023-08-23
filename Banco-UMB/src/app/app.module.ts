import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ValidationGuard } from './core/guards/validation.guard';
import { AuthProvider } from './domain/providers/auth.provider';
import { localSProvider } from './domain/providers/localS.provider';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [ValidationGuard,AuthProvider,localSProvider],//Repasar !!
  bootstrap: [AppComponent]
})
export class AppModule { }
