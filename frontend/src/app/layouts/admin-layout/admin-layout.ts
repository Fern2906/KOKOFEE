import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../public-layout/navbar/navbar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen bg-koko-cream text-koko-espresso font-sans">
      <app-navbar variant="admin" />

      <main class="mx-auto w-full max-w-7xl px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {}
