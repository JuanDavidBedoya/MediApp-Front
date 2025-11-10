import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { HomePublic } from './pages/home-public/home-public';
import { Register } from './pages/register/register';
import { HomePrivate } from './pages/home-private/home-private';
import { Profile } from './pages/profile/profile';
import { HomeDoctor } from './pages/home-doctor/home-doctor';
import { RegisterDoctor } from './pages/register-doctor/register-doctor';
import { AppointmentsUser } from './pages/appointments-user/appointments-user';
import { ProfileDoctor } from './pages/profile-doctor/profile-doctor';
import { AppointmentsNew } from './pages/appointments-new/appointments-new';
import { FormulaNew } from './pages/formula-new/formula-new';
import { AppointmentsDoctor } from './pages/appointments-doctor/appointments-doctor';
import { DoctorGuard } from './guards/doctor-guard';
import { AuthenticatedGuard } from './guards/authenticated-guard';
import { AuthGuard } from './guards/auth-guard';
import { UserList } from './pages/user-list/user-list';

export const routes: Routes = [
    { path: '', redirectTo: 'home-public', pathMatch: 'full' },
    { path: 'login', component: Login, canActivate: [AuthenticatedGuard]},
    { path: 'home-public', component: HomePublic, canActivate: [AuthenticatedGuard]},
    { path: 'home-doctor', component: HomeDoctor, canActivate: [DoctorGuard]},
    { path: 'home-private', component: HomePrivate, canActivate: [AuthGuard]},
    { path: 'register', component: Register, canActivate: [AuthenticatedGuard]},
    { path: 'profile', component: Profile, canActivate: [AuthGuard]},
    { path: 'register-doctor', component: RegisterDoctor, canActivate: [DoctorGuard]},
    { path: 'appointments-user', component: AppointmentsUser, canActivate: [AuthGuard]},
    { path: 'appointments-doctor', component: AppointmentsDoctor, canActivate: [DoctorGuard]},
    { path: 'appointments-new', component: AppointmentsNew, canActivate: [AuthGuard]},
    { path: 'profile-doctor', component: ProfileDoctor, canActivate: [DoctorGuard]},
    { path: 'create-formula', component: FormulaNew, canActivate: [DoctorGuard]},
    { path: 'user-list', component: UserList, canActivate: [DoctorGuard]},
    { path: '**', redirectTo: 'home-public'},
];
