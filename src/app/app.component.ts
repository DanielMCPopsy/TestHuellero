import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserComponent } from './user/user.component';
import { TopNavBarComponent } from './Utils/top-nav-bar/top-nav-bar.component';

declare global {
  interface Window {
    WebSdk: any;
  }
}
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserComponent, TopNavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Huellas';

  // private reader: FingerprintReader;

  // constructor() {
  //   this.reader = new FingerprintReader();

  //   this.reader.enumerateDevices().then(console.log);
  // }
}
