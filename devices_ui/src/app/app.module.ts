import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/user/login/login.component';
import { CreateUserComponent } from './features/user/create-user/create-user.component';
import { DeviceListComponent } from './features/device/device-list/device-list.component';
import { DeviceAddComponent } from './features/device/device-add/device-add.component';
import { DeviceUpdateComponent } from './features/device/device-update/device-update.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { DeviceAssignComponent } from './features/device/device-assign/device-assign.component';
import { AuthInterceptor } from './core/guards/auth.interceptor';
import { DeviceInfoComponent } from './features/device/device-info/device-info.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateUserComponent,
    DeviceListComponent,
    DeviceAddComponent,
    DeviceUpdateComponent,
    NavbarComponent,
    DeviceAssignComponent,
    DeviceInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
