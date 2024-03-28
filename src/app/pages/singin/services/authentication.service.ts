import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private auth: AngularFireAuth
  ) { }

  singIn(params: SingIn): Observable<any>{
    return from(this.auth.signInWithEmailAndPassword(params.email, params.password))
  }

  recoverPassword(email: string): Observable<void>{
    return from(this.auth.sendPasswordResetEmail(email))
  }

  register(params: SingIn){
    return from(this.auth.createUserWithEmailAndPassword(params.email, params.password))
  }

}

type SingIn = {
  email: string,
  password: string
}