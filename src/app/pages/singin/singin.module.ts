import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SinginComponent } from './singin.component';
import { RouterModule, Routes } from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';

const routes: Routes = [
  {path: "", component: SinginComponent}
]

@NgModule({
  declarations: [
    SinginComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule.forChild(routes)
  ]
})
export class SinginModule { }
