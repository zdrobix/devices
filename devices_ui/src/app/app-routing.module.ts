import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/user/login/login.component';
import { DeviceListComponent } from './features/device/device-list/device-list.component';
import { DeviceAddComponent } from './features/device/device-add/device-add.component';
import { DeviceAssignComponent } from './features/device/device-assign/device-assign.component';
import { AuthGuard } from './core/guards/auth.guard';
import { DeviceUpdateComponent } from './features/device/device-update/device-update.component';
import { DeviceInfoComponent } from './features/device/device-info/device-info.component';
import { CreateUserComponent } from './features/user/create-user/create-user.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, runGuardsAndResolvers: 'always'},
  { path: 'devices', component: DeviceListComponent, canActivate: [AuthGuard]},
  { path: 'device-add', component: DeviceAddComponent, canActivate: [AuthGuard]},
  { path: 'device-update/:id', component: DeviceUpdateComponent, canActivate: [AuthGuard]},
  { path: 'device-assign/:id', component: DeviceAssignComponent, canActivate: [AuthGuard]},
  { path: 'device-info/:id', component: DeviceInfoComponent, canActivate: [AuthGuard]},
  { path: 'signup', component: CreateUserComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
