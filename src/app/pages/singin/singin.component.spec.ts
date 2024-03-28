import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinginComponent } from './singin.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing'
import { BlankComponent } from '../../mocks/blank/blank.component';
import { AuthenticationService } from './services/authentication.service';
import { Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

describe('SinginComponent', () => {
  let component: SinginComponent;
  let fixture: ComponentFixture<SinginComponent>;
  let page: any;
  let location: Location;
  let authenticationService: AuthenticationServiceMock;
  let snackBar: SnackBarMock;

  beforeEach(async () => {
    authenticationService = new AuthenticationServiceMock();
    snackBar = new SnackBarMock();
    await TestBed.configureTestingModule({
      declarations: [SinginComponent],
      imports: [MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: BlankComponent },
          { path: 'register', component: BlankComponent }
        ]),
        MatSnackBarModule
      ]
    })
      .overrideProvider(AuthenticationService, { useValue: authenticationService })
      .overrideProvider(MatSnackBar, { useValue: snackBar })
      .compileComponents();

    fixture = TestBed.createComponent(SinginComponent);
    location = TestBed.inject(Location);
    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  describe('given form', () => {
    it('when email is empty, then recover password button should be disabled', () => {
      expect(recoverPasswordButton().disabled).toBeTruthy();
    })

    it('when email is invalid, then recover password button should be disabled', () => {
      setEmail('invalidEmail');
      expect(recoverPasswordButton().disabled).toBeTruthy();
    })
    it('when email is valid, then recover password button should be enabled', () => {
      setEmail('valid@email.com');
      expect(recoverPasswordButton().disabled).toBeFalsy();
    })
    it('when email is empty, then login button should be disabled', () => {
      setEmail('');
      setPassword('123456');
      expect(loginButton().disabled).toBeTruthy();
    })
    it('when email is invalid, then login button should be disabled', () => {
      setEmail('invalidEmail');
      setPassword('123456');
      expect(loginButton().disabled).toBeTruthy();
    })
    it('when email is valid, then login button should be enabled', () => {
      setEmail('valid@email.com');
      setPassword('123456');
      expect(loginButton().disabled).toBeFalsy();
    })
    it('when password is empty, then login button should be disabled', () => {
      setPassword('');
      setEmail('valid@email.com');
      expect(loginButton().disabled).toBeTruthy();
    })
    it('when password is not empty, then login button should be enabled', () => {
      setPassword('123456');
      setEmail('valid@email.com');
      expect(loginButton().disabled).toBeFalsy();
    })
  })

  describe('login flow', () => {

    describe('given user clicks on login button', () => {
      beforeEach(() => {
        setPassword('123456');
        setEmail('valid@email.com');
        loginButton().click();
        fixture.detectChanges();
      })
      it('the show login loader', () => {
        expect(loginLoader()).not.toBeNull();
      })
      it('the hide login button', () => {
        expect(loginButton()).toBeNull();
      })
      describe('when login is successful', () => {
        beforeEach(() => {
          authenticationService._singInResponse.next({
            user: {
              multiFactor: {
                user: {
                  accessToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImViYzIwNzkzNTQ1NzExODNkNzFjZWJlZDI5YzU1YmVmMjdhZDJjY2IiLCJ0eXAiOiJKV1QifQ"
                }
              }
            }
          });
          fixture.detectChanges();
        })
        it('then go to home page', done => {
          setTimeout(() => {
            expect(location.path()).toEqual('/home');
            done();
          }, 100);
        })
        it('then show login loader', () => {
          expect(loginLoader()).not.toBeNull()
        })
        it('then verify if save the in the storage the id', () => {
          const token = localStorage.getItem('token')
          expect(token).toEqual("eyJhbGciOiJSUzI1NiIsImtpZCI6ImViYzIwNzkzNTQ1NzExODNkNzFjZWJlZDI5YzU1YmVmMjdhZDJjY2IiLCJ0eXAiOiJKV1QifQ")
        })
      })

      describe('when login is fails', () => {
        beforeEach(() => {
          authenticationService._singInResponse.error({ message: "anyError" });
          fixture.detectChanges();
        })
        it('then do not go to home page', done => {
          setTimeout(() => {
            expect(location.path()).not.toEqual('/home');
            done();
          }, 100);
        })
        it('then hide login loader', () => {
          expect(loginLoader()).toBeNull()
        })
        it('then show login button', () => {
          expect(loginButton()).not.toBeNull()
        })
        it('then show error message', () => {
          expect(snackBar._isOpened).toBeTruthy()
        })
        it('then verify if not save the in the storage the id', () => {
          const token = localStorage.getItem('token')
          expect(token).not.toEqual("eyJhbGciOiJSUzI1NiIsImtpZCI6ImViYzIwNzkzNTQ1NzExODNkNzFjZWJlZDI5YzU1YmVmMjdhZDJjY2IiLCJ0eXAiOiJKV1QifQ")
        })
      })
    })
  })

  describe('Recover password flow', () => {
    describe('given user clicks on recover password button', () => {
      beforeEach(() => {
        setEmail('valid@email.com');
        recoverPasswordButton().click();
        fixture.detectChanges()
      })

      it('then show recover password loader', () => {
        expect(recoverPasswordLoader()).not.toBeNull()
      })
      it('then hide recover password', () => {
        expect(recoverPasswordButton()).toBeNull()
      })
      describe('when recover password success', () => {
        beforeEach(() => {
          authenticationService._recoverPasswordResponse.next({})
          fixture.detectChanges()
        })
        it('then hide recover password loader', () => {
          expect(recoverPasswordLoader()).toBeNull()
        })
        it('then show recover password button', () => {
          expect(recoverPasswordButton()).not.toBeNull()
        })
        it('then show success message', () => {
          expect(snackBar._isOpened).toBeTruthy()
        })
      })
      describe('when recover password success', () => {
        beforeEach(() => {
          authenticationService._recoverPasswordResponse.error({ message: "anyError" })
          fixture.detectChanges()
        })
        it('then hide recover password loader', () => {
          expect(recoverPasswordLoader()).toBeNull()
        })
        it('then show recover password button', () => {
          expect(recoverPasswordButton()).not.toBeNull()
        })
        it('then show error message', () => {
          expect(snackBar._isOpened).toBeTruthy()
        })
      })
    })
  })

  describe('Register flow', () => {
    describe('click on the button to register', () => {
      beforeEach(() => {
        registerButton().click();
        fixture.detectChanges();
      })
      it('then go to registration page', done => {
        setTimeout(() => {
          expect(location.path()).toEqual('/register');
          done();
        }, 100);
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

  function recoverPasswordButton() {
    return page.querySelector('[test-id="recover-password-button"]')
  }

  function recoverPasswordLoader() {
    return page.querySelector('[test-id="recover-password-loader"]')
  }

  function loginButton() {
    return page.querySelector('[test-id="login-button"]')
  }

  function loginLoader() {
    return page.querySelector('[test-id="login-loader"]');
  }
  function registerButton() {
    return page.querySelector('[test-id="register-button"]');
  }

});

class AuthenticationServiceMock {
  _singInResponse = new Subject();
  _recoverPasswordResponse = new Subject();
  singIn() {
    return this._singInResponse.asObservable();
  }

  recoverPassword() {
    return this._recoverPasswordResponse.asObservable()
  }
}

class SnackBarMock {
  _isOpened = false;
  open() {
    this._isOpened = true;
  }
}