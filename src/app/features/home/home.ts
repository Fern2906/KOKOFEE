import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  NbButton,
  NbMarquee,
  NbMarqueeItem,
  NbMediaFrame,
} from '@ng-brutalism/ui';
import { NavbarComponent } from '../../layouts/public-layout/navbar/navbar';
import { FooterComponent } from '../../layouts/public-layout/footer/footer';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card';
import { ReviewCardComponent } from '../../shared/components/review-card/review-card';
import { ProductService } from '../../core/services/product.service';
import { RecipeService } from '../../core/services/recipe.service';
import { ReviewService } from '../../core/services/review.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { Recipe } from '../../core/models/recipe.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NbButton,
    NbMarquee,
    NbMarqueeItem,
    NbMediaFrame,
    NavbarComponent,
    FooterComponent,
    ProductCardComponent,
    RecipeCardComponent,
    ReviewCardComponent,
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-koko-cream text-koko-espresso">
      <!-- Reusable Navigation -->
      <app-navbar />

      <main class="flex-1">
        <!-- ============================================================== -->
        <!-- 1. EDITORIAL HERO SECTION                                      -->
        <!-- ============================================================== -->
        <section class="relative overflow-hidden border-b-2 border-koko-espresso bg-koko-cream py-12 md:py-20 lg:py-24">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <!-- Left Column: Editorial Headline & Actions -->
              <div class="lg:col-span-7 space-y-6">
                <!-- Live Freshness Pill -->
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-koko-espresso bg-white shadow-[2px_2px_0px_#1A120B]">
                  <span class="w-2 h-2 rounded-full bg-koko-caramel animate-ping"></span>
                  <span class="text-xs font-mono font-bold tracking-wide uppercase text-koko-espresso">
                    Lote #08 Tostado Hace 48h
                  </span>
                </div>

                <!-- Main Display Headline -->
                <h1 class="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-koko-espresso leading-[1.08]">
                  Café de especialidad con alma de origen y
                  <span class="underline decoration-koko-caramel decoration-wavy decoration-4 text-koko-roast">
                    tueste maestro.
                  </span>
                </h1>

                <!-- Brief Sensory Description -->
                <p class="text-base sm:text-lg text-koko-coffee/90 max-w-2xl leading-relaxed font-sans">
                  Curamos cosechas de microfincas a más de 1,700 metros de altura. Revelamos la acidez viva, el dulzor natural y los aromas florales únicos de cada variedad sin enmascarar su terroir.
                </p>

                <!-- Primary & Secondary CTAs -->
                <div class="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="#productos"
                    nbButton
                    tone="primary"
                    size="lg"
                    class="font-bold flex items-center gap-2 text-base px-6 shadow-[4px_4px_0px_#1A120B] hover:shadow-[2px_2px_0px_#1A120B]"
                  >
                    <span>Explorar Granos</span>
                    <span>→</span>
                  </a>

                  <a
                    href="#recetas"
                    nbButton
                    tone="cream"
                    size="lg"
                    class="font-bold flex items-center gap-2 text-base px-6 shadow-[3px_3px_0px_#1A120B]"
                  >
                    <span>Guías de Extracción</span>
                    <span>☕</span>
                  </a>
                </div>

                <!-- Verified Key Metrics with nb-stat -->
                <div class="pt-8 grid grid-cols-3 gap-4 border-t-2 border-koko-espresso/15">
                  <div class="p-3 bg-white border-2 border-koko-espresso rounded-lg shadow-[2px_2px_0px_#1A120B]">
                    <div class="font-display font-black text-2xl sm:text-3xl text-koko-espresso">88.5+</div>
                    <div class="text-[11px] font-mono text-koko-muted uppercase tracking-wider mt-0.5">Puntos SCA</div>
                  </div>
                  <div class="p-3 bg-white border-2 border-koko-espresso rounded-lg shadow-[2px_2px_0px_#1A120B]">
                    <div class="font-display font-black text-2xl sm:text-3xl text-koko-espresso">100%</div>
                    <div class="text-[11px] font-mono text-koko-muted uppercase tracking-wider mt-0.5">Trazabilidad</div>
                  </div>
                  <div class="p-3 bg-white border-2 border-koko-espresso rounded-lg shadow-[2px_2px_0px_#1A120B]">
                    <div class="font-display font-black text-2xl sm:text-3xl text-koko-espresso">0 intermediarios</div>
                    <div class="text-[11px] font-mono text-koko-muted uppercase tracking-wider mt-0.5">Direct Trade</div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Tactile Photo Composition -->
              <div class="lg:col-span-5 relative">
                <!-- Decorative Neo-Brutalist Frame -->
                <div class="relative bg-white border-3 border-koko-espresso rounded-2xl p-3 shadow-[8px_8px_0px_#1A120B] transition-transform duration-300 hover:-translate-y-1">
                  <div nbMediaFrame ratio="4/3" class="rounded-xl overflow-hidden border-2 border-koko-espresso">
                    <img
                      src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop"
                      alt="Tueste y preparación artesanal de café en KOKOFEE"
                      class="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>

                  <!-- Floating Roaster Badge -->
                  <div class="absolute -bottom-5 -left-4 bg-koko-espresso text-koko-cream p-3 rounded-xl border-2 border-koko-espresso shadow-[4px_4px_0px_#C25E00] flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-koko-caramel flex items-center justify-center text-xl">
                      🔥
                    </div>
                    <div>
                      <div class="text-xs font-bold font-display uppercase tracking-wider text-koko-gold">
                        Tostaduría Urbana
                      </div>
                      <div class="text-[11px] text-koko-cream/80 font-mono">
                        Curvas de tueste por micro-lote
                      </div>
                    </div>
                  </div>

                  <!-- Floating Origin Tag -->
                  <div class="absolute -top-3 -right-3 bg-koko-cream border-2 border-koko-espresso px-3 py-1 rounded-full text-xs font-mono font-bold shadow-[2px_2px_0px_#1A120B]">
                    🌱 Cosecha 2026
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============================================================== -->
        <!-- 2. ARTISANAL MARQUEE TICKER                                   -->
        <!-- ============================================================== -->
        <div class="bg-koko-roast text-koko-cream border-b-2 border-koko-espresso py-3 overflow-hidden select-none">
          <nb-marquee duration="28s" [pauseOnHover]="true">
            <nb-marquee-item class="flex items-center gap-8 text-xs font-mono font-bold tracking-widest uppercase">
              <span>★ Tueste Semanal Garantizado</span>
              <span>•</span>
              <span>100% Granos Arábica de Altura</span>
              <span>•</span>
              <span>Envíos Gratis a partir de $45</span>
              <span>•</span>
              <span>Perfilado de Cata por Q-Graders</span>
              <span>•</span>
              <span>Molienda a Medida o Grano Entero</span>
              <span>•</span>
              <span>Empaque con Válvula Desgasificadora</span>
              <span>•</span>
            </nb-marquee-item>
          </nb-marquee>
        </div>

        <!-- ============================================================== -->
        <!-- 3. FEATURED PRODUCTS SECTION                                   -->
        <!-- ============================================================== -->
        <section id="productos" class="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Section Header -->
          <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b-2 border-koko-espresso/20 gap-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="w-3 h-3 rounded-full bg-koko-caramel"></span>
                <span class="text-xs font-mono uppercase tracking-widest font-bold text-koko-caramel">
                  Cosechas Exclusivas
                </span>
              </div>
              <h2 class="font-display font-black text-3xl sm:text-4xl text-koko-espresso">
                Granos Destacados de la Semana
              </h2>
              <p class="text-sm text-koko-coffee/80 mt-1 max-w-xl">
                Selección de microlotes calificados por encima de 87 puntos SCA. Disponibles hasta agotar existencias de cosecha.
              </p>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-xs font-mono text-koko-muted">
                {{ productService.featuredProducts().length }} microlotes disponibles
              </span>
            </div>
          </div>

          <!-- Products Grid or Empty State -->
          @if (productService.featuredProducts().length > 0) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (product of productService.featuredProducts(); track product.id) {
                <app-product-card
                  [product]="product"
                  (addToCart)="onAddToCart($event)"
                />
              }
            </div>
          } @else {
            <!-- Accessible Empty State -->
            <div class="bg-white border-2 border-dashed border-koko-espresso rounded-xl p-12 text-center max-w-md mx-auto space-y-4">
              <div class="text-4xl">☕</div>
              <h3 class="font-display font-bold text-lg text-koko-espresso">
                Cosechas en periodo de reposo
              </h3>
              <p class="text-xs text-koko-coffee/70">
                Estamos tostando el siguiente lote fresco este lunes. Suscríbete para recibir notificación de reapertura.
              </p>
            </div>
          }
        </section>

        <!-- ============================================================== -->
        <!-- 4. BRAND STORY & CRAFT MANIFESTO (Non-card asymmetrical layout) -->
        <!-- ============================================================== -->
        <section id="manifiesto" class="bg-koko-espresso text-koko-cream py-16 md:py-24 border-y-2 border-koko-roast">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <!-- Left: Craft Imagery with Overlaid Elements -->
              <div class="lg:col-span-5 relative">
                <div class="border-3 border-koko-cream/30 rounded-2xl overflow-hidden shadow-[8px_8px_0px_#C25E00]">
                  <div nbMediaFrame ratio="4/3">
                    <img
                      src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=800&auto=format&fit=crop"
                      alt="Manos seleccionando granos de café verde en beneficio húmedo"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                <!-- Floating Roaster Quote -->
                <div class="mt-4 p-4 bg-koko-roast border-2 border-koko-cream/20 rounded-xl">
                  <p class="text-xs italic text-koko-cream/90 leading-relaxed">
                    “El buen café no necesita azúcar ni disfraces. Solo necesita respeto por la altitud, el suelo y la mano que lo cosechó.”
                  </p>
                  <div class="mt-2 text-[11px] font-mono text-koko-gold font-bold">
                    — Fernando Alarcón, Maestro Tostador en KOKOFEE
                  </div>
                </div>
              </div>

              <!-- Right: Craft Pillars -->
              <div class="lg:col-span-7 space-y-6">
                <div class="inline-block px-3 py-1 rounded bg-white/10 text-koko-gold font-mono text-xs font-bold uppercase tracking-widest border border-white/15">
                  Nuestro Manifiesto
                </div>

                <h2 class="font-display font-black text-3xl sm:text-4xl text-white leading-tight">
                  No vendemos café genérico.
                  <span class="text-koko-caramel block">Honramos el trabajo del caficultor.</span>
                </h2>

                <p class="text-sm text-koko-cream/80 leading-relaxed">
                  En la industria tradicional, el café se tuesta de forma oscura para homogeneizar granos viejos o defectuosos. En KOKOFEE hacemos exactamente lo opuesto: desarrollamos curvas de tueste por perfil térmico para preservar los azúcares naturales del mucílago y la acidez viva del grano de altura.
                </p>

                <!-- 3 Pillars Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div class="p-4 bg-white/5 border border-white/15 rounded-xl space-y-2">
                    <div class="text-2xl">🌱</div>
                    <h3 class="font-display font-bold text-sm text-white">Comercio Directo</h3>
                    <p class="text-xs text-koko-cream/70 leading-normal">
                      Pagamos hasta un 65% por encima del precio bursátil a los caficultores de origen.
                    </p>
                  </div>

                  <div class="p-4 bg-white/5 border border-white/15 rounded-xl space-y-2">
                    <div class="text-2xl">🔬</div>
                    <h3 class="font-display font-bold text-sm text-white">Curva de Tueste</h3>
                    <p class="text-xs text-koko-cream/70 leading-normal">
                      Monitoreamos temperatura de grano y RoR segundo a segundo en cada microlote.
                    </p>
                  </div>

                  <div class="p-4 bg-white/5 border border-white/15 rounded-xl space-y-2">
                    <div class="text-2xl">📦</div>
                    <h3 class="font-display font-bold text-sm text-white">Frescura Absoluta</h3>
                    <p class="text-xs text-koko-cream/70 leading-normal">
                      Empacado dentro de las 24 horas posteriores al reposo de tostado con válvula unidireccional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============================================================== -->
        <!-- 5. BREWING GUIDES & RECIPES SECTION                            -->
        <!-- ============================================================== -->
        <section id="recetas" class="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b-2 border-koko-espresso/20 gap-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="w-3 h-3 rounded-full bg-koko-caramel"></span>
                <span class="text-xs font-mono uppercase tracking-widest font-bold text-koko-caramel">
                  Barismo en Casa
                </span>
              </div>
              <h2 class="font-display font-black text-3xl sm:text-4xl text-koko-espresso">
                Guías de Extracción Recomendadas
              </h2>
              <p class="text-sm text-koko-coffee/80 mt-1 max-w-xl">
                Aprende los ratios, moliendas y temperaturas exactas para despertar las notas de cata ocultas en tu grano.
              </p>
            </div>

            <div>
              <button
                nbButton
                tone="cream"
                size="sm"
                class="font-bold flex items-center gap-1.5 font-mono text-xs"
              >
                <span>Ver Todas las Guías</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <!-- Recipe Cards Grid or Empty State -->
          @if (recipeService.recipes().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              @for (recipe of recipeService.recipes(); track recipe.id) {
                <app-recipe-card
                  [recipe]="recipe"
                  (viewRecipe)="onViewRecipe($event)"
                />
              }
            </div>
          } @else {
            <div class="bg-white border-2 border-dashed border-koko-espresso rounded-xl p-8 text-center max-w-md mx-auto">
              <p class="text-xs text-koko-coffee/70">No hay recetas disponibles temporalmente.</p>
            </div>
          }
        </section>

        <!-- ============================================================== -->
        <!-- 6. COMMUNITY & RECENT REVIEWS SECTION                           -->
        <!-- ============================================================== -->
        <section id="resenas" class="py-16 md:py-24 bg-koko-cream/70 border-t-2 border-koko-espresso/15">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-2xl mx-auto mb-12">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-koko-espresso text-xs font-mono font-bold text-koko-caramel mb-3">
                ★ 4.9/5 Promedio de Satisfacción
              </div>
              <h2 class="font-display font-black text-3xl sm:text-4xl text-koko-espresso">
                Lo que dicen Baristas y Clientes
              </h2>
              <p class="text-sm text-koko-coffee/80 mt-2">
                Reseñas verificadas de apasionados del café de especialidad que confían en nuestras cosechas.
              </p>
            </div>

            <!-- Reviews Grid or Empty State -->
            @if (reviewService.reviews().length > 0) {
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                @for (review of reviewService.reviews(); track review.id) {
                  <app-review-card [review]="review" />
                }
              </div>
            } @else {
              <div class="bg-white border-2 border-dashed border-koko-espresso rounded-xl p-8 text-center max-w-md mx-auto">
                <p class="text-xs text-koko-coffee/70">Aún no hay reseñas publicadas para este lote.</p>
              </div>
            }
          </div>
        </section>

        <!-- ============================================================== -->
        <!-- 7. FINAL STORE CTA BANNER                                      -->
        <!-- ============================================================== -->
        <section class="bg-koko-roast text-koko-cream border-t-2 border-koko-espresso py-16 md:py-20 relative overflow-hidden">
          <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <span class="inline-block px-3 py-1 bg-koko-caramel text-white font-mono text-xs font-black uppercase tracking-widest rounded shadow-[2px_2px_0px_#1A120B]">
              Tu Ritual Merece el Mejor Café
            </span>

            <h2 class="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              ¿Listo para dar el salto al café de especialidad?
            </h2>

            <p class="text-sm sm:text-base text-koko-cream/80 max-w-2xl mx-auto leading-relaxed">
              Elige tu método favorito (espresso, filtro o prensa) y te recomendamos el grano con el perfil de tueste y molienda ideal para ti.
            </p>

            <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href="#productos"
                nbButton
                tone="primary"
                size="lg"
                class="font-bold text-base px-8 shadow-[4px_4px_0px_#1A120B] hover:shadow-[2px_2px_0px_#1A120B]"
              >
                Comprar Café Fresco Ahora
              </a>

              <a
                routerLink="/admin"
                nbButton
                tone="cream"
                size="lg"
                class="font-bold text-base px-6 shadow-[3px_3px_0px_#1A120B]"
              >
                Ir al Panel Administrativo ⚙
              </a>
            </div>

            <!-- Guarantee Note -->
            <p class="text-xs text-koko-cream/60 font-mono pt-4">
              🛡 Garantía KOKOFEE: Si no notas la diferencia frente al café comercial, te devolvemos tu dinero.
            </p>
          </div>
        </section>
      </main>

      <!-- Reusable Footer -->
      <app-footer />
    </div>
  `,
})
export class HomePage {
  readonly productService = inject(ProductService);
  readonly recipeService = inject(RecipeService);
  readonly reviewService = inject(ReviewService);
  readonly cartService = inject(CartService);

  onAddToCart(product: Product): void {
    this.cartService.addItem(product, 1);
  }

  onViewRecipe(recipe: Recipe): void {
    // Smooth scroll to recipe detail or future modal
    console.log('Selected recipe:', recipe.title);
  }
}
