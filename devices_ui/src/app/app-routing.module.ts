import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/user/login/login.component';
import { DeviceListComponent } from './features/device/device-list/device-list.component';
import { DeviceAddComponent } from './features/device/device-add/device-add.component';
import { DeviceAssignComponent } from './features/device/device-assign/device-assign.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, runGuardsAndResolvers: 'always'},
  { path: 'devices', component: DeviceListComponent, canActivate: [AuthGuard]},
  { path: 'add-device', component: DeviceAddComponent, canActivate: [AuthGuard]},
  { path: 'assign-device', component: DeviceAssignComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
