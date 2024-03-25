import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlankComponent } from './mocks/blank/blank.component';
@NgModule({
  declarations: [
    AppComponent,
    BlankComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyB8T3DN3jIOWHykY0GCepzpa8iaG3O0z5Q",
      authDomain: "expenses-control-app-9bbbc.firebaseapp.com",
      projectId: "expenses-control-app-9bbbc",
      storageBucket: "expenses-control-app-9bbbc.appspot.com",
      messagingSenderId: "612968512251",
      appId: "1:612968512251:web:b215794e4101591f9e4e5e"
    }),
    AngularFireAuthModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
