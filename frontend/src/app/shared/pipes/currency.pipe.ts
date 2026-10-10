import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appCurrency',
  standalone: true
})
export class AppCurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined, currencyCode = 'EUR'): string {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return '0,00 €';
    }
    const num = Number(value);
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }
}

