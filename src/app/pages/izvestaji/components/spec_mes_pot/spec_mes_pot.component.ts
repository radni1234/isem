
import {Component, ViewEncapsulation, OnInit, ViewChild} from "@angular/core";
import {CrudService} from "../../../services/crud.service";
import {Objekat} from "../../../javniobjekti/components/objekti/objekatdata";
import { IMultiSelectTexts, IMultiSelectSettings, IMultiSelectOption } from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import {MonthYearPicker} from "../../../shared/components/month_year_picker/month_year_picker.component";
import {unescape} from "querystring";
import {Router} from "@angular/router";
//import {unescape} from "querystring";
declare let jsPDF : any;



@Component({
  selector: 'isem-spec-god-pot',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'spec_mes_pot.component.html',
  styleUrls: ['../../styles/table.component.scss']
})

export class IzvSpecMesPot implements OnInit {
  podaci: any[] = new Array<any>();
  objekat: Array<Objekat>;
  selektovaniObjekat: any;
  period: String;

  isObjekatLoaded: boolean;
  isEneTipLoaded: boolean;
  indikator: String = 'pov';
  labela: String = ' m2';


  dana_mesec = {
    '01': 31,
    '02': 28,
    '03': 31,
    '04': 30,
    '05': 31,
    '06': 30,
    '07': 31,
    '08': 31,
    '09': 30,
    '10': 31,
    '11': 30,
    '12': 31

  }

  myDatePickerOptions = {
    dateFormat: 'dd.mm.yyyy'
  };

  optionsModel: number[] = []; // Default selection
  eneTipIzbor: number[] = [];

  myOptions: IMultiSelectOption[]; // = this.objekatLov;
  eneTipData: IMultiSelectOption[];


  // myOptions: IMultiSelectOption[] = [
  //   { id: 1, name: 'Option 1' },
  //   { id: 2, name: 'Option 2' },
  // ];

  mySettings: IMultiSelectSettings = {
    pullRight: false,
    enableSearch: true,
    checkedStyle: 'checkboxes',
    buttonClasses: 'btn btn-default',
    selectionLimit: 1,
    closeOnSelect: true,
    showCheckAll: false,
    showUncheckAll: false,
    dynamicTitleMaxItems: 3,
    maxHeight: '300px',
  };

  myTexts: IMultiSelectTexts = {
    checkAll: 'Check all',
    uncheckAll: 'Uncheck all',
    checked: 'checked',
    checkedPlural: 'checked',
    searchPlaceholder: 'Pretraga...',
    defaultTitle: 'Izaberite objekat',
  };

  mySettingsTipEne: IMultiSelectSettings = {
    pullRight: true,
    enableSearch: true,
    checkedStyle: 'checkboxes',
    buttonClasses: 'btn btn-default',
    selectionLimit: 0,
    closeOnSelect: false,
    showCheckAll: true,
    showUncheckAll: true,
    dynamicTitleMaxItems: 3,
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

  @ViewChild(MonthYearPicker)
  private m: MonthYearPicker;

  constructor(private crudService: CrudService, private router: Router) {
  }

  ngOnInit() {
    this.getObjekte();
    // this.postaviDatume();
  }

  getObjekte() {
    this.crudService.getData("objekat/lov").subscribe(
      data => {
        this.myOptions = data;
        console.log(data);

        this.isObjekatLoaded = true;
      },
      error => {console.log(error); this.router.navigate(['/login']);}
    );
  }

  getEnergentTip() {
    this.crudService.getData("energent_tip/lov?obj_id="+this.optionsModel).subscribe(
      data => {
        this.eneTipData = data;
        console.log(data);

        this.isEneTipLoaded = true;
      },
      error => {console.log(error); this.router.navigate(['/login']);}
    );
  }

  onChangeObjekat(event) {
    console.log(event[0]);
    for(var i=0; i<this.myOptions.length; i++) {
      console.log(this.myOptions[i].id);
      if(this.myOptions[i].id==event[0]){

        this.selektovaniObjekat = this.myOptions[i].name;
        console.log(this.myOptions[i].name);
      }
    }
    this.getEnergentTip();
    console.log(this.optionsModel);
  }

  onChangeEneTip() {
    console.log(this.eneTipIzbor);
  }

  leapYear(a){
    var result;
    var year;
    console.log(a);
    year = parseInt(a);
    if (year%400==0){
      result = true
    }
    else if(year%100==0){
      result = false
    }
    else if(year%4==0){
      result= true
    }
    else{
      result= false
    }
    return result
  }

  onSubmit() {

    if(this.leapYear(this.m.godDo))
    {
      this.dana_mesec['02']=29;
      console.log("SDFGHJKLLLLP:KKLHJKJLHJKGH");
    }
    switch(this.indikator) {
      case 'pov': {
        this.podaci.splice(0,this.podaci.length);
        this.labela = 'm2';

        break;
      }
      case 'zap': {
        this.podaci.splice(0,this.podaci.length);
        this.labela = 'm3';

        break;
      }
      case 'kor': {
        this.podaci.splice(0,this.podaci.length);
        this.labela = 'korisniku';

        break;
      }
      default: {
        //statements;
        break;
      }
    }

    console.log("izvestaj/spec_mes_pot?obj_id="+this.optionsModel+"&ene_tip_id="+this.eneTipIzbor+"&datum_od="+'01'+'.'+this.m.mesOd+'.'+this.m.godOd+"&datum_do="+this.dana_mesec[this.m.mesDo.toString()]+'.'+this.m.mesDo+'.'+this.m.godDo+"&indikator="+this.indikator);

    this.crudService.getData("izvestaj/spec_mes_pot?obj_id="+this.optionsModel+"&ene_tip_id="+this.eneTipIzbor+"&datum_od="+'01'+'.'+this.m.mesOd+'.'+this.m.godOd+"&datum_do="+this.dana_mesec[this.m.mesDo.toString()]+'.'+this.m.mesDo+'.'+this.m.godDo+"&indikator="+this.indikator).subscribe(
      data => {this.podaci = data;
        this.period = this.m.mesOd + "." + this.m.godOd + "--" + this.m.mesDo + "." + this.m.godDo;
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA"); console.log(data);},
      error => {console.log(error); this.router.navigate(['/login']);}
    );

  }

//   onYearChangeOd(event:any) {
//     console.log(event);
//     this.godOd = event;
//     console.log('15'+'.'+this.mesOd+'.'+this.godOd);
// }
//
//   onMonthChangeOd(event:any) {
//     console.log(event);
//     this.mesOd = event;
//     console.log('15'+'.'+this.mesOd+'.'+this.godOd);
//   }
//
//   onYearChangeDo(event:any) {
//     console.log(event);
//     this.godDo = event;
//     console.log('15'+'.'+this.mesDo+'.'+this.godDo);
//   }
//
//   onMonthChangeDo(event:any) {
//     console.log(event);
//     this.mesDo = event;
//     console.log('15'+'.'+this.mesDo+'.'+this.godDo);
//   }
//
//   postaviDatume(){
//     var today = new Date();
//
//     this.godOd = today.getFullYear().toString();
//     this.mesOd = '01';
//
//     this.godDo = today.getFullYear().toString();
//     this.mesDo;
//
//     var mesec = today.getMonth()+1;
//
//     if(mesec<10) {
//       this.mesDo='0'+mesec;
//     }
//
//   }


  convert(){
    var item = [{
      naziv: "Petar Petrovic Njegos",
      potrosnja: "345",
      emisija: "2345,89",
      iznos: "12345,89"
    },
      {
        naziv: "20. Oktobar",
        potrosnja: "234,7",
        emisija: "2234,56",
        iznos: "1234,34"
      },
      {
        naziv: "Svetozar Miletic",
        potrosnja: "3452,98",
        emisija: "233,83",
        iznos: "12345,83"
      }
    ];
    var doc = new jsPDF();
    var col = ["Energent", "Godina", "Mesec", "Kolicina", "Kolicina [kWh]", "Emisija CO2", "Iznos [din]" ];
    var rows = [];
    var styles = {halign: 'right'};

    for(var key in this.podaci){
      //ovo sam uradio da mi ne prikazuje null-ove u tabeli
      if(this.podaci[key].energent== null){
        this.podaci[key].energent = "";
      }
      if(this.podaci[key].godina== null){
        this.podaci[key].godina = "";
      }
      if(this.podaci[key].mesec== null){
        this.podaci[key].mesec = "";
      }
      if(this.podaci[key].kolicina== null){
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
      var temp = [this.podaci[key].energent, this.podaci[key].godina, this.podaci[key].mesec, this.podaci[key].kolicina, this.podaci[key].kolicinaKwh, this.podaci[key].emisijaCo2, this.podaci[key].iznos];
      rows.push(temp);
    }
    doc.text(40, 10, "Specifična mesecna potrosnja za objekat: \n"+this.selektovaniObjekat+ "\nza period: "+ this.period);
    doc.autoTable(col, rows, {
      startY: 25,
      // margin: {horizontal: 7},
      // bodyStyles: {valign: 'top'},
      // styles: {overflow: 'linebreak', columnWidth: 'wrap'},
      // columnStyles: {text: {columnWidth: 'auto'}}
      //styles: {overflow: 'linebreak', columnWidth: 'wrap'}
      //  styles: {cellPadding: 0.5, fontSize: 4, halign: 'left'}
    });

    doc.save('SpecMesPot'+this.selektovaniObjekat+'.pdf');
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
    anchor.download = "specificna_mesecna_potrosnja.xls";
    anchor.click();

  }


}
