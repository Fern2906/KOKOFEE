import {
  Component, Directive, TemplateRef, computed, contentChildren, inject, input,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NbSurface } from '@ng-brutalism/ui';
import { LucideAngularModule, ClipboardList, Loader } from 'lucide-angular';

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

/** Importa solo esto y tienes tabla + directiva */
export const DATA_TABLE = [] as unknown as readonly [typeof DataTableComponent, typeof DataTableCellDirective];

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [NgTemplateOutlet, NbSurface, LucideAngularModule],
  template: `
    <div nbSurface tone="cream" radius="xl" shadow="hard" border="strong"
         class="dt flex w-full flex-col overflow-hidden">

      @if (heading()) {
        <div class="dt__head flex flex-col justify-between gap-3 border-b-4 border-(--nb-border)
                    bg-(--nb-yellow) px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <h3 class="m-0 font-display text-lg font-black uppercase leading-tight">{{ heading() }}</h3>
            @if (subtitle()) {
              <p class="m-0 mt-0.5 text-xs font-medium">{{ subtitle() }}</p>
            }
          </div>
          <ng-content select="[table-actions]" />
        </div>
      }

      <div class="w-full overflow-x-auto">
        <table class="dt__table w-full border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr>
              @for (col of columns(); track col.key) {
                <th scope="col">{{ col.header }}</th>
              }
            </tr>
          </thead>

          <tbody>
            @if (isLoading()) {
              <tr>
                <td [attr.colspan]="columns().length" class="dt__state">
                  <lucide-icon [img]="icons.Loader" [size]="28" [strokeWidth]="3" class="dt__spin" />
                  <span>Cargando registros...</span>
                </td>
              </tr>
            } @else if (rows().length === 0) {
              <tr>
                <td [attr.colspan]="columns().length" class="dt__state">
                  <span class="dt__empty-icon">
                    <lucide-icon [img]="icons.ClipboardList" [size]="26" [strokeWidth]="3" />
                  </span>
                  <span>{{ emptyMessage() }}</span>
                </td>
              </tr>
            } @else {
              @for (row of rows(); track rowId()(row); let i = $index) {
                <tr class="dt__row" [class]="rowClass()(row)">
                  @for (col of columns(); track col.key) {
                    <td [class]="col.class ?? ''">
                      @let tpl = cellTemplates().get(col.key);
                      @if (tpl) {
                        <ng-container [ngTemplateOutlet]="tpl"
                                      [ngTemplateOutletContext]="{ $implicit: row, index: i }" />
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
  styles: `
    :host { display: block; width: 100%; }

    thead th {
      padding: 0.8rem 1rem;
      border-bottom: 4px solid var(--nb-border);
      background: var(--nb-mint);
      font-family: var(--font-mono, monospace);
      font-size: 0.72rem;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
      user-select: none;
    }

    tbody td { padding: 0.75rem 1rem; vertical-align: middle; }
    .dt__row { border-bottom: 2px solid color-mix(in srgb, var(--nb-border) 20%, transparent); }
    .dt__row:nth-child(even) { background: color-mix(in srgb, var(--nb-paper) 60%, transparent); }
    .dt__row { transition: background 0.15s ease, box-shadow 0.15s ease; }
    .dt__row:hover { background: var(--nb-yellow); box-shadow: inset 4px 0 0 0 var(--nb-border); }

    .dt__state {
      padding: 3rem 1rem;
      text-align: center;
      font-weight: 800;
    }
    .dt__state > * { display: block; margin-inline: auto; }
    .dt__state span:last-child { margin-top: 0.75rem; }

    .dt__empty-icon {
      display: grid !important;
      width: 3.5rem; height: 3.5rem;
      place-items: center;
      border: 3px solid var(--nb-border);
      background: var(--nb-lavender, #c4b5fd);
      box-shadow: 4px 4px 0 0 var(--nb-shadow);
    }

    .dt__spin { animation: dt-spin 0.9s linear infinite; }
    @keyframes dt-spin { to { transform: rotate(360deg); } }

    @media (prefers-reduced-motion: reduce) {
      .dt__row { transition: none; }
      .dt__spin { animation: none; }
    }
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
  readonly rowClass = input<(row: T) => string>(() => '');

  protected readonly icons = { ClipboardList, Loader };

  private readonly cells = contentChildren(DataTableCellDirective);
  protected readonly cellTemplates = computed(
    () => new Map(this.cells().map((c) => [c.key(), c.template])),
  );

  protected cellValue(row: T, col: TableColumn<T>) {
    return col.value ? col.value(row) : (row as any)[col.key];
  }
}