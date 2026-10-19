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
        radius: '0px',
        borderWidth: '3px',
      },
    }),
  ],
};
