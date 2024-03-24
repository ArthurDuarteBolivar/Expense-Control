import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinginComponent } from './singin.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

describe('SinginComponent', () => {
  let component: SinginComponent;
  let fixture: ComponentFixture<SinginComponent>;
  let page: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SinginComponent],
      imports: [MatFormFieldModule, MatInputModule, BrowserAnimationsModule, ReactiveFormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SinginComponent);
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

  function loginButton() {
    return page.querySelector('[test-id="login-button"]')
  }

});
