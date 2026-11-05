import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { SearchboxComponent } from './searchbox';

@Component({
  standalone: true,
  imports: [SearchboxComponent],
  template: `
    <app-searchbox
      [value]="query()"
      [placeholder]="placeholder()"
      [label]="label()"
      (searchChange)="query.set($event)"
    />
  `,
})
class TestHostComponent {
  readonly query = signal('');
  readonly placeholder = signal('Buscar...');
  readonly label = signal('');
}

describe('SearchboxComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, SearchboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render input with default placeholder', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Buscar...');
    expect(input.type).toBe('search');
  });

  it('should emit searchChange on input and update value', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'espresso';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.query()).toBe('espresso');
  });

  it('should display label when provided', () => {
    expect(fixture.nativeElement.querySelector('label')).toBeNull();

    host.label.set('Buscar receta');
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');
    expect(label).toBeTruthy();
    expect(label.textContent.trim()).toBe('Buscar receta');
  });
});

