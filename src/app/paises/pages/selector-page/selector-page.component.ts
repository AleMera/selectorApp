import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from "rxjs/operators";

import { PaisesService } from '../../services/paises.service';
import { Pais } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  selectorForm: FormGroup = this.fBuilder.group({
    region: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    frontera: ['', [Validators.required]]
  });

  //Llenar selectores
  regiones: string[] = [];
  paises: Pais[] = [];
  fronteras: Pais[] = [];

  cargando: boolean = false;

  constructor(private fBuilder: FormBuilder, private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //Cuando cambie la region
    this.selectorForm.get('region')?.valueChanges
      .pipe(
        tap(() => {
          this.selectorForm.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap(region => this.paisesService.getPaisesXRegion(region))
      )
      .subscribe(result => {
        this.paises = result
        this.cargando = false;
      });

    //Cuando cambie el pais
    this.selectorForm.get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.fronteras = [];
          this.selectorForm.get('frontera')?.reset('');
          this.cargando = true;

        }),
        switchMap(codigoPais => this.paisesService.getPaisXCodigo(codigoPais)),
        switchMap(pais => this.paisesService.getPaisesXCodigoFrontera(pais?.borders!))
      )
      .subscribe(result => {
        this.fronteras = result;
        this.cargando = false;

      });
  }

  enviar() {
    console.log(this.selectorForm.value);

  }

}
