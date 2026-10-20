import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NbInput, NbLabel, NbInputGroup, NbInputPrefix, NbInputSuffix } from '@ng-brutalism/ui';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NbInput, NbLabel, NbInputGroup, NbInputPrefix, NbInputSuffix, LucideAngularModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-1.5 w-full">
      @if (label()) {
        <label nbLabel [attr.for]="id()" class="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <span>{{ label() }}</span>
          @if (required()) {
            <span class="text-red-500 text-xs">*</span>
          }
        </label>
      }

      <nb-input-group class="w-full" [class.!border-red-500]="hasError()">
        @if (prefix()) {
          <span nbInputPrefix class="font-mono font-bold">{{ prefix() }}</span>
        } @else if (prefixIcon()) {
          <span nbInputPrefix class="inline-flex items-center justify-center text-koko-espresso/70 select-none">
            <lucide-icon [img]="prefixIcon()!" [size]="16" [strokeWidth]="2.5" />
          </span>
        }

        <input
          nbInput
          [id]="id()"
          [type]="type()"
          [placeholder]="placeholder()"
          [autocomplete]="autocomplete()"
          [disabled]="disabled()"
          [value]="value()"
          (input)="handleInput($event)"
          (blur)="handleBlur()"
          [attr.aria-invalid]="hasError()"
          [attr.aria-describedby]="hasError() ? id() + '-error' : hint() ? id() + '-hint' : null"
        />

        @if (suffix()) {
          <span nbInputSuffix class="font-mono font-bold">{{ suffix() }}</span>
        } @else if (suffixIcon()) {
          <span nbInputSuffix class="inline-flex items-center justify-center text-koko-espresso/70 select-none">
            <lucide-icon [img]="suffixIcon()!" [size]="16" [strokeWidth]="2.5" />
          </span>
        }
      </nb-input-group>

      @if (hasError()) {
        <p [id]="id() + '-error'" class="text-xs font-bold text-red-500 flex items-center gap-1 mt-0.5 animate-in fade-in duration-150" role="alert">
          <span>⚠</span>
          <span>{{ errorMessage() }}</span>
        </p>
      } @else if (hint()) {
        <p [id]="id() + '-hint'" class="text-[11px] text-koko-muted">
          {{ hint() }}
        </p>
      }
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly id = input<string>('input-' + Math.random().toString(36).substring(2, 9));
  readonly autocomplete = input<string>('off');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  readonly required = input<boolean>(false);
  readonly isInvalid = input<boolean>(false);
  readonly isTouched = input<boolean>(false);
  readonly prefix = input<string>('');
  readonly suffix = input<string>('');
  readonly prefixIcon = input<LucideIconData | null>(null);
  readonly suffixIcon = input<LucideIconData | null>(null);

  protected readonly value = signal<string>('');
  protected readonly disabled = signal<boolean>(false);

  readonly hasError = computed(
    () => (this.isInvalid() && this.isTouched()) || (!!this.errorMessage() && this.isTouched())
  );

  protected onChange: (val: string) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(val: unknown): void {
    this.value.set(val != null ? String(val) : '');
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  handleBlur(): void {
    this.onTouched();
  }
}
