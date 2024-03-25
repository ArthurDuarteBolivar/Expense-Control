import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token: string | any = localStorage.getItem('token');
  if(token == "" || token == null || token == undefined){
    window.location.href = '/singin';
    return false;
  }
  return true;

};
