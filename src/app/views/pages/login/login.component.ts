import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { UserAuthService } from "../../../services/user-auth.service";
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import Notiflix from "notiflix";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, FormsModule, RouterLink]
})
export class LoginComponent {

  name: string | undefined;
  password: string | undefined;
  errorMessage: string = '';

  constructor(private authService: UserAuthService, private router: Router) { }

  login() {
    // Prepare the login request body
    const authRequest = { username: this.name, password: this.password };

    // Call the service to generate token
    this.authService.login(authRequest).subscribe({
      next: (response) => {
        if (response.token) {
          // Store the token on successful login
          this.authService.setToken(response.token);
          console.log('Login successful, token:', response.token);
          Notiflix.Notify.success('Login successful!!')

          // Navigate to the dashboard or the protected route
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        // Handle login error
        this.errorMessage = 'Invalid login credentials. Please try again.';
        console.error('Login failed:', error);
        Notiflix.Notify.failure('Invalid login credentials. Please try again.')
      }
    });
  }
}
