import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-singin',
  templateUrl: './singin.component.html',
  styleUrl: './singin.component.scss'
})
export class SinginComponent implements OnInit {
  form!: FormGroup;
  isLogginIn = false;
  localStorage: Storage;
  isRecoveringPassword: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private authenticationService: AuthenticationService, private snackBar: MatSnackBar) {
    this.localStorage = window.localStorage;
  }

  ngOnInit(): void {
    this.localStorage.clear()
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  login() {
    this.localStorage.clear()
    this.isLogginIn = true;
    this.authenticationService.singIn({ email: this.form.value.email, password: this.form.value.password }).subscribe((res) => {
      console.log(res)
      this.localStorage.setItem('token', res.user.multiFactor.user.accessToken)
      this.router.navigate(['/home']);
    }, (error: any) => {
      this.isLogginIn = false;
      this.snackBar.open(error.message, "OK", {
        duration: 5000,
      })
    })
  }

  recoverPassword() {
    this.isRecoveringPassword = true;
    this.authenticationService.recoverPassword(this.form.value.email).subscribe(() => {
      this.isRecoveringPassword = false;
      this.snackBar.open("You can recover your password in your email account.", "OK", {
        duration: 5000,
      })
    }, (error: any) => {
      this.isRecoveringPassword = false;
      this.snackBar.open(error.message, "OK", {
        duration: 5000,
      })
    })
  }

  register(){
    this.router.navigate(['/register'])
  }

}
