import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full bg-white border-2 border-koko-espresso rounded-xl shadow-[4px_4px_0px_#1A120B] overflow-hidden flex flex-col">
      <!-- Optional Table Title Bar -->
      @if (title()) {
        <div class="px-5 py-4 border-b-2 border-koko-espresso bg-koko-cream/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 class="font-display font-bold text-base text-koko-espresso">
              {{ title() }}
            </h3>
            @if (subtitle()) {
              <p class="text-xs text-koko-muted font-sans mt-0.5">
                {{ subtitle() }}
              </p>
            }
          </div>
          <ng-content select="[table-actions]" />
        </div>
      }

      <!-- Responsive Table Scroll Area -->
      <div class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse text-xs sm:text-sm">
          @if (headers().length > 0) {
            <thead class="bg-koko-espresso text-koko-cream font-mono uppercase text-[11px] tracking-wider border-b-2 border-koko-espresso select-none">
              <tr>
                @for (header of headers(); track header) {
                  <th scope="col" class="py-3 px-4 font-bold">
                    {{ header }}
                  </th>
                }
              </tr>
            </thead>
          }

          <tbody class="divide-y divide-koko-border-subtle bg-white">
            @if (isLoading()) {
              <tr>
                <td [attr.colspan]="headers().length || 5" class="py-12 text-center text-koko-muted">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <span class="inline-block w-6 h-6 border-3 border-koko-caramel border-t-transparent rounded-full animate-spin"></span>
                    <span class="font-mono text-xs font-bold">Cargando registros...</span>
                  </div>
                </td>
              </tr>
            } @else if (isEmpty()) {
              <tr>
                <td [attr.colspan]="headers().length || 5" class="py-12 text-center text-koko-muted">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <span class="text-3xl">📋</span>
                    <span class="font-bold text-sm text-koko-espresso">{{ emptyMessage() }}</span>
                  </div>
                </td>
              </tr>
            } @else {
              <ng-content select="[table-rows]" />
            }
          </tbody>
        </table>
      </div>

      <!-- Optional Table Footer -->
      <ng-content select="[table-footer]" />
    </div>
  `,
})
export class DataTableComponent {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly headers = input<string[]>([]);
  readonly isLoading = input<boolean>(false);
  readonly isEmpty = input<boolean>(false);
  readonly emptyMessage = input<string>('No se encontraron registros en este momento.');
}
