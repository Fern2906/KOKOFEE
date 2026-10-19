import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="p-5 bg-white border-2 border-koko-espresso rounded-xl shadow-[3px_3px_0px_#1A120B] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1A120B] transition-all flex flex-col justify-between"
    >
      <!-- Top Row: Title and Icon -->
      <div class="flex items-center justify-between gap-3 mb-2">
        <span class="text-xs font-mono font-bold text-koko-muted uppercase tracking-wider">
          {{ title() }}
        </span>
        <div class="w-9 h-9 rounded-lg bg-koko-cream border-2 border-koko-espresso flex items-center justify-center text-lg shrink-0 shadow-[1px_1px_0px_#1A120B]">
          {{ icon() }}
        </div>
      </div>

      <!-- Main Value Display -->
      <div class="font-display font-black text-2xl sm:text-3xl text-koko-espresso tracking-tight my-1">
        {{ value() }}
      </div>

      <!-- Bottom Trend Indicator or Subtitle -->
      <div class="mt-2 pt-2 border-t border-koko-border-subtle flex items-center justify-between text-xs font-mono">
        @if (change()) {
          <div
            class="flex items-center gap-1 font-bold"
            [class.text-koko-sage]="changeType() === 'positive'"
            [class.text-koko-danger]="changeType() === 'negative'"
            [class.text-koko-muted]="changeType() === 'neutral'"
          >
            <span>
              {{ changeType() === 'positive' ? '↑' : changeType() === 'negative' ? '↓' : '•' }}
            </span>
            <span>{{ change() }}</span>
          </div>
        }

        @if (subtitle()) {
          <span class="text-koko-muted text-[11px] truncate">
            {{ subtitle() }}
          </span>
        }
      </div>
    </div>
  `,
})
export class StatCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string | number>();
  readonly icon = input<string>('📊');
  readonly change = input<string>('');
  readonly changeType = input<'positive' | 'negative' | 'neutral'>('positive');
  readonly subtitle = input<string>('');
}
