import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NbChip, NbCluster, NbDisplay, NbSplit, NbStack, NbStatusDot, NbText, NbButton, NbMarquee, NbMarqueeItem, NbMediaFrame, NbSticker, NbStickerFace, NbSurface } from '@ng-brutalism/ui';
import { NavbarComponent } from '../../layouts/public-layout/navbar/navbar';
import { FooterComponent } from '../../layouts/public-layout/footer/footer';
import { ProductGridComponent } from '../../shared/components/product-grid/product-grid';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card';
import { ReviewCardComponent } from '../../shared/components/review-card/review-card';
import { ProductService } from '../../core/services/product.service';
import { RecipeService } from '../../core/services/recipe.service';
import { ReviewService } from '../../core/services/review.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { Recipe } from '../../core/models/recipe.model';
import {
  LucideAngularModule,
  ArrowRight, Coffee, Award,
  Route, Handshake, Flame,
  Mountain, Sprout, BellRing,
  Package, Heart, Quote,
  FlaskConical, PackageCheck, BookOpen,
  Star, MessageSquareQuote
} from 'lucide-angular';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,RouterLink,NbButton,
    NbMarquee,NbMarqueeItem,NbMediaFrame,
    NavbarComponent,FooterComponent,
    ProductGridComponent,RecipeCardComponent,ReviewCardComponent,
    NbSticker,NbStickerFace,NbSurface,NbChip,NbCluster,NbDisplay,
    NbSplit,NbStack,NbStatusDot,NbText,NbMarqueeItem,LucideAngularModule,
    SectionHeaderComponent,EmptyStateComponent
  ],
  templateUrl: 'home.html',
  styleUrls: ['./home.css']
})
export class HomePage {
  readonly productService = inject(ProductService);
  readonly recipeService = inject(RecipeService);
  readonly reviewService = inject(ReviewService);
  readonly cartService = inject(CartService);
  readonly icons = {
    ArrowRight, Coffee, Award,
    Route, Handshake, Flame,
    Mountain, Sprout, BellRing,
    Package, Heart, Quote,
    FlaskConical, PackageCheck, BookOpen,
    Star, MessageSquareQuote
  };


  onAddToCart(product: Product): void {
    this.cartService.addItem(product, 1);
  }

  onViewRecipe(recipe: Recipe): void {
    console.log('Selected recipe:', recipe.title);
  }
}
