import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NbInput, NbLabel } from '@ng-brutalism/ui';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NbInput, NbLabel],
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
        <label
          nbLabel
          [attr.for]="id()"
          class="font-display text-xs font-bold uppercase tracking-wider text-koko-espresso flex items-center justify-between"
        >
          <span>{{ label() }}</span>
          @if (required()) {
            <span class="text-koko-caramel text-xs">*</span>
          }
        </label>
      }

      <div class="relative">
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
          class="w-full text-sm font-medium transition-all px-3.5 py-2.5 rounded-lg border-2 bg-white disabled:bg-koko-cream/60 disabled:cursor-not-allowed"
          [class.border-koko-danger]="hasError()"
          [class.border-koko-espresso]="!hasError()"
          [class.shadow-[2px_2px_0px_#D90429]]="hasError()"
          [class.shadow-[2px_2px_0px_#1A120B]]="!hasError()"
          [class.focus:shadow-[3px_3px_0px_#C25E00]]="!hasError()"
          [attr.aria-invalid]="hasError()"
          [attr.aria-describedby]="hasError() ? id() + '-error' : hint() ? id() + '-hint' : null"
        />
      </div>

      <!-- Hint or Validation Error Message -->
      @if (hasError()) {
        <p [id]="id() + '-error'" class="text-xs font-bold text-koko-danger flex items-center gap-1 mt-0.5 animate-in fade-in duration-150" role="alert">
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
