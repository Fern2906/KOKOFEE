import { Component, input, OnDestroy, OnInit, output } from '@angular/core';
import { NbTone, NbCallout, NbSeparator, NbCalloutSize } from '@ng-brutalism/ui';

@Component({
  selector: 'app-alert',
  imports: [NbCallout, NbSeparator],
  templateUrl: './alert.html',
})
export class Alert implements OnInit, OnDestroy {
  isLeaving = false;
  private timeoutId: any;
  private destroyTimeoutId: any;

  readonly message = input<string | null>(null);
  readonly tone = input<NbTone>('primary');
  readonly size = input<NbCalloutSize>('md');

  readonly closed = output<void>();

  ngOnInit() {
    this.timeoutId = setTimeout(() => {
      this.close();
    }, 2000);
  }

  close() {
    this.isLeaving = true;

    this.destroyTimeoutId = setTimeout(() => {
      this.closed.emit();
    }, 50);
  }

  ngOnDestroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.destroyTimeoutId) clearTimeout(this.destroyTimeoutId);
  }
}
