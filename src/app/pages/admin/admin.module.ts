import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { AdminComponent } from './admin.component';
import { Korisnici } from './components/korisnici/korisnici.component.ts';
import { Korisnik } from './components/korisnici/korisnik.component.ts';
import { routing } from './admin.routing';
import {Ng2SmartTableModule} from "ng2-smart-table/build/ng2-smart-table";
import {NgaModule} from "../../theme/nga.module";
import {KorisniciService} from "./components/korisnici/korisnici.services.ts";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2CompleterModule } from "ng2-completer";
import { DropdownModule, ModalModule, DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';

import { CrudService } from "./services/crud.service";

import {JediniceMereComponent} from "./components/jedinice_mere/jedinice_mere.component";
import {OpstinaComponent} from "./components/opstina/opstina.component";
import {UlogaComponent} from "./components/uloga/uloga.component";

@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2CompleterModule,
    DropdownModule,
    ModalModule,
    DatepickerModule,
    routing
  ],
  declarations: [
    AdminComponent,
    Korisnici,
    Korisnik,
    JediniceMereComponent,
    OpstinaComponent,
    UlogaComponent
  ],
  providers: [
    KorisniciService,
    CrudService
  ]
})
export default class NewModule {}
