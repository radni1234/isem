import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { AdminComponent } from './admin.component';
import { Korisnici } from './components/korisnik/korisnici.component.ts';
import { Korisnik } from './components/korisnik/korisnik.component.ts';
import { routing } from './admin.routing';
import {Ng2SmartTableModule} from "ng2-smart-table/build/ng2-smart-table";
import {NgaModule} from "../../theme/nga.module";
// import {KorisniciService} from "./components/korisnik/korisnici.services.ts";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2CompleterModule } from "ng2-completer";
import { DropdownModule, ModalModule, AccordionModule, TabsModule } from 'ng2-bootstrap/ng2-bootstrap';
import { MyDatePickerModule } from 'mydatepicker';

import { CrudService } from "../services/crud.service";

import {JediniceMereComponent} from "./components/jedinice_mere/jedinice_mere.component";
import {OpstinaComponent} from "./components/opstina/opstina.component";
import {UlogaComponent} from "./components/uloga/uloga.component";
import {GrupaComponent} from "./components/grupe/grupa.component";
import {NacinFinansiranjaComponent} from "./components/nacin_finansiranja/nacin_finansiranja.component";
import {GodinaComponent} from "./components/godine/godine.component";
// import {StepenDaniComponent} from "./components/stepen_dani/stepen_dani.component";
import {TipSvetiljkeComponent} from "./components/tip_svetiljke/tip_svetiljke.component";
import {TipStubaComponent} from "./components/tip_stuba/tip_stuba.component";
import {EnergentTipComponent} from "./components/energent_tip/energent_tip.component";
import {BrojiloTipComponent} from "./components/brojilo_tip/brojilo_tip.component";
import {RezimMerenjaComponent} from "./components/rezim_merenja/rezim_merenja.component";
import {EnergentComponent} from "./components/energent/energent.component";
import {BrojiloVrstaComponent} from "./components/brojilo_vrsta/brojilo_vrsta.component";
import {TipRacunaComponent} from "./components/racun_tip/tip_racuna.component";
import {KolonaTipComponent} from "./components/kolona_tip/kolona_tip.component";
import {DobavljacComponent} from "./components/dobavljac/dobavljac.component";
import {CanActivateAuthGuard} from "../services/can-activate.authguard";
import {AuthenticationService} from "../services/authentication.service";
import {KorisnikObjekatComponent} from "./components/korisnik_objekat/korisnik_objekat.component";
import SharedModule from "../shared/shared.module";
import {AppTranslationModule} from "../../app.translation.module";
import {JavnoPreduzeceComponent} from "./components/javno_preduzece/javno_preduzece.component";
import {SavetiComponent} from "./components/saveti/saveti.component";
import {KategorijaVozilaComponent} from "./components/kategorija_vozila/kategorija_vozila.component";
import {VoziloEmisionaKlasaComponent} from "./components/vozilo_emisiona_klasa/vozilo_emisiona_klasa.component";
import {TrendIskljucenoComponent} from "./components/trend_iskljuceno/trend_iskljuceno.component";
import {VodozahvatGrupaComponent} from "./components/vodozahvat_grupa/vodozahvat_grupa.component";
import {StepenDaniComponent} from "./components/stepen_dani/stepen_dani.component";



@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2CompleterModule,
    DropdownModule,
    AccordionModule,
    ModalModule,
    TabsModule,
    MyDatePickerModule,
    routing,
    SharedModule,
    AppTranslationModule
  ],
  declarations: [
    AdminComponent,
    Korisnici,
    KorisnikObjekatComponent,
    JediniceMereComponent,
    OpstinaComponent,
    UlogaComponent,
    GrupaComponent,
    NacinFinansiranjaComponent,
    GodinaComponent,
    StepenDaniComponent,
    TipSvetiljkeComponent,
    TipStubaComponent,
    EnergentTipComponent,
    BrojiloTipComponent,
    RezimMerenjaComponent,
    EnergentComponent,
    BrojiloVrstaComponent,
    TipRacunaComponent,
    KolonaTipComponent,
    DobavljacComponent,
    JavnoPreduzeceComponent,
    SavetiComponent,
    KategorijaVozilaComponent,
    VoziloEmisionaKlasaComponent,
    TrendIskljucenoComponent,
    VodozahvatGrupaComponent
  ],
  providers: [
    // KorisniciService,
    CrudService,
    CanActivateAuthGuard,
    AuthenticationService
  ]
})
export default class NewModule {}
