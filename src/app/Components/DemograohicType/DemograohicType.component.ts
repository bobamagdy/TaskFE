import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateUpdateDemographicTypeDto } from 'src/app/Dtos/CreateUpdateDemographicTypeDto';
import { DemographicTypeDto } from 'src/app/Dtos/DemographicTypeDto';
import { DemographicTypeService } from 'src/app/Services/DemographicType.service';
import { ToastrService } from 'ngx-toastr';
import { CreateUpdateDto } from 'src/app/Dtos/CreateUpdateDto';
import { DemographicTypeDTLDto } from 'src/app/Dtos/DemographicTypeDTLDto';
import { CreateUpdateDetailsDto } from 'src/app/Dtos/CreateUpdateDetailsDto';
import { DemographicTypeDTLService } from 'src/app/Services/DemographicTypeDTL.service';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';

@Component({
  selector: 'app-DemograohicType',
  templateUrl: './DemograohicType.component.html',
  styleUrls: ['./DemograohicType.component.css']
})
export class DemograohicTypeComponent implements OnInit {
  //#region declare properities
  listId:Array<number>;
  type:DemographicTypeDto;
  objectById:any;
  object:any;
  TypeId:number;
  typeDescAr:any;
  form: FormGroup;
  EditMode=false;
  submitted=false;
  InAddCase=false;
  list: DemographicTypeDto[]=[];
  TempList: DemographicTypeDto[]=[];
  editList:Array<boolean>=[];
  selectedObject: DemographicTypeDto={demTypeId:0,typeDescAr:'',typeDescEn:'',editMode:false};
  viewTable: boolean=false;
  ViewDetailsTable: boolean=false;
  detailsList: DemographicTypeDTLDto[]=[];
  newList: DemographicTypeDTLDto[]=[];
  detailsListTemp: any;
  //#endregion

  constructor(private toaster: ToastrService,private demographicTypeDTLService:DemographicTypeDTLService,private demographicTypeService:DemographicTypeService,public fb: FormBuilder,) {
    this.form = new FormGroup({
      'demTypeId':new FormControl(0),
      'typeDescAr': new FormControl(null),
      'typeDescEn': new FormControl(null),
    });
    this.list=[];
    this.TempList =[];
  }

  ngOnInit() {
    this.GetAllData();
    this.getAllIds();
  }
//#region Master Data
GetAllData(){
  this.demographicTypeService.GetAll().subscribe(
    (res)=>{
      this.object=res;
      this.list=this.object.$values,
      this.TempList=[];
      this.list.forEach(element => {
        var obje:DemographicTypeDto={
          demTypeId: 0
        };
        obje.demTypeId=element.demTypeId;
        obje.typeDescAr=element.typeDescAr;
        obje.typeDescEn=element.typeDescEn;
        this.TempList.push(obje)
        // this.TempList.push(element.demTypeId,element.typeDescAr)
      });
  },
    (err)=>{}
  )
}
getAllIds(){
  this.list.forEach(element => {
    this.listId.push(element.demTypeId);
  });
}
SaveInAddCase(){
  if (this.form.invalid) {
    return;
  }
  if(this.form.get("typeDescAr")?.value==null){
    this.toaster.error("Description Name Arabic Is Required");
  }
  const Dto: CreateUpdateDemographicTypeDto = this.form.value
  if(Dto.demTypeId==0){
    this.Create(Dto);
  }else{
    this.Update(Dto);
  }
}
//#region

//#region Details Data
getTypeById(){
  this.TypeId=this.type.demTypeId;
  this.demographicTypeService.GetById(this.TypeId).subscribe(
   (res)=>{
   this.objectById=res;
   this.typeDescAr=this.objectById.typeDescAr,
   this.ViewDetailsTable=true,
   this.detailsList=this.objectById.demographicTypeDTLTbls.$values;
   if(this.detailsList.length==0){
     this.addNewRowDetails();
   }
   this.newList=[];
   this.detailsList.forEach(element => {
    var object:DemographicTypeDTLDto={
      choicesAr: '', choicesEn: '',
      demTypeDTL_ID: 0,
      demTypeID: 0,
      weightValue: 0,
      //demographicTypeTbl: {}
    };
    object.choicesAr=element.choicesAr;
    object.choicesEn=element.choicesEn;
    object.demTypeDTL_ID=element.demTypeDTL_ID;
    object.weightValue=element.weightValue;
    object.demTypeID=element.demTypeID;
    this.newList.push(object)
    // this.TempList.push(element.demTypeId,element.typeDescAr)
  });
 },
    (err)=>{}
  )
}
//#endregion




  buildForm(Dto: DemographicTypeDto) {
    this.form = this.fb.group({
      DemTypeId: [Dto?.demTypeId],
      TypeDescAr: [Dto?.typeDescAr, Validators.required],
      TypeDescEn: [Dto?.typeDescEn],
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }


SaveAndUpdateInTableMaster(){
  var obj:CreateUpdateDto={
    addList: [],
    updateList: []
  };

  console.log(this.list);
  this.list.forEach((element,Index) => {
    if(element.demTypeId==0){
      obj.addList.push(element);
}else{
  if(this.checkUpdatedRow(element,Index)){
    obj.updateList.push(element)
  }
}
  });

  this.list.forEach(element => {

  });
  console.log(obj);
  if(obj.addList.length<1&&obj.updateList.length<1){
    this.toaster.warning("No Changes Is Occured");
  }else{
    this.demographicTypeService.CreateUpdate(obj).subscribe(
      (res)=>{
        this.GetAllData();
        setTimeout(() => {
          if(obj.addList.length>0&&obj.updateList.length<1){
            this.toaster.success(`${obj.addList.length} Items Is Added Successfully`)
          }else if(obj.updateList.length>0&&obj.addList.length<1){
            this.toaster.success(`${obj.updateList.length} Items Is Updated Successfully`)
          }else if(obj.addList.length>0&&obj.updateList.length>0){
            this.toaster.info(`${obj.addList.length} Items Is Added Successfully & ${obj.updateList.length} Items Is Updated Successfully`)
          }}, 5);
    },
      (err)=>this.toaster.error("Operation is field")
    )
  }



}
  save(){
if(this.InAddCase){
  this.SaveInAddCase();
}else if(this.viewTable){
  this.SaveAndUpdateInTableMaster();
}
  }

  Create(dto:CreateUpdateDemographicTypeDto){
    this.demographicTypeService.Create(dto).subscribe(
      (succ)=>{this.toaster.success("Saved Successfully");    this.GetAllData();
    },
      (err)=>{});
  }
  Update(dto:CreateUpdateDemographicTypeDto){
    this.demographicTypeService.Update(dto).subscribe(
      (succ)=>{},
      (err)=>{});
  }
  ActiveInAddCase(){
    this.InAddCase=!this.InAddCase;
    this.viewTable=false;
  }
  EditActive(id:any){
    debugger
    //this.form.get("TypeDescAr")?.setValue()

  }




  Save(){
    var obj:CreateUpdateDto={
      addList: [],
      updateList: []
    };

    console.log(this.list);
    this.list.forEach((element,Index) => {
      if(element.demTypeId==0){
        obj.addList.push(element);
  }else{
    if(this.checkUpdatedRow(element,Index)){
      obj.updateList.push(element)
    }
  }
    });

    this.list.forEach(element => {

    });
    console.log(obj);
    this.demographicTypeService.CreateUpdate(obj).subscribe(
      (res)=>this.toaster.success("Operation is successfully"),
      (err)=>this.toaster.error("Operation is field")
    )
    }



    checkUpdatedRow(element:DemographicTypeDto,index:number){
      debugger
      if(element.demTypeId!==this.TempList[index].demTypeId||
        element.typeDescAr!==this.TempList[index].typeDescAr||
        element.typeDescEn!==this.TempList[index].typeDescEn){
          return true;
        }
        return false;
    }
    addNewRow(){
     this.list.push({demTypeId:0})
    }
    DeleteRow(index:number){
      // this.list.push({})
      if(confirm("Are you sure to delete "+name)) {
        console.log("Implement delete functionality here");
        this.demographicTypeService.Delete(this.list[index].demTypeId).subscribe(
          (res)=>{
            this.toaster.success("Delete Is Success"),this.list.splice(index,1)
            setTimeout(() => {
              this.GetAllData();
            }, 1);},
          (err)=>console.log("failed")
        )
      }

     }
     viewAll(){
       this.viewTable=!this.viewTable;
       this.InAddCase=false;
     }

     addNewRowDetails(){
      this.detailsList.push({
      choicesAr: '', choicesEn: '',
      demTypeDTL_ID: 0,
      demTypeID: this.TypeId,
      weightValue:undefined,
      //demographicTypeTbl: this.objectById
    })
     }

     DeleteRowDetails(index:number){
      if(confirm("Are you sure to delete ")) {
        console.log("Implement delete functionality here");
        this.demographicTypeDTLService.Delete(this.detailsList[index].demTypeDTL_ID).subscribe(
          (res)=>{this.toaster.success("Delete Is Success"),this.detailsList.splice(index,1)},
          (err)=>console.log("failed")
        )
      }




     }

     checkUpdatedRowDetails(element:DemographicTypeDTLDto,index:number){
      debugger
      if(element.choicesAr!==this.newList[index].choicesAr||
        element.choicesEn!==this.newList[index].choicesEn||
        element.demTypeDTL_ID!==this.newList[index].demTypeDTL_ID||
        element.weightValue!==this.newList[index].weightValue||
        element.demTypeID!==this.newList[index].demTypeID){
          return true;
        }
        return false;
     }

     SaveDetails(){
      console.log(this.newList);
      console.log(this.detailsList);

      var obj:CreateUpdateDetailsDto={
        addList: [],
        updateList: []
      };

      console.log(this.list);
      this.detailsList.forEach((element,Index) => {
        if(element.demTypeDTL_ID==0){
          obj.addList.push(element);
    }else{
      if(this.checkUpdatedRowDetails(element,Index)){
        var updatedRow:DemographicTypeDTLDto={
          demTypeDTL_ID: 0,
          demTypeID: 0,
          choicesAr: '',
          choicesEn: '',
          weightValue:0
        };
        updatedRow.choicesAr=element.choicesAr;
        updatedRow.choicesEn=element.choicesEn;
        updatedRow.demTypeDTL_ID=element.demTypeDTL_ID;
        updatedRow.demTypeID=element.demTypeID;
        updatedRow.weightValue=element.weightValue;
        obj.updateList.push(updatedRow)
      }
    }
      });

if(obj.addList.length<1&&obj.updateList.length<1){
  this.toaster.warning("No Changes Is Occured");
}else{
  this.demographicTypeService.CreateUpdateDetails(obj).subscribe(
    (res)=>{
      if(obj.addList.length>0&&obj.updateList.length<1){
      this.toaster.success(`${obj.addList.length} Items Is Added Successfully`)
    }else if(obj.updateList.length>0&&obj.addList.length<1){
      this.toaster.success(`${obj.updateList.length} Items Is Updated Successfully`)
    }else if(obj.addList.length>0&&obj.updateList.length>0){
      this.toaster.info(`${obj.addList.length} Items Is Added Successfully & ${obj.updateList.length} Items Is Updated Successfully`)
    }
    this.getTypeById();
  },err=>{}
  )
}

     }
}
