import { Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { NbStat, NbTone, NbSurface } from '@ng-brutalism/ui';
@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [LucideAngularModule, NbStat, NbSurface],
  template: `
    <div nbSurface [tone]="tone()" class="relative h-full">
      @if (icon()) {
        <lucide-icon [name]="icon()!" class="absolute top-3 right-3 w-5 h-5 stroke-[2.5] text-black"/>
      }
      <nb-stat label="{{title()}}" value="{{value()}}" class="font-display"/>
    </div>
  `,
})
export class StatCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string>();
  readonly icon = input<string>();
  readonly tone = input<NbTone>('primary');
}
