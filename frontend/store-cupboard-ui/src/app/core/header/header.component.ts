import { Component, OnInit } from '@angular/core';
import { isDevMode } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isMenuCollapsed = true;
  public brandLogoSrc: string;

  constructor() { }

  ngOnInit(): void {
    this.brandLogoSrc = isDevMode() ? 'assets/images/pantry-egg-brand.png' : './static/ang-src/assets/images/pantry-egg-brand.png';
  }

  toggleCollapsed(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  openAdminPanel(): void {
    window.open('https://192.168.1.13:8000/admin', 'blank');
  }

}
