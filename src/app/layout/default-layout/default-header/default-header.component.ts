import {Component, computed, inject, input} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { UserAuthService } from '../../../services/user-auth.service';
import {
  AvatarComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent, DropdownComponent,
  DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective,
  HeaderNavComponent, HeaderTogglerDirective, NavItemComponent, NavLinkDirective,
  SidebarToggleDirective
} from '@coreui/angular';
import { HeaderComponent } from '@coreui/angular';
import {IconDirective} from "@coreui/icons-angular";
import {NgTemplateOutlet} from "@angular/common";
import Notiflix from "notiflix";

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  standalone: true,
  imports: [
    IconDirective,
    DropdownItemDirective,
    ContainerComponent,
    SidebarToggleDirective,
    HeaderNavComponent,
    NavItemComponent,
    BreadcrumbRouterComponent,
    DropdownComponent,
    DropdownToggleDirective,
    AvatarComponent,
    DropdownMenuDirective,
    NavLinkDirective,
    RouterLink,
    RouterLinkActive,
    HeaderTogglerDirective,
    NgTemplateOutlet,
    // Les autres imports...
  ]
})
export class DefaultHeaderComponent extends HeaderComponent {
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' }
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find(mode => mode.name === currentMode)?.icon ?? 'cilSun';
  });

  constructor(private authService: UserAuthService, private router: Router) {
    super();
  }

  // Fonction de logout
  logout(): void {
    this.authService.logout(); // Appelle la méthode logout du service
    Notiflix.Notify.info('Logout successful')
    this.router.navigate(['/login']); // Redirige vers la page de login
  }

  // Autres propriétés et méthodes
  sidebarId = input('sidebar1');

  // Reste du code
}
