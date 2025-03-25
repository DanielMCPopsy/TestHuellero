import { Component } from '@angular/core';
import { HuellasService } from '../../services/huellas.service';

@Component({
  selector: 'app-top-nav-bar',
  imports: [],
  templateUrl: './top-nav-bar.component.html',
  styleUrl: './top-nav-bar.component.css'
})
export class TopNavBarComponent {
  constructor(private huellasService: HuellasService) { }

  login(): void {
    this.huellasService.login().subscribe();
  }

  logout(): void {
    this.huellasService.logout();
  }
}
