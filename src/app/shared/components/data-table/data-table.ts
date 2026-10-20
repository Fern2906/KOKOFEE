import {
  Component, Directive, TemplateRef, computed, contentChildren, inject, input,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export interface TableColumn<T> {
  key: string;
  header: string;
  class?: string;
  value?: (row: T) => string | number | null | undefined;
}

@Directive({ selector: 'ng-template[appCell]', standalone: true })
export class DataTableCellDirective {
  readonly key = input.required<string>({ alias: 'appCell' });
  readonly template = inject(TemplateRef);
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <div class="w-full overflow-hidden flex flex-col">
      @if (heading()) {
        <div class="px-5 py-4 border-b-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 class="font-display font-bold text-base text-koko-espresso">{{ heading() }}</h3>
            @if (subtitle()) {
              <p class="text-xs font-sans mt-0.5">{{ subtitle() }}</p>
            }
          </div>
          <ng-content select="[table-actions]" />
        </div>
      }

      <div class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse text-xs sm:text-sm">
          <thead class="font-mono uppercase text-xs tracking-wider border-b-2 select-none">
            <tr>
              @for (col of columns(); track col.key) {
                <th scope="col" class="py-3 px-4 font-bold">{{ col.header }}</th>
              }
            </tr>
          </thead>

          <tbody class="divide-y">
            @if (isLoading()) {
              <tr>
                <td [attr.colspan]="columns().length" class="py-12 text-center text-koko-muted">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <span class="inline-block w-6 h-6 border-3 border-koko-caramel border-t-transparent rounded-full animate-spin"></span>
                    <span class="font-mono text-xs font-bold">Cargando registros...</span>
                  </div>
                </td>
              </tr>
            } @else if (rows().length === 0) {
              <tr>
                <td [attr.colspan]="columns().length" class="py-12 text-center text-koko-muted">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <span class="text-3xl" aria-hidden="true">📋</span>
                    <span class="font-bold text-sm text-koko-espresso">{{ emptyMessage() }}</span>
                  </div>
                </td>
              </tr>
            } @else {
              @for (row of rows(); track rowId()(row); let i = $index) {
                <tr class="hover:bg-koko-cream/40 transition-colors">
                  @for (col of columns(); track col.key) {
                    <td class="py-3 px-4" [class]="col.class ?? ''">
                      @let tpl = cellTemplates().get(col.key);
                      @if (tpl) {
                        <ng-container
                          [ngTemplateOutlet]="tpl"
                          [ngTemplateOutletContext]="{ $implicit: row, index: i }"
                        />
                      } @else {
                        {{ cellValue(row, col) }}
                      }
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <ng-content select="[table-footer]" />
    </div>
  `,
})
export class DataTableComponent<T = any> {
  readonly heading = input<string>('');
  readonly subtitle = input<string>('');
  readonly columns = input.required<TableColumn<T>[]>();
  readonly rows = input<T[]>([]);
  readonly isLoading = input<boolean>(false);
  readonly emptyMessage = input<string>('No se encontraron registros en este momento.');
  readonly rowId = input<(row: T) => unknown>((row) => (row as any).id ?? row);

  private readonly cells = contentChildren(DataTableCellDirective);
  protected readonly cellTemplates = computed(
    () => new Map(this.cells().map((c) => [c.key(), c.template])),
  );

  protected cellValue(row: T, col: TableColumn<T>) {
    return col.value ? col.value(row) : (row as any)[col.key];
  }
}
