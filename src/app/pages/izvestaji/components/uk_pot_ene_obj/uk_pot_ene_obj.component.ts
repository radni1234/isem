import {Component, ViewChild, OnInit} from '@angular/core';
import {MonthYearPicker} from "../../../shared/components/month_year_picker/month_year_picker.component";
import {CrudService} from "../../../services/crud.service";
import {Router} from "@angular/router";
import { IMultiSelectTexts, IMultiSelectSettings, IMultiSelectOption } from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
declare let jsPDF : any;

@Component({
  selector: 'isem-tipstuba',
  // encapsulation: ViewEncapsulation.None,
  templateUrl: 'uk_pot_ene_obj.component.html',
  styleUrls: ['../../styles/table.component.scss']
})

export class IzvUkPotEneObj implements OnInit {

  @ViewChild(MonthYearPicker)
  private m: MonthYearPicker;

  podaci:Array<any>;
  eneTipData: IMultiSelectOption[];
  objId: any[];
  period: String;

  mySettingsTipEne: IMultiSelectSettings = {
    pullRight: true,
    enableSearch: true,
    checkedStyle: 'checkboxes',
    buttonClasses: 'btn btn-default',
    selectionLimit: 0,
    closeOnSelect: false,
    showCheckAll: true,
    showUncheckAll: true,
    dynamicTitleMaxItems: 10,
    maxHeight: '300px',
  };

  myTextsTipEne: IMultiSelectTexts = {
    checkAll: 'Uključi sve',
    uncheckAll: 'Isključi sve',
    checked: 'odabrano',
    checkedPlural: 'odabrano',
    searchPlaceholder: 'Pretraga...',
    defaultTitle: 'Izaberite energente',
  };

  private isPodaciLoaded: boolean = false;
  private isEneTipLoaded: boolean = false;

  private eneTipIzbor: number[] = [];

  constructor(private crudService: CrudService, private router: Router) {
  }

  ngOnInit() {
    this.getEnergentTip();
  }

  upisiObjekte(objId: any[]) {
    this.objId = objId;
  }

  formirajIzvestaj(){
    this.crudService.getData("izvestaj/uk_pot_ene_obj?obj_id="+this.objId+"&ene_tip_id="+this.eneTipIzbor+"&datum_od="+'15'+'.'+this.m.mesOd+'.'+this.m.godOd+"&datum_do="+'15'+'.'+this.m.mesDo+'.'+this.m.godDo).subscribe(
      data => {this.podaci = data;
        this.period = this.m.mesOd + "." + this.m.godOd + "--" + this.m.mesDo + "." + this.m.godDo;
      console.log(data); this.isPodaciLoaded = true},
      error => {console.log(error);}
    );
  }

  getEnergentTip() {
    this.crudService.getData("energent_tip/lov").subscribe(
      data => {
        this.eneTipData = data;
        console.log(data);

        this.isEneTipLoaded = true;
      },
      error => {console.log(error); this.router.navigate(['/login']);}
    );
  }

  onChangeEneTip() {
    console.log(this.eneTipIzbor);
  }

  convert(){

    var doc = new jsPDF('l', 'mm', [297, 210]);
    var col = ["Grupa", "Energent", "Objekat", "Kolicina", "Kolicina [kWh]", "Emisija CO2", "Iznos [din]" ];
    var rows = [];
    var styles = {halign: 'right'};


    console.log(this.podaci);
    for(var key in this.podaci){
      // ovo sam uradio da mi ne prikazuje null-ove u tabeli
      if(this.podaci[key].grupa== null){
        this.podaci[key].grupa = "";
      }
      if(this.podaci[key].energent== null){
        this.podaci[key].energent = "";
      }
      if(this.podaci[key].objekat== null){
        this.podaci[key].objekat = "";
      }if(this.podaci[key].kolicina== null){
        this.podaci[key].kolicina = "";
      }
      if(this.podaci[key].kolicinaKwh== null){
        this.podaci[key].kolicinaKwh = "";
      }
      if(this.podaci[key].emisijaCo2== null){
        this.podaci[key].emisijaCo2 = "";
      }
      if(this.podaci[key].iznos== null){
        this.podaci[key].iznos = "";
      }
      var temp = [this.podaci[key].grupa, this.podaci[key].energent, this.podaci[key].objekat, this.podaci[key].kolicina, this.podaci[key].kolicinaKwh, this.podaci[key].emisijaCo2, this.podaci[key].iznos];
      rows.push(temp);
    }
    doc.text(40, 10, "Ukupna potrošnja energenata po objektima" + "\nza period: "+ this.period);
    doc.autoTable(col, rows, {
      startY: 25,
      // margin: {horizontal: 7},
      // bodyStyles: {valign: 'top'},
      // styles: {overflow: 'linebreak', columnWidth: 'wrap'},
      // columnStyles: {text: {columnWidth: 'auto'}}
      //styles: {overflow: 'linebreak', columnWidth: 'wrap'}
      //  styles: {cellPadding: 0.5, fontSize: 4, halign: 'left'}
    });

    doc.save('Uk_pot_en_obj.pdf');
  }

  //funkcija za formiranje excela iz izvestaja 7
  htmlTableToExcel(table) {
    var uri = 'data:application/vnd.ms-excel;base64,'
      , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
      , base64 = function(s) {return btoa(encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode(parseInt("0x" + p1));
    })); }
      , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };

    if (!table.nodeType) table = document.getElementById(table);
    var ctx = { worksheet: "aps-mes-pot" || 'Worksheet', table: table.innerHTML };
//
    var anchor = document.createElement('a');
    anchor.href = uri + base64(format(template, ctx));
    anchor.download = "ukupna_potrosnja_energenata_po_objektima.xls";
    anchor.click();

  }
}
