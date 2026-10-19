import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButton, NbInput } from '@ng-brutalism/ui';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, NbButton, NbInput],
  template: `
    <footer class="bg-koko-espresso text-koko-cream border-t-4 border-koko-roast pt-16 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          <!-- Brand Column -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-koko-caramel text-white rounded-lg flex items-center justify-center font-display font-black text-xl border-2 border-white/20 shadow-[2px_2px_0px_#FAF7F2]">
                K
              </div>
              <span class="font-display font-black text-2xl tracking-tight text-white">
                KOKOFEE
              </span>
            </div>
            <p class="text-xs text-koko-cream/80 max-w-sm leading-relaxed">
              Tostaduría de café de especialidad dedicada a la búsqueda de microlotes excepcionales. Tostamos cada semana en pequeños batches para preservar las notas de cata vivas y su terroir de origen.
            </p>
            <div class="flex items-center gap-3 pt-2">
              <span class="text-xs font-mono px-2.5 py-1 rounded bg-white/10 border border-white/15">
                ☕ 100% Arábica
              </span>
              <span class="text-xs font-mono px-2.5 py-1 rounded bg-white/10 border border-white/15">
                🌱 Direct Trade
              </span>
              <span class="text-xs font-mono px-2.5 py-1 rounded bg-white/10 border border-white/15">
                ★ SCA Member
              </span>
            </div>
          </div>

          <!-- Quick Navigation -->
          <div>
            <h4 class="font-display font-bold text-sm text-koko-gold uppercase tracking-wider mb-4">
              Cosechas & Tienda
            </h4>
            <ul class="space-y-2.5 text-xs text-koko-cream/70">
              <li><a href="#productos" class="hover:text-white transition-colors">Granos de Altura</a></li>
              <li><a href="#productos" class="hover:text-white transition-colors">Ediciones Limitadas</a></li>
              <li><a href="#productos" class="hover:text-white transition-colors">Procesos Anaeróbicos</a></li>
              <li><a href="#productos" class="hover:text-white transition-colors">Packs de Degustación</a></li>
            </ul>
          </div>

          <!-- Brewing Guides -->
          <div>
            <h4 class="font-display font-bold text-sm text-koko-gold uppercase tracking-wider mb-4">
              Extracción
            </h4>
            <ul class="space-y-2.5 text-xs text-koko-cream/70">
              <li><a href="#recetas" class="hover:text-white transition-colors">Método V60 Dripper</a></li>
              <li><a href="#recetas" class="hover:text-white transition-colors">Guía Chemex</a></li>
              <li><a href="#recetas" class="hover:text-white transition-colors">Aeropress Invertido</a></li>
              <li><a href="#recetas" class="hover:text-white transition-colors">Calculadora de Ratios</a></li>
            </ul>
          </div>

          <!-- Newsletter for Baristas -->
          <div>
            <h4 class="font-display font-bold text-sm text-koko-gold uppercase tracking-wider mb-4">
              Boletín del Barista
            </h4>
            <p class="text-xs text-koko-cream/70 mb-3">
              Recibe avisos de nuevos microlotes tostados y guías exclusivas de cata.
            </p>
            <form (submit)="$event.preventDefault()" class="space-y-2">
              <input
                nbInput
                type="email"
                placeholder="tu@correo.com"
                class="w-full text-xs text-koko-espresso bg-white placeholder:text-koko-muted"
                aria-label="Correo para el boletín"
              />
              <button
                nbButton
                tone="primary"
                size="sm"
                class="w-full font-bold text-xs"
                type="submit"
              >
                Suscribirme
              </button>
            </form>
          </div>
        </div>

        <!-- Bottom Copyright -->
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-koko-cream/50 gap-4 font-mono">
          <p>© 2026 KOKOFEE Specialty Coffee Lab. Todos los derechos reservados.</p>
          <div class="flex gap-6">
            <span class="hover:text-white cursor-pointer transition-colors">Privacidad</span>
            <span class="hover:text-white cursor-pointer transition-colors">Términos de Envío</span>
            <span class="hover:text-white cursor-pointer transition-colors">Trazabilidad</span>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
