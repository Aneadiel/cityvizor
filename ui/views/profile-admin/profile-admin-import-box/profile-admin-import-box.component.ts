import { Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';

import { ToastService } 		from '../../../services/toast.service';
import { DataService } 		from '../../../services/data.service';

import { FileUploader, FileItem } from "ng2-file-upload";

import { AppConfig } from '../../../config/app-config';

@Component({
	moduleId: module.id,
	selector: 'profile-admin-import-box',
	templateUrl: 'profile-admin-import-box.template.html',
	styleUrls: ['profile-admin-import-box.style.css']
})
export class ProfileAdminImportBoxComponent {

	appConfig:any = AppConfig;

	@ViewChild('eventsFile') eventsFile;
	@ViewChild('expendituresFile') expendituresFile;
	
	@Input() profile:any;

	@Input() budget:any;

	@Output() save:EventEmitter<any> = new EventEmitter();
	@Output() saved:EventEmitter<any> = new EventEmitter();
	@Output() error:EventEmitter<any> = new EventEmitter();
	
	today:Date = new Date();

	editState:boolean = false;
	deleteState:boolean = false;

	constructor(private dataService: DataService, private toastService: ToastService) {
	}

	importData(form){
		
		let eventsFile = this.eventsFile.nativeElement.files[0];
		let expendituresFile = this.expendituresFile.nativeElement.files[0];
		
		if(!form.valid || !eventsFile || !expendituresFile){
			this.toastService.toast("Formulář není správně vyplněn","error");
			return;
		}
		
		let formData: FormData = new FormData();
		
		let data = form.value;
		
		formData.set("validity",data.validity);
		formData.set("note",data.note);
		
		formData.set("eventsFile",eventsFile,eventsFile.name);
		formData.set("expendituresFile",expendituresFile,expendituresFile.name);
		
		this.dataService.saveProfileBudget(this.profile._id,this.budget.year,formData)
			.then(result => this.saved.emit(result))
			.catch(response => {
				if(response.status === 400) this.error.emit(response.text());
				else if(response.status === 0) this.error.emit("Nepodařilo se kontaktovat server. Zkontrolujte připojení k internetu.");
				else this.error.emit("Nastala neznámá chyba. Kontaktujte prosím správce aplikace Cityvizor.");
			});
		
		this.save.emit();
				
		return false;
	}

	deleteData(){
	
		this.dataService.deleteProfileBudget(this.profile._id,this.budget.year)
			.then(() => this.saved.emit())
			.catch(err => this.toastService.toast("Nepodařilo se smazat rozpočtový rok [" + err.message + "]","error"));
		
	}

}