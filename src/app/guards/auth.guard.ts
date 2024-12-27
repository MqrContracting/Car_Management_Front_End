import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service'; // Assurez-vous que ce chemin est correct

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: UserAuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken(); // Vérifier si le token existe
    if (token) {
      return true; // Si le token est présent, l'utilisateur est authentifié, il peut accéder à la route
    } else {
      this.router.navigate(['/login']); // Sinon, redirigez vers la page de login
      return false;
    }
  }
}
