import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./guest/home/home.component";
import { LoginComponent } from "./guest/login/login.component";
import { RegisterComponent } from "./guest/register/register.component";
import { ProfileComponent } from "./user/profile/profile.component";
import { AdminComponent } from "./admin/admin/admin.component";
import { NotFoundComponent } from "./error/not-found/not-found.component";
import { UnauthorizedComponent } from "./error/unauthorized/unauthorized.component";
import { AuthGuard } from "./guards/auth.guard";
import { Role } from "./models/role.enum";
import { LandingComponent } from "./guest/landing/landing.component";

const routes: Routes = [

  { path: '', redirectTo: 'landing', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'landing', component: LandingComponent },

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN, Role.USER] }
  },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN] }
  },

  { path: '404', component: NotFoundComponent },
  { path: '401', component: UnauthorizedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
      this.router.navigate(['/404']);
    };
  }
}
