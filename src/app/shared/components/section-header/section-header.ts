import { Component, input } from '@angular/core';
import {
  NbChip, NbDisplay, NbSplit, NbStack, NbStatusDot,
  NbSticker, NbStickerFace, NbSurface, NbText,
} from '@ng-brutalism/ui';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [
    NbChip, NbDisplay, NbSplit, NbStack, NbStatusDot,
    NbSticker, NbStickerFace, NbSurface, NbText,
  ],
  template: `
    <header nbSurface [attr.tone]="tone()" padding="xl" radius="xl" shadow="hard" border="strong"
            class="relative mb-12">

      @if (count() !== null) {
        <nb-sticker shape="star" tone="pink" [rotate]="10"
                    class="absolute -top-7 -right-3 z-20"
                    [attr.aria-label]="count() + ' elementos'">
          <nb-sticker-face>
            <span nbText size="lg" weight="black">{{ count() }}</span>
          </nb-sticker-face>
        </nb-sticker>
      }

      <div nbSplit ratio="2:1" gap="lg" collapse="md" align="end">
        <div nbStack gap="md" align="start">
          <span nbChip tone="yellow" radius="md" class="font-bold uppercase">
            <span nbStatusDot state="online"></span>
            {{ eyebrow() }}
          </span>

          <h2 nbDisplay size="md" class="uppercase">{{ title() }}</h2>

          <p nbText size="md" weight="medium" measure="md">{{ description() }}</p>
        </div>

        <div class="flex md:justify-end">
          <ng-content select="[headerActions]" />
        </div>
      </div>
    </header>
  `,
})
export class SectionHeaderComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly tone = input<string>('mint');
  readonly count = input<number | null>(null);
}