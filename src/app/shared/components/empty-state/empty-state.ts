import { Component, input } from '@angular/core';
import { NbDisplay, NbStack, NbSurface, NbText } from '@ng-brutalism/ui';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [NbDisplay, NbStack, NbSurface, NbText, LucideAngularModule],
  template: `
    <div nbSurface [attr.tone]="tone()" padding="xl" radius="xl" shadow="hard" border="strong"
         class="mx-auto max-w-md">
      <div nbStack gap="md" align="center" class="text-center">
        <span class="empty-state__icon">
          <lucide-icon [img]="icon()" [size]="32" [strokeWidth]="3" />
        </span>

        <h3 nbDisplay size="sm" class="uppercase">{{ title() }}</h3>
        <p nbText size="sm" weight="medium">{{ description() }}</p>

        <ng-content />
      </div>
    </div>
  `,
  styles: `
    .empty-state__icon {
      display: grid;
      width: 4.5rem;
      height: 4.5rem;
      place-items: center;
      border: 4px solid var(--nb-border);
      background: var(--nb-yellow);
      box-shadow: 5px 5px 0 0 var(--nb-shadow);
      animation: kk-float 2.4s ease-in-out infinite;
    }
    @keyframes kk-float {
      0%, 100% { transform: translateY(0) rotate(-3deg); }
      50%      { transform: translateY(-6px) rotate(3deg); }
    }
    @media (prefers-reduced-motion: reduce) {
      .empty-state__icon { animation: none; }
    }
  `,
})
export class EmptyStateComponent {
  readonly icon = input.required<LucideIconData>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly tone = input<string>('lavender');
}