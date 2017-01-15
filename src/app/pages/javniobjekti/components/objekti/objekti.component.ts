import {Component, OnInit, ViewEncapsulation, EventEmitter} from "@angular/core";

import {FormGroup, FormBuilder, FormArray, Validators, FormControl} from "@angular/forms";
import {LocalDataSource} from 'ng2-smart-table';
import { Ng2MapComponent } from 'ng2-map';
import {Marker} from "ng2-map";

import {ViewChild} from "@angular/core/src/metadata/di";
import {ModalDirective} from "ng2-bootstrap";
import {CrudService} from "../../../services/crud.service";
import {Objekat, Mesto, Opstina, Grupa, Podgrupa, NacinFinansiranja} from "./objekatdata";
import {CompleterService, CompleterData, CompleterItem} from 'ng2-completer';
import {Racun, RnIznos, RnPotrosnja, RnOstalo, Brojilo, Mesec} from "../racuni/racundata";
import {Energent} from "../../../admin/components/energent/energentdata";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'isem-objekti',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'objekti.component.html',
  styleUrls: ['../../styles/table.component.scss']
})

export class ObjektiComponent implements OnInit{
  private dataService: CompleterData;
  private dataServiceMesta: CompleterData;

  @ViewChild('childModal') childModal: ModalDirective;

  @ViewChild(Ng2MapComponent) ng2MapComponent: Ng2MapComponent;
  @ViewChild(Marker) marker: Marker;
  markeri: Marker[];
  objekti: Objekat[];
  private mesta: Mesto[];
  private mesto: Mesto;
  private opstina: Opstina;
  private opstine: Opstina[];
  private grupe: Grupa[];
  private grupa: Grupa;
  private podgrupa: Podgrupa;
  private nacinFinansiranja: NacinFinansiranja;
  private grupaID: number;
  private podgrupaID: number;
  podgrupe: Podgrupa[] = new Array<Podgrupa>();
  private naciniFinansiranja: NacinFinansiranja[];
  selectedMesto: string;
  selectedOpstina: string;
  selektovanaOpstina: Opstina;
  selektovanaGrupa: Grupa;
  objekat: Objekat = new Objekat();
  loaded: boolean = false;
  loadedForm: boolean = false;
  mapaUkljucena = false;
  izbor: boolean = false;
  nazivObjekta: string = "PPPPPPP";
  myForm: FormGroup;
  public isMestaLoaded:boolean = false;
  public isObjekatLoaded:boolean = false;
  public isOpstineLoaded:boolean = false;
  public isGrupeLoaded: boolean = false;
  public isPodgrupeLoaded: boolean = false;
  public isNaciniFinansiranjaLoaded: boolean = false;
  public dozvoliPrikazPodgrupa: boolean = false;
  public IDObjektaBrisanje: number;
  errorMessage:string;

  source: LocalDataSource = new LocalDataSource();

  settings = {
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>'
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>'
    },
    mode: 'external',
    actions: {
      columnTitle: ''
    },
    noDataMessage: 'Podaci nisu pronađeni',
    columns: {
      naziv: {
        title: 'Naziv',
        type: 'string'
      },
      opstina: {
        title: 'Opstina',
        type: 'string'
      },
      mesto: {
        title: 'Mesto',
        type: 'string'
      },
      grupa: {
        title: 'Grupa',
        type: 'string'
      },
      podgrupa: {
        title: 'Podgrupa',
        type: 'string'
      },
      nacinFinansiranja: {
        title: 'Finansiranje',
        type: 'string'
      }

    }
  };


  isGrejanje: boolean = true;
  isRasveta: boolean = false;
  isHladjenje: boolean = false;

  constructor(private crudService: CrudService, private fb: FormBuilder, private completerService: CompleterService){
    Ng2MapComponent['apiUrl'] = 'https://maps.google.com/maps/api/js?key=AIzaSyD_jj5skmtWusk6XhSu_wXoSeo_7bvuwlQ';
    this.myForm = this.fb.group({
      id: [''],
      naziv: [''],
      adresa: [''],
      mesto: [''],
      opstina: [''],
      grupa: [''],
      podgrupa: [''],
      nacinFinansiranja: [''],
      godIzgr: [''],
      lon: [''],
      lat: [''],
      opBrEtaza: [''],
      opBrRdNed: [''],
      opBrRdGod: [''],
      opPbrRsDan: [''],
      opBrNrdZima: [''],
      opBrNrdLeto: [''],
      opBrStalnoZap: [''],
      opBrKor: [''],
      projektanFirma: [''],
      izvodjacIzg: [''],
      godRekon: [''],
      izvodjacRekon: [''],
      tipRek: [''],
      koIme: [''],
      koPrezime: [''],
      koZanimanje: [''],
      koTel: [''],
      koFaks: [''],
      koMob: [''],
      koMail: [''],
      grejUkSnaga: [''],
      grejUkSnagaTela: [''],
      elSnagaGrejalica: [''],
      grejOpis: [''],
      grejZa: [''],
      grejPoKorisna: [''],
      hlaOpis: [''],
      hlaPo: [''],
      hlaZa: [''],
      hlaUkSnaga: [''],
      toplOpis: [''],
      toplTemp: [''],
      toplUkSnaga: [''],
      ventOpis: [''],
      ventZa: [''],
      ventUkSnaga: [''],
      elOpis: [''],
      elSnagaPotrosaca: [''],
      elSnagaRasveta: [''],
      vodaOpis: [''],
      version: ['']
    });

    this.myFormRn1 = this.fb.group({
      id: [''],
      objekat: [''],
      brojilo: [''],
      version: [''],
      energent: [''],
      godina: [''],
      mesec: [''],
      dobavljac: [''],
      rnTip: [''],
      brojRn: [''],
      datumr: [''],
      napomena: [''],
    });

    this.myFormRn2 = this.fb.group({
      polja: fb.array([
      ])
    });
  }

  getDataTab() {
    this.crudService.getDataTab("objekat").subscribe(
      data => {
        this.source.load(data);
        console.log(data);
        this.objekti = data;
        for(var item of this.objekti){
          if(item.lon==null){
            item.lon = 19;
          }
          if(item.lat==null){
            item.lat = 45;
          }
        }
        console.log(this.objekti);

      },
      error => console.log(error)
    );
  }
  napuniMesta (id: number){
    this.crudService.getListaMesta(id)
      .subscribe(
        listaMesta => {
          this.mesta = listaMesta;
          console.log(this.mesta);
          this.dataServiceMesta = this.completerService.local(this.mesta, 'naziv', 'naziv');
          this.isMestaLoaded = true;
        },
        error => this.errorMessage = <any>error);

  }
  public onOpstinaSelected(selected: CompleterItem) {
    console.log(selected);
    if(selected!==null){
      console.log(selected.originalObject.id);
      this.napuniMesta(selected.originalObject.id);
      this.selektovanaOpstina=selected.originalObject;
      this.selectedMesto = "Biraj mesto";
      console.log(this.objekat);
    }
  }
  public onMestoSelected(selected: CompleterItem) {
    console.log(selected);
    if(selected!==null){
      this.objekat.mesto=selected.originalObject;
      this.objekat.mesto.opstina=this.selektovanaOpstina;
      console.log(this.objekat);
    }
  }
  public onGrupaSelected(selectedId: number){
    console.log("ID selektovane grupe je: " + selectedId);
    //this.isPodgrupeLoaded = false;

    while(this.podgrupe.length > 0) {
      this.podgrupe.pop();
    }
    if(this.isGrupeLoaded) {
      for (var item of this.grupe) {

        console.log("ID grupe je: " + item.id + " a njen naziv :" + item.naziv);
        if (item.id == selectedId) {
//          console.log("Selektovana grupa"+item.naziv);
          console.log("POZIV U ON GRUPA SELECTED");
          this.napuniPodgrupe(item.id);
          this.selektovanaGrupa = item;
          this.objekat.podgrupa.grupa = item;
//          console.log("Upisana grupa"+this.objekat.podgrupa.grupa.naziv);
        }
      }
    }
  }

  public onPodgrupaSelected(selectedId: number){
    console.log(selectedId);
    if(this.isPodgrupeLoaded) {
      for (var item of this.podgrupe) {

        if (item.id == selectedId) {

          console.log("Selektovana podgrupa"+item.naziv);
          this.objekat.podgrupa = item;
          console.log("Upisana podgrupa"+this.objekat.podgrupa.naziv);
          console.log("Upisana grupa"+this.objekat.podgrupa.grupa.naziv);
        }
      }
    }
  }
  onNacinFinansiranjaSelected(selectedId: number){
    console.log(selectedId);
    if(this.isNaciniFinansiranjaLoaded) {
      for (var item of this.naciniFinansiranja) {
        if (item.id == selectedId) {
          console.log("Selektovani nacin finansiranja"+item.naziv);
          this.objekat.nacinFinansiranja = item;
          console.log("Upisan nacin finansiranja"+this.objekat.nacinFinansiranja.naziv);
        }
      }
    }
  }
  napuniNacinFinansiranja(){
    this.crudService.getData("nac_fin").subscribe(
      data => {
        this.naciniFinansiranja = data;
        console.log(data);
        this.isNaciniFinansiranjaLoaded = true;
      },
      error => console.log(error)
    );
  }
  napuniGrupe() {
    this.crudService.getData("grupa").subscribe(
      data => {
        this.grupe = data;
        console.log("UCITANE GRUPEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
        console.log(this.grupe);
        this.isGrupeLoaded = true;
      },
      error => console.log(error)
    );
  }

  napuniPodgrupe (id: number){

    this.crudService.getListaPodgrupa(id)
      .subscribe(
        data => {
          this.podgrupe = data;
          console.log("UCITANE PODGRUPEEEEEEEEEEEEEEEEEEEEEEEEEEE");
          console.log(this.podgrupe);
          this.isPodgrupeLoaded = true;
        },
        error => this.errorMessage = <any>error);

  }
  prikazi_formu($event, id){
    console.log("ID OBJEKTA JE: " + id);
    this.crudService.getSingle("objekat", id)
      .subscribe(
        data => {
          console.log(data);
          this.objekat = data;
          this.loadedForm = true;
          this.izbor = true;
        },
        error => console.log(error)
      );
}
  prikazi_modal($event, id){
    console.log("ID OBJEKTA JE: " + id);
    this.crudService.getSingle("objekat", id)
      .subscribe(
        data => {
          console.log(data);
          this.objekat = data;
          this.nazivObjekta = this.objekat.naziv;

          console.log("NAZIV OBJEKTA : " + this.nazivObjekta);
          this.showChildModal();
        },
        error => console.log(error)
      );
  }
  onDelete(event){
    this.IDObjektaBrisanje = event.data.id
    console.log(event.data.username);
    this.showChildModal();

  }

  brisiKorisnika(){
    //brisi korisnika
    this.loadedForm = false;
    this.crudService.delete("objekat",this.IDObjektaBrisanje)
      .subscribe(
        data => {
          console.log("USAO U BRISANJE KORISNIKA");
          console.log(data);
          this.crudService.getDataTab("objekat")
            .subscribe(
              listaObjekata => {
                this.source.load(listaObjekata);
                console.log(listaObjekata);
                this.objekti = listaObjekata;
                for(var item of this.objekti){
                  if(item.lon==null){
                    item.lon = 19;
                  }
                  if(item.lat==null){
                    item.lat = 45;
                  }
                }
                console.log(this.objekti);
                this.loadedForm = true;
              },
              error => this.errorMessage = <any>error);

        },
        error => console.log(error)
      );

    //azuriraj listu korisnika

    this.hideChildModal();


  }
  onCreate(): void{
    this.selektovanaOpstina = new Opstina();
    this.selektovanaOpstina.naziv = "Ada";
    this.opstina = new Opstina();
    this.opstina.naziv = "Ada";
    this.mesto = new Mesto();
    this.mesto.naziv = "Ada";

    this.mesto.opstina = this.opstina;

    this.grupa = new Grupa();
    this.podgrupa = new Podgrupa();
    this.podgrupa.grupa = this.grupa;


    this.nacinFinansiranja = new NacinFinansiranja();
    this.nacinFinansiranja = this.naciniFinansiranja[0];

    this.objekat = new Objekat();

    this.objekat.podgrupa = this.podgrupa;
    this.objekat.mesto = this.mesto;
    this.objekat.nacinFinansiranja = this.nacinFinansiranja;
    this.objekat.lat = 45;
    this.objekat.lon = 45;

    this.isObjekatLoaded = true;
    this.loadedForm = true;
    console.log(this.objekat);

    this.source.setFilter([{ field: 'naziv', search: '' },{ field: 'mesto', search: '' }]);
    this.izbor = true;
  }
  onEdit(event): void{
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    this.loadedForm = false;
    this.crudService.getSingle("objekat", event.data.id)
      .subscribe(
        data => {
          console.log(data);
          this.objekat = new Objekat();
          this.objekat = data;
          this.grupaID = this.objekat.podgrupa.grupa.id;
          this.podgrupaID = this.objekat.podgrupa.id;
          this.selektovanaOpstina = this.objekat.mesto.opstina;
          this.selektovanaGrupa = this.objekat.podgrupa.grupa;
          this.napuniMesta(this.objekat.mesto.opstina.id);
          console.log("POZIV U GET SINGLE");
          this.napuniPodgrupe(this.objekat.podgrupa.grupa.id);
          this.isObjekatLoaded = true;
          this.loadedForm = true;
          console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
          console.log(this.objekat);
          console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
          console.log(this.mesta);
          console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
          console.log(this.podgrupe);
          // this.selectedMesto = this.dobavljac.mesto.naziv;
        },
        error => console.log(error)
      );


    //this.energentTipId = this.dobavljac.energentTip.id;
    //this.jedinicaMereId = this.dobavljac.jedMere.id;
    this.izbor = true;
    this.source.setFilter([{ field: 'naziv', search: '' }]);
  }
  onSubmit() {

    console.log(this.objekat);

    this.crudService.sendData("objekat", this.objekat)
      .subscribe(
        data => {
          console.log(data);
          this.getDataTab();
        },
        error => console.log(error)
      );

    this.izbor = false;
    this.objekat = null;
  }

  onCancel() {
    this.getDataTab();
    this.izbor = false;
    this.objekat = null;
  }

  ngOnInit(){
    this.getDataTab();

    this.napuniGrupe();

    this.napuniNacinFinansiranja();

    this.crudService.getData("opstina")
      .subscribe(
        listaOpstina => {
          this.opstine = listaOpstina;
          console.log(this.opstine);
          this.dataService = this.completerService.local(this.opstine, 'naziv', 'naziv');
          this.isOpstineLoaded = true;
        },
        error => this.errorMessage = <any>error);

  }
  showChildModal(): void {
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  // --------------------- R A C U N I ---------------------------- //

  @ViewChild('childModalRn') childModalRn: ModalDirective;
  sourceRacuni: LocalDataSource = new LocalDataSource();
  brisanjeRnId: number;

  settings_racuni = {
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>'
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>'
    },
    mode: 'external',
    actions: {
      columnTitle: ''
    },
    noDataMessage: 'Podaci nisu pronađeni',
    columns: {
      brojilo: {
        title: 'Brojilo',
        type: 'string'
      },
      godina: {
        title: 'Godina',
        type: 'string'
      },
      mesec: {
        title: 'Mesec',
        type: 'string'
      },
      brojRn: {
        title: 'Broj računa',
        type: 'string'
      },
      datumr: {
        title: 'Datum',
        type: 'string'
      },
      uneo: {
        title: 'Uneo',
        type: 'string'
      },
      datumu: {
        title: 'Datum unosa',
        type: 'string'
      }

    }
  };

  getDataRacuni() {
    this.crudService.getUslovTab("rn","obj_id="+this.objekat.id).subscribe(
      data => {
          this.sourceRacuni.load(data);
        console.log("tu");
        },
      error => console.log(error)
    );
  }

  onDeleteRacuni(event){
    this.brisanjeRnId = event.data.id
    this.showChildModalRn();
  }

  onDeleteConfirmRacuni() {
    this.crudService.delete("rn", this.brisanjeRnId)
      .subscribe(
        data => {console.log(data); this.getDataRacuni();},
        error => console.log(error)
      );

    this.hideChildModalRn();
  }

  onEditRacuni(event){

    this.prikaziRn = true;

    // this.obj = new Objekat();
    this.rn = new Racun();
    this.rnIznos = new Array<RnIznos>();
    this.rnPotrosnja = new Array<RnPotrosnja>();
    this.rnOstalo = new Array<RnOstalo>();
    this.rnKolone = null;
    this.mesec = new Mesec();

    this.crudService.getSingle("rn", event.data.id)
      .subscribe(
        data => {
          // this.obj = data.brojilo.objekat;
          this.rn = data;
          this.rnIznos = data.rnIznos;
          this.rnPotrosnja = data.rnPotrosnja;
          this.rnOstalo = data.rnOstalo;

          this.rnKolone = this.rnIznos.concat(this.rnPotrosnja).concat(this.rnOstalo);

          this.getBrojiloVrstaKol("bro_vrs_id="+this.rn.brojilo.brojiloVrsta.id);


          this.napuniGodine();

          for (var item of this.godine) {
            if (item == this.rn.godina.god) {
              this.godina = item;
            }
          }

          // for (var item of this.meseci) {
          //   if (item = this.rn.mesec.naziv) {
          //     this.mesec = item;
          //   }
          // }

          this.mesec.id = this.rn.mesec.id;

          this.datumRacuna.setFullYear(this.rn.godina.god);
          this.datumRacuna.setMonth(this.rn.mesec.id - 1);
          this.datumRacuna.setDate(15);

        },
        error => console.log(error)
      );

  }

  showChildModalRn(): void {
    this.childModalRn.show();
  }

  hideChildModalRn(): void {
    this.childModalRn.hide();
  }


  // --------------------- R A C U N ---------------------------- //

  prikaziRn: boolean = false;
  rn: Racun = new Racun();
  obj: Objekat = new Objekat();

  rnIznos: Array<RnIznos> = new Array<RnIznos>();
  rnPotrosnja: Array<RnPotrosnja> = new Array<RnPotrosnja>();
  rnOstalo: Array<RnOstalo> = new Array<RnOstalo>();

  rnKolone: Array<any>;

  godine: number [] = new Array <number>();
  godina: number;
  brojGodinaUMeniju: number = 5;

  meseci: Array<any> = [ {"id":1, "naz":"Januar"},
                        {"id":2, "naz":"Februar"},
                        {"id":3, "naz":"Mart"},
                        {"id":4, "naz":"April"},
                        {"id":5, "naz":"Maj"},
                        {"id":6, "naz":"Jun"},
                        {"id":7, "naz":"Jul"},
                        {"id":8, "naz":"Avgust"},
                        {"id":9, "naz":"Septembar"},
                        {"id":10, "naz":"Oktobar"},
                        {"id":11, "naz":"Novembar"},
                        {"id":12, "naz":"Decembar"}
                       ];


   // meseci: string [] = ["Januar","Februar","Mart","April","Maj","Jun","Jul","Avgust","Septembar","Oktobar","Novembar","Decembar"];
  mesec: Mesec;

  datumRacuna: Date = new Date();

  objekti: Objekat[];
  isObjektiLoaded: boolean = false;
  objekatId: number;

  brojila: Brojilo[];
  isBrojilaLoaded: boolean = false;
  brojiloId: number;

  energenti: Energent[];
  isEnergentiLoaded: boolean = false;
  energentId: number;

  stavke: Array<any>;
  vrednosti: Array<any> = new Array<any>();
  isVrednostiPopunjeno: boolean = false;

  myFormRn1: FormGroup;
  myFormRn2: FormGroup;

  vrednost: any;

  getBrojiloVrstaKol(uslov: string) {
    this.crudService.getUslov("bro_vrs_kol", uslov).subscribe(
      data => {

        for (var k = (<FormArray>this.myFormRn2.controls['polja']).length; k > 0; k--){
          this.obrisiPolje(k-1);
        }

        this.stavke = data;

        for(var i = 0; i < this.stavke.length; i++)
        {
          for(var j = 0; j < this.rnKolone.length; j++) {
             if(this.stavke[i].id == this.rnKolone[j].brojiloVrstaKolone.id){
               (<FormArray>this.myFormRn2.controls['polja']).push(new FormControl(this.rnKolone[j].vrednost, Validators.required));
             }
          }


        }

        this.isVrednostiPopunjeno = true;

      },
      error => console.log(error)
    );
  }

  obrisiPolje(index: number): void {
    const arrayControl = <FormArray>this.myFormRn2.controls['polja'];
    arrayControl.removeAt(index);
  }

  getObjekte() {
    this.crudService.getData("objekat").subscribe(
      data => {
        this.objekti = data;
        //this.obj = this.objekti[0];
        this.isObjektiLoaded = true;
      },
      error => console.log(error)
    );
  }

  public onObjekatSelected(selectedId: number){
    if(this.isObjektiLoaded) {
      for (var item of this.objekti) {
        if (item.id == selectedId) {
          this.obj = item;
        }
      }
    }

    this.getBrojila("obj_id="+this.obj.id);
  }

  getBrojila(uslov: string) {
    this.crudService.getUslov("brojilo", uslov).subscribe(
      data => {
        this.brojila = data;
        console.log(data);
        this.rn.brojilo = this.brojila[0];
        this.isBrojilaLoaded = true;
      },
      error => console.log(error)
    );
  }

  public onBrojiloSelected(selectedId: number){
    if(this.isBrojilaLoaded) {
      for (var item of this.brojila) {
        if (item.id == selectedId) {
          this.rn.brojilo = item;
        }
      }
    }

    this.getEnergente("en_tip_id="+this.rn.brojilo.brojiloVrsta.energentTip.id);
    this.getBrojiloVrstaKol("bro_vrs_id="+this.rn.brojilo.brojiloVrsta.id);
  }

  getEnergente(uslov: string) {
    this.crudService.getUslov("energent", uslov).subscribe(
      data => {
        this.energenti = data;
        this.rn.energent = this.energenti[0];
        this.isEnergentiLoaded = true;
      },
      error => console.log(error)
    );
  }

  public onEnergentSelected(selectedId: number){
    if(this.isEnergentiLoaded) {
      for (var item of this.energenti) {
        if (item.id == selectedId) {
          this.rn.energent = item;
        }
      }
    }
  }

  napuniGodine(){
    let datum = new Date();
    let godina = datum.getFullYear();
    for(var i = 0; i < this.brojGodinaUMeniju; i++){
      this.godine.push(godina - i);
    }

  }

  public onGodinaSelected(selectedGodina: number){
    console.log("Selektovana godina: " + selectedGodina);
    this.datumRacuna.setFullYear(selectedGodina);
    console.log("Izabrani datum je: " + this.datumRacuna);
  }

  public onMesecSelected(selectedMesec: number){
    console.log("Selektovani mesec: " + selectedMesec);
    this.datumRacuna.setMonth(selectedMesec);
    this.datumRacuna.setDate(15);
    console.log("Izabrani datum je: " + this.datumRacuna);
  }

  onCancelRn() {
    this.prikaziRn = false;
  }

  onSubmitRn(event) {
    this.vrednosti = ((<FormArray>this.myFormRn2.controls['polja']).getRawValue());

    console.log(this.vrednosti);

    this.rnIznos = new Array<RnIznos>();
    this.rnPotrosnja = new Array<RnPotrosnja>();
    this.rnOstalo = new Array<RnOstalo>();

    for(var i = 0; i < this.stavke.length; i++)
    {
      if (this.stavke[i].kolonaTip.id == 1) {
        var rn = new RnIznos();
        rn.brojiloVrstaKolone = this.stavke[i];
        rn.vrednost = this.vrednosti[i];
        this.rnIznos.push(rn);
      } else if (this.stavke[i].kolonaTip.id == 2) {
        var rn = new RnPotrosnja();
        rn.brojiloVrstaKolone = this.stavke[i];
        rn.vrednost = this.vrednosti[i];
        this.rnPotrosnja.push(rn);
      } else if (this.stavke[i].kolonaTip.id == 3) {
        var rn = new RnOstalo();
        rn.brojiloVrstaKolone = this.stavke[i];
        rn.vrednost = this.vrednosti[i].toString();
        this.rnOstalo.push(rn);
      }

    }

    console.log(this.rnIznos);
    console.log(this.rnPotrosnja);
    console.log(this.rnOstalo);

    var datePipe = new DatePipe();
    this.rn.datumr = datePipe.transform(this.datumRacuna, 'dd.MM.yyyy');

    this.rn.rnIznos = this.rnIznos;
    this.rn.rnPotrosnja = this.rnPotrosnja;
    this.rn.rnOstalo = this.rnOstalo;

    this.crudService.sendData("rn", this.rn)
      .subscribe(
        data => {console.log(data);},
        error => console.log(error)
      );

    this.prikaziRn = false;
  }
}
