import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';

import { Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private urlBase = 'https://restcountries.com/v3.1';
  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) { }

  getPaisesXRegion(region: string): Observable<Pais[]> {
    return this.http.get<Pais[]>(`${this.urlBase}/region/${region}?fields=name,cca3`);
  }

  getPaisXCodigo(codigo: string): Observable<Pais | null> {
    if (!codigo) {
      return of(null);
    }
    return this.http.get<Pais>(`${this.urlBase}/alpha/${codigo}?fields=borders`);
  }

  getNombrePaisXCodigo(codigo: string): Observable<Pais> {
    return this.http.get<Pais>(`${this.urlBase}/alpha/${codigo}?fields=name`);
  }

  getPaisesXCodigoFrontera(fronteras: string[]): Observable<Pais[]> {
    if (!fronteras)
      return of([]);
    const peticiones: Observable<Pais>[] = [];
    fronteras.forEach(codigo => {
      const peticion = this.getNombrePaisXCodigo(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }
}
