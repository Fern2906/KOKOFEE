import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNgBrutalism } from '@ng-brutalism/ui';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideNgBrutalism({
      theme: {
        primary: '#c25e00',
        secondary: '#3c2a21',
        accent: '#d48b47',
        cream: '#faf7f2',
        radius: '8px',
        borderWidth: '2px',
        shadowOffsetX: '3px',
        shadowOffsetY: '3px',
        fontSans: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontMono: "'JetBrains Mono', monospace",
      },
    }),
  ],
};
