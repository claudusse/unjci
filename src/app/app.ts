import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  // Variable qui passe à true quand on scrolle
  isScrolled = false;
  isMenuOpen = false;

  // Détecte le défilement de la page
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Si on descend de plus de 50 pixels, on active le mode "collé"
    this.isScrolled = window.scrollY > 50;
  }
  // Fonction pour ouvrir/fermer le menu mobile
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Fonction pour forcer la fermeture (quand on clique sur un lien)
  closeMenu() {
    this.isMenuOpen = false;
  }
}
