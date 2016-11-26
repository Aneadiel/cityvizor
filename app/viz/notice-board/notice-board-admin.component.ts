import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ToastService } 		from '../../services/toast.service';
import { NoticeBoardService } from '../../services/notice-board.service';

@Component({
	moduleId: module.id,
	selector: 'notice-board-admin',
	templateUrl: 'notice-board-admin.template.html',
	styles: [],
})
export class NoticeBoardAdminComponent {

	@Input()
	set data(data){
		this._data = data;
		this.findDashboard();
	}
	 
	 @Output() save = new EventEmitter();

	 dashboards;

	 lists = {
		 "nuts3":[],
		 "nuts4":[]
		 "dashboards":[],
	 }
	 
	 nuts3;
	 nuts4;

	 constructor(private _nbs: NoticeBoardService){
		 this.loadBoards();
	 }

	 loadBoards(){
		 this._nbs.getBoards().then(dashboards => {
			 this.dashboards = dashboards;
			 
			 this.dashboards.nuts3.sort((a,b) => a.name > b.name ? 1 : (a.name < b.name ? -1 : 0));
			 this.dashboards.nuts4.sort((a,b) => a.name > b.name ? 1 : (a.name < b.name ? -1 : 0));
			 this.dashboards.dashboards.sort((a,b) => a.name > b.name ? 1 : (a.name < b.name ? -1 : 0));
			 
			 this.lists.nuts3 = this.dashboards.nuts3;
			 
			 this.findDashboard();
			 
			 console.log(dashboards);
		 });
	 }
	 
	 nuts3Select(nuts3){
		 this.nuts3 = nuts3;
		 this.lists.nuts4 = this.dashboards.nuts4.filter(item => item.nuts3 === this.nuts3);
		 this.nuts4Select(this.lists.nuts4[0] ? this.lists.nuts4[0].id : null);
	 }

	 nuts4Select(nuts4){
		 this.nuts4 = nuts4;
		 this.lists.dashboards = this.dashboards.dashboards.filter(item => this.nuts4 ? item.nuts4 === this.nuts4 : item.nuts3 === this.nuts3);	 
	 }

	dashboardSelect(id){
		this._data.id = id * 1;
	}
	 
	 findDashboard(){
		 
		 if(!this.dashboards) return;
		 
		 var dashboard;
		 this.dashboards.dashboards.some(item => {
			 if(item.id === this._data.id){
				 dashboard = item;
				 return true;
			 }
		 });
		 
		 if(!dashboard) return;
		 
		 this.nuts3Select(dashboard.nuts3);
		 this.nuts4Select(dashboard.nuts4);
	 }

}