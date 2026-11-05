import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButton } from '@ng-brutalism/ui';

/**
 * Reusable confirmation dialog.
 * Renders a centered overlay asking the user to confirm a destructive action.
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, NbButton],
  template: `
    <div
      class="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      [attr.aria-labelledby]="'confirm-title'"
      [attr.aria-describedby]="'confirm-desc'"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-koko-espresso/70 backdrop-blur-sm"></div>

      <!-- Dialog Box -->
      <div class="relative z-10 w-full max-w-sm bg-white border-2 border-koko-espresso rounded-2xl shadow-[6px_6px_0px_#1A120B] p-6 animate-in fade-in zoom-in-95 duration-200">
        <!-- Danger Icon -->
        <div class="w-12 h-12 rounded-xl bg-red-50 border-2 border-koko-danger flex items-center justify-center text-2xl mb-4">
          🗑️
        </div>

        <h3 id="confirm-title" class="font-display font-black text-lg text-koko-espresso mb-2">
          {{ title() }}
        </h3>
        <p id="confirm-desc" class="text-sm text-koko-coffee/80 leading-relaxed mb-6">
          {{ message() }}
        </p>

        <div class="flex items-center justify-end gap-3">
          <button
            nbButton
            tone="cream"
            size="sm"
            type="button"
            (click)="cancelled.emit()"
            class="font-mono text-xs font-bold"
          >
            {{ cancelLabel() }}
          </button>
          <button
            nbButton
            tone="danger"
            size="sm"
            type="button"
            (click)="confirmed.emit()"
            class="font-mono text-xs font-bold shadow-[2px_2px_0px_#1A120B]"
          >
            {{ confirmLabel() }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  readonly title        = input<string>('Confirmar accion');
  readonly message      = input<string>('Esta accion no se puede deshacer. Deseas continuar?');
  readonly confirmLabel = input<string>('Eliminar');
  readonly cancelLabel  = input<string>('Cancelar');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
