import { Component, Input } from '@angular/core';

import { ToastService } 		from '../../services/toast.service';
import { DataService } 		from '../../services/data.service';

import { Module } from "../../shared/schema";
import { MODULES } from "../../shared/modules";

@Component({
	moduleId: module.id,
	selector: 'entity-admin-modules',
	templateUrl: 'entity-admin-modules.template.html',
	styles: [],
})
export class EntityAdminModulesComponent {

	@Input()
	profile: any;

	 modules: Module[];

	 constructor(private _ds: DataService, private _toastService: ToastService) {
		 this.modules = MODULES;
	 }
	 
	 setViewState(view: string,value: boolean){

		 var oldValue = this.profile.modules[view];

		 this.profile.modules[view] = value;

		 this._ds.saveProfile(this.profile)
			 .then((profile) =>  this._toastService.toast("Uloženo.", "notice"))
			 .catch((err) => {
				 this.profile.modules[view] = oldValue;
				 this._toastService.toast("Nastala chyba při ukládání","error");
			 });
	 }

	}