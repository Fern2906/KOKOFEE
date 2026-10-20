import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import {
  NbButton, NbChip, NbDisplay, NbInput, NbSplit, NbStack, NbSurface, NbText,
} from '@ng-brutalism/ui';
import { LucideAngularModule, Coffee, Mail, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    NbButton, NbDisplay, NbInput, NbSplit, NbStack, NbSurface, NbText,
    LucideAngularModule
  ],
  template: `
    <footer class="footer w-full">
      <div nbSurface tone="yellow" class="w-full overflow-hidden">
        @if (!isAuthRoute()) {
          <div nbSplit ratio="1:1" gap="xl" collapse="md" align="center" class="p-6 sm:p-10">
            <div nbStack gap="md" align="start">
              <div class="flex items-center gap-3">
                <span class="footer__logo">
                  <lucide-icon [img]="icons.Coffee" [size]="24" [strokeWidth]="3" />
                </span>
                <span nbDisplay size="md" class="uppercase">KOKOFEE</span>
              </div>
              <p nbText size="sm" weight="medium" measure="md">
                Tostaduría de café de especialidad. Tostamos cada semana en
                pequeños batches para preservar las notas de cata y su terroir.
              </p>
            </div>

            <form (submit)="$event.preventDefault()" nbStack gap="sm" align="start" class="w-full">
              <label nbText size="xs" weight="black" transform="uppercase" tracking="wide" for="footer-email">
                Boletín del barista
              </label>
              <div class="flex w-full flex-col gap-2 sm:flex-row">
                <input nbInput id="footer-email" type="email" placeholder="tu@correo.com"
                       class="w-full" aria-label="Correo para el boletín" />
                <button nbButton tone="black" size="md" type="submit" class="shrink-0">
                  <lucide-icon [img]="icons.Mail" [size]="18" [strokeWidth]="3" />
                  <span>Suscribirme</span>
                </button>
              </div>
            </form>
          </div>

          <nav aria-label="Pie de página"
               class="flex flex-wrap gap-3 border-t-4 border-(--nb-border) bg-(--nb-pink) px-6 py-5 sm:px-10">
            <a class="footer__link" href="#productos">Granos</a>
            <a class="footer__link" href="#recetas">Guías</a>
            <a class="footer__link" href="#manifiesto">Historia</a>
            <a class="footer__link" href="#resenas">Reseñas</a>
          </nav>

          <div class="flex flex-col items-center justify-between gap-3 border-t-4 border-(--nb-border)
                      bg-(--nb-hot) px-6 py-4 font-mono text-xs font-bold uppercase sm:flex-row sm:px-10">
            <p class="m-0">© 2026 KOKOFEE Specialty Coffee Lab</p>
            <div class="flex gap-5">
              <a class="footer__legal" href="#">Privacidad</a>
              <a class="footer__legal" href="#">Envíos</a>
            </div>
          </div>
        } @else {
          <div nbSplit ratio="auto:fill" gap="xl" collapse="md" align="center" class="p-6 sm:p-10">
            <div nbStack gap="md" align="start">
              <div class="flex items-center gap-3">
                <span class="footer__logo">
                  <lucide-icon [img]="icons.Coffee" [size]="24" [strokeWidth]="3" />
                </span>
                <span nbDisplay size="md" class="uppercase">KOKOFEE</span>
              </div>
              <p nbText size="sm" weight="medium" measure="md">
                Tostaduría de café de especialidad. Tostamos cada semana en
                pequeños batches para preservar las notas de cata y su terroir.
              </p>
            </div>

          </div>
          <div class="flex flex-col items-center justify-between gap-3 border-t-4 border-(--nb-border)
                      bg-(--nb-hot) px-6 py-4 font-mono text-xs font-bold uppercase sm:flex-row sm:px-10">
            <p class="m-0">© 2026 KOKOFEE Specialty Coffee Lab</p>
            <div class="flex gap-5">
              <a class="footer__legal" href="#">Privacidad</a>
              <a class="footer__legal" href="#">Envíos</a>
            </div>
          </div>
        }
      </div>
    </footer>
  `,
  styles: `
    .footer__logo {
      display: grid;
      width: 3rem;
      height: 3rem;
      place-items: center;
      border: 4px solid var(--nb-border);
      color: var(--nb-paper);
      box-shadow: 4px 4px 0 0 var(--nb-shadow);
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .footer__logo:hover { transform: rotate(-8deg) scale(1.08); }

    .footer__link {
      display: inline-flex;
      align-items: center;
      padding: 0.4rem 0.9rem;
      border: 3px solid var(--nb-border);
      background: var(--nb-paper);
      font-family: var(--font-mono, monospace);
      font-size: 0.8rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      box-shadow: 3px 3px 0 0 var(--nb-shadow);
      transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    }
    .footer__link:hover {
      background: var(--nb-yellow);
      transform: translate(-2px, -2px) rotate(-1deg);
      box-shadow: 5px 5px 0 0 var(--nb-shadow);
    }
    .footer__link:active { transform: translate(2px, 2px); box-shadow: none; }

    .footer__legal { text-decoration: underline; text-underline-offset: 3px; }
    .footer__legal:hover { text-decoration-thickness: 3px; }

    @media (prefers-reduced-motion: reduce) {
      .footer__logo, .footer__link { transition: none; }
    }

    .footer {
      display: block;
      width: 100%;
      margin: 0;
      padding: 0;
    }
  `,
})
export class FooterComponent {
  private readonly router = inject(Router);

  /** Permite forzar el modo autenticación manualmente si se desea */
  readonly isAuth = input<boolean | undefined>(undefined);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects || e.url)
    ),
    { initialValue: this.router.url }
  );

  readonly isAuthRoute = computed(() => {
    if (this.isAuth() !== undefined) {
      return this.isAuth()!;
    }
    const cleanUrl = (this.currentUrl() || '').split('?')[0].split('#')[0];
    return cleanUrl === '/login' || cleanUrl === '/registro' || cleanUrl === '/register';
  });

  readonly icons = { Coffee, Mail, ArrowRight };
}
