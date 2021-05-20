import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    HomeComponent,
    PagesComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ]
})
export class PagesModule { }
