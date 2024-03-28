import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: "singin", loadChildren: () => import('./pages/singin/singin.module').then(m => m.SinginModule)},
  {path: "register", loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule)},
  {path: "home", loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule), canActivate: [authGuard]},
  {path: "**", redirectTo: "singin"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
