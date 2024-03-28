import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../singin/services/authentication.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent implements OnInit {
  form!: FormGroup;
  isRegister = false;
  localStorage: Storage;

  constructor(private formBuilder: FormBuilder, private router: Router, private authenticationService: AuthenticationService, private snackBar: MatSnackBar) {
    this.localStorage = window.localStorage;
  }

  ngOnInit(): void {
    this.localStorage.clear()
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      repeatedPassword: ['', [Validators.required]]
    })
  }

  login() {
    this.router.navigate(['/singin'])
  }


  register(){
    this.isRegister = true;
    this.authenticationService.register({email: this.form.value.email, password: this.form.value.password}).subscribe(() => {
      this.snackBar.open("Congratulations! Your account has been successfully registered.", "OK", {
        duration: 5000,
      })
      this.router.navigate(['/singin'])
    }, (error) => {
      this.snackBar.open(error.message, "OK", {
        duration: 5000,
      })
      this.isRegister = false;
    })
  }

}
