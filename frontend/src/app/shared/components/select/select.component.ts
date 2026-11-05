import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NbLabel, NbSelect, NbSelectOption, NbSelectValue } from '@ng-brutalism/ui';

export interface SelectOption {
  value: NbSelectValue;
  label: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NbLabel, NbSelect, NbSelectOption],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-1.5 w-full">
      @if (label()) {
        <label [id]="id() + '-label'" nbLabel
          class="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <span>{{ label() }}</span>
          @if (required()) {
            <span class="text-red-500 text-xs">*</span>
          }
        </label>
      }

      <nb-select
        [id]="id()"
        [placeholder]="placeholder()"
        [value]="value()"
        [disabled]="disabled()"
        [aria-labelledby]="label() ? id() + '-label' : null"
        [class.!border-red-500]="hasError()"
        (valueChange)="handleChange($event)"
        (focusout)="handleBlur()"
      >
        @for (option of options(); track option.value) {
          <nb-select-option [value]="option.value" [label]="option.label">
            {{ option.label }}
          </nb-select-option>
        }
      </nb-select>

      @if (hasError()) {
        <p [id]="id() + '-error'"
          class="text-xs font-bold text-red-500 flex items-center gap-1 mt-0.5 animate-in fade-in duration-150"
          role="alert">
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
export class SelectComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly placeholder = input<string>('Selecciona una opción');
  readonly id = input<string>('select-' + Math.random().toString(36).substring(2, 9));
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  readonly required = input<boolean>(false);
  readonly isInvalid = input<boolean>(false);
  readonly isTouched = input<boolean>(false);
  readonly options = input<SelectOption[]>([]);

  protected readonly value = signal<NbSelectValue | null>(null);
  protected readonly disabled = signal<boolean>(false);

  readonly hasError = computed(
    () => (this.isInvalid() && this.isTouched()) || (!!this.errorMessage() && this.isTouched())
  );

  protected onChange: (val: NbSelectValue | null) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(val: unknown): void {
    this.value.set(val != null && val !== '' ? (val as NbSelectValue) : null);
  }

  registerOnChange(fn: (val: NbSelectValue | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  handleChange(value: NbSelectValue | null): void {
    this.value.set(value);
    this.onChange(value ?? '');
  }

  handleBlur(): void {
    this.onTouched();
  }
}
