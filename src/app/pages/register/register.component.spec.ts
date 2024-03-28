import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../singin/services/authentication.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { BlankComponent } from '../../mocks/blank/blank.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let page: any;
  let location: Location;
  let authenticationService: AuthenticationServiceMock;
  let snackBar: SnackBarMock;

  beforeEach(async () => {
    authenticationService = new AuthenticationServiceMock();
    snackBar = new SnackBarMock();
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: BlankComponent },
          { path: 'register', component: BlankComponent },
          { path: 'singin', component: BlankComponent }
        ]),
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
    })
      .overrideProvider(AuthenticationService, { useValue: authenticationService })
      .overrideProvider(MatSnackBar, { useValue: snackBar })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    location = TestBed.inject(Location);
    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  describe('given form', () => {
    it('when email is empty, then register button shoud be disabled', () => {
      setEmail('');
      setPassword('123456');
      setRepeatPassword('123456');
      expect(registerButton().disabled).toBeTruthy()
    })
    it('when email is invalid, then register button shoud be disabled', () => {
      setEmail('invalidEmail');
      setPassword('123456');
      setRepeatPassword('123456');
      expect(registerButton().disabled).toBeTruthy()
    })
    it('when repeat password is empty, then register button shoud be disabled', () => {
      setEmail('valid@email.com');
      setPassword('123456');
      setRepeatPassword('');
      expect(registerButton().disabled).toBeTruthy()
    })
    it('when repeat password is not equal to the password, then register button shoud be disabled', () => {
      setEmail('valid@email.com');
      setPassword('123456');
      setRepeatPassword('1234');
      expect(registerButton().disabled).toBeTruthy()
    })
    it('when email is valid and the other inputs, then register button shoud be enabled', () => {
      setEmail('valid@email.com');
      setPassword('123456');
      setRepeatPassword('123456');
      expect(registerButton().disabled).toBeFalsy()
    })
    it('when click on login button should go to singin page', done => {
      loginButton().click()
      fixture.detectChanges()
      setTimeout(() => {
        expect(location.path()).toEqual('/singin'); 
        done();
      }, 100);
    })
  })
  
  describe('register flow', () => {
    describe('given user clicks on login button', () => {
      beforeEach(() => {
        setEmail('valid@email.com');
        setPassword('123456');
        setRepeatPassword('123456');
        registerButton().click()
        fixture.detectChanges();
      })
      it('the show login loader', () => {
        expect(registerLoader()).not.toBeNull();
      })
      it('the hide login button', () => {
        expect(registerButton()).toBeNull();
      })
    describe('when register sucessfully', () => {
      beforeEach(() => {
        authenticationService._registerResponse.next({})
        fixture.detectChanges()
      })
      it('when click on the register button shoud be show the register loader', () => {
        expect(registerLoader()).not.toBeNull()
      })
      it('then go to singin page', done => {
        setTimeout(() => {
          expect(location.path()).toEqual('/singin');
          done();
        }, 100);
      })

      it('then open a snackbar', () => {
        expect(snackBar._isOpened).toBeTruthy()
      })      
    })
    
    describe('when register fails', () => {
      beforeEach(() => {
        authenticationService._registerResponse.error({ message: 'anyError'})
        fixture.detectChanges()
      })
      it('when click on the register button shoud be hide the register loader', () => {
        expect(registerLoader()).toBeNull()
      })
      
    })
  })
})

  function setEmail(value: string) {
    component.form.get('email')?.setValue(value);
    fixture.detectChanges()
  }
  function setPassword(value: string) {
    component.form.get('password')?.setValue(value);
    fixture.detectChanges()
  }
  function setRepeatPassword(value: string) {
    component.form.get('repeatedPassword')?.setValue(value);
    fixture.detectChanges()
  }

  function registerButton() {
    return page.querySelector('[test-id="register-button"]')
  }
  function registerLoader() {
    return page.querySelector('[test-id="register-loader"]')
  }

  function loginButton(){
   return page.querySelector('[test-id="login-button"]') 
  }
});

class AuthenticationServiceMock {
  _singInResponse = new Subject();
  _recoverPasswordResponse = new Subject();
  _registerResponse = new Subject();
  singIn() {
    return this._singInResponse.asObservable();
  }

  recoverPassword() {
    return this._recoverPasswordResponse.asObservable()
  }

  register(){
    return this._registerResponse.asObservable()
  }
}

class SnackBarMock {
  _isOpened = false;
  open() {
    this._isOpened = true;
  }
}