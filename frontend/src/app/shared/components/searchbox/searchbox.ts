import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbInput, NbInputGroup, NbInputPrefix, NbLabel } from '@ng-brutalism/ui';
import { LucideAngularModule, Search } from 'lucide-angular';

@Component({
  selector: 'app-searchbox',
  standalone: true,
  imports: [
    CommonModule,
    NbInput,
    NbInputGroup,
    NbInputPrefix,
    NbLabel,
    LucideAngularModule,
  ],
  host: {
    class: 'block',
  },
  template: `
    <div class="flex flex-col w-full" [class.gap-1.5]="label()">
      @if (label()) {
        <label nbLabel [attr.for]="id()" class="text-[10px] font-black uppercase tracking-widest">
          {{ label() }}
        </label>
      }
      <nb-input-group class="w-full">
        <span nbInputPrefix class="inline-flex items-center justify-center">
          <lucide-icon [img]="icons.Search" [size]="16" [strokeWidth]="3" />
        </span>
        <input
          nbInput
          [id]="id()"
          type="search"
          [placeholder]="placeholder()"
          [value]="displayValue()"
          (input)="onInput($event)"
          [attr.aria-label]="ariaLabel() || placeholder() || 'Buscar'"
          class="w-full"
        />
      </nb-input-group>
    </div>
  `,
})
export class SearchboxComponent {
  readonly value = input<string>('');
  readonly search = input<string>('');
  readonly placeholder = input<string>('Buscar...');
  readonly label = input<string>('');
  readonly id = input<string>('searchbox-' + Math.random().toString(36).substring(2, 9));
  readonly ariaLabel = input<string>('');

  readonly searchChange = output<string>();
  readonly valueChange = output<string>();

  protected readonly icons = { Search };

  protected readonly displayValue = computed(() => this.value() || this.search() || '');

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchChange.emit(val);
    this.valueChange.emit(val);
  }
}

