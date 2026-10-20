import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NbChip, NbCluster, NbDisplay, NbSplit, NbStack, NbStatusDot, NbText, NbButton, NbMarquee, NbMarqueeItem, NbMediaFrame, NbSticker, NbStickerFace, NbSurface } from '@ng-brutalism/ui';
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
import {
  LucideAngularModule,
  ArrowRight, Coffee, Award, Route, Handshake, Flame, Mountain, Sprout, BellRing, Package
} from 'lucide-angular';
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
    NbSticker,
    NbStickerFace,
    NbSurface,
    NbChip,
    NbCluster,
    NbDisplay,
    NbSplit,
    NbStack,
    NbStatusDot,
    NbText,
    NbMarqueeItem,
    LucideAngularModule
  ],
  templateUrl: 'home.html',
  styleUrls: ['./home.css']
})
export class HomePage {
  readonly productService = inject(ProductService);
  readonly recipeService = inject(RecipeService);
  readonly reviewService = inject(ReviewService);
  readonly cartService = inject(CartService);
  readonly icons = { ArrowRight, Coffee, Award, Route, Handshake, Flame, Mountain, Sprout, BellRing, Package };


  onAddToCart(product: Product): void {
    this.cartService.addItem(product, 1);
  }

  onViewRecipe(recipe: Recipe): void {
    // Smooth scroll to recipe detail or future modal
    console.log('Selected recipe:', recipe.title);
  }
}
