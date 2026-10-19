import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable slide-over / centered modal shell.
 * Wrap your content with this component and project it via ng-content.
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Backdrop -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      [attr.aria-modal]="true"
      [attr.aria-labelledby]="'modal-title-' + modalId()"
    >
      <!-- Dark overlay -->
      <div
        class="absolute inset-0 bg-koko-espresso/60 backdrop-blur-sm"
        (click)="closeOnBackdrop() && close.emit()"
      ></div>

      <!-- Panel -->
      <div
        class="relative z-10 w-full bg-white border-2 border-koko-espresso rounded-2xl shadow-[6px_6px_0px_#1A120B] flex flex-col max-h-[92dvh] animate-in fade-in zoom-in-95 duration-200"
        [class]="maxWidthClass()"
      >
        <!-- Header -->
        <div class="flex items-start justify-between gap-3 px-6 py-4 border-b-2 border-koko-espresso/20 shrink-0">
          <div>
            @if (tag()) {
              <span class="text-[10px] font-mono uppercase tracking-widest font-bold text-koko-caramel">
                {{ tag() }}
              </span>
            }
            <h2
              [id]="'modal-title-' + modalId()"
              class="font-display font-black text-lg text-koko-espresso leading-tight mt-0.5"
            >
              {{ title() }}
            </h2>
          </div>
          <button
            type="button"
            (click)="close.emit()"
            class="shrink-0 mt-0.5 w-8 h-8 rounded-lg border-2 border-koko-espresso bg-koko-cream text-koko-espresso font-bold hover:bg-koko-espresso hover:text-koko-cream transition-colors flex items-center justify-center text-base"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="overflow-y-auto flex-1 px-6 py-5">
          <ng-content />
        </div>

        <!-- Footer slot -->
        @if (showFooter()) {
          <div class="shrink-0 px-6 py-4 border-t-2 border-koko-espresso/20 bg-koko-cream/40 rounded-b-2xl">
            <ng-content select="[modal-footer]" />
          </div>
        }
      </div>
    </div>
  `,
})
export class ModalComponent {
  readonly title       = input<string>('');
  readonly tag         = input<string>('');
  readonly maxWidthClass = input<string>('max-w-2xl');
  readonly showFooter  = input<boolean>(true);
  readonly closeOnBackdrop = input<boolean>(true);
  /** Unique ID for ARIA – defaults to random string. */
  readonly modalId     = input<string>(Math.random().toString(36).substring(2, 8));

  readonly close = output<void>();
}
