import { Component, Input } from '@angular/core';

// array with groups that vizualization is made of (fixed, does not vary with data) 
const ChartGroups = [
	{"id":"10", "title": "Zemědělství, lesní hospodářství a rybářství"},
	{"id":"21", "title": "Průmysl, stavebnictví, obchod a služby"},
	{"id":"22", "title": "Doprava"},
	{"id":"23", "title": "Vodní hospodářství"},
	{"id":"24", "title": "Spoje"},
	{"id":"25", "title": "Všeobecné hospodářské záležitosti a ostatní ekonomické funkce"},
	{"id":"31", "title": "Vzdělávání a školské služby"},
	{"id":"32", "title": "Vzdělávání a školské služby"},
	{"id":"33", "title": "Kultura, církve a sdělovací prostředky"},
	{"id":"34", "title": "Tělovýchova a zájmová činnost"},
	{"id":"35", "title": "Zdravotnictví"},
	{"id":"36", "title": "Bydlení, komunální služby a územní rozvoj"},
	{"id":"37", "title": "Ochrana životního prostředí"},
	{"id":"38", "title": "Ostatní výzkum a vývoj"},
	{"id":"39", "title": "Ostatní činnosti související se službami pro obyvatelstvo"},
	{"id":"41", "title": "Dávky a podpory v sociálním zabezpečení"},
	{"id":"42", "title": "Politika zaměstnanosti"},
	{"id":"43", "title": "Sociální služby a společné činnosti v sociálním zabezpečení a politice zaměstnanosti"},
	{"id":"51", "title": "Obrana"},
	{"id":"52", "title": "Civilní připravenost na krizové stavy"},
	{"id":"53", "title": "Bezpečnost a veřejný pořádek"},
	{"id":"54", "title": "Právní ochrana"},
	{"id":"55", "title": "Požární ochrana a integrovaný záchranný systém"},
	{"id":"61", "title": "Státní moc, státní správa, územní samospráva a politické strany"},
	{"id":"62", "title": "Jiné veřejné služby a činnosti"},
	{"id":"63", "title": "Finanční operace"},
	{"id":"64", "title": "Ostatní činnosti"}
];

const ChartGroups2 = [
	{"id": "1", "title": "Zemědělství, lesní hospodářství a rybářství"},
	{"id": "2", "title": "Průmyslová a ostatní odvětví hospodářství"},
	{"id": "3", "title": "Služby pro obyvatelstvo"},
	{"id": "4", "title": "Sociální věci a politika zaměstnanosti"},
	{"id": "5", "title": "Bezpečnost státu a právní ochrana"},
	{"id": "6", "title": "Všeobecná veřejná správa a služby"}
];


/*

Component for graphical vizualization of expenditures

*/
@Component({
	moduleId: module.id,
	selector: 'expenditure-viz',
	templateUrl: 'expenditure-viz.template.html',
	styles: [`

		div.drawing{background-color:rgba(0,0,0,0.02);}

		svg{margin:0 auto;display:block;}
		.stripe{cursor:pointer;border:2px solid #fff;}
		.stripe.active{background-color:#f00;}
		.bgstripe{opacity:0;cursor:pointer;}
		.bgstripe:hover, .bgstripe.active{opacity:0.2;}

		.circle{cursor:pointer;}

		.viztable{width:100%;}
		.viztable th{font-weight:normal;}
		.viztable td{font-weight:normal;width:150px;text-align:right;}
	`]
})
export class ExpenditureVizComponent{
	
	// the dimensions of the drawing	
	scale: number = 1;
	r: number = 500;	// set according to drawingElSize
 	cx: number = 500;
 	cy: number = 500;
	innerSize: number = 0.003;
	minSize: number = 0.003;

	// array with groups that vizualization is made of (fixed, does not vary with data)
	groups: Array<{id: string, title: string}> = [];
  // which group (drawing stripe) is hovered at the moment
	hoverGroup: any = null;
	// which group (drawign stripe) has been clicked and is open at the moment
	selectedGroup: any = null;

	// the data used in vizualization, imputted by data attribute of its DOM element
	@Input()
	data = {
		groups: [],
		budgetAmount: 0,
		groupIndex: {},
		maxBudgetAmount: 0
	}
	
	constructor(){
		this.groups	= ChartGroups; // set groups
	}
 
	// select group (e.g. after clicking a stripe)
	selectGroup(group){
		this.selectedGroup = group;
		this.scale = this.selectedGroup !== null ?  0.5 : 1;
	}

	getCircleR(){
		return Math.sqrt(this.innerSize) * this.r;	
	}

	// generate path for group expenditures
	getEStripePath(i,group){
		var inner = 0
		var outer = this.innerSize + this.minSize + (1 - this.minSize - this.innerSize) * (this.data.groupIndex[group.id] && this.data.maxBudgetAmount ? this.data.groupIndex[group.id].expenditureAmount / this.data.maxBudgetAmount : 0);
		return this.getStripePath(i,inner,outer);
	}

	// generate path for group total budget minus expenditures
	getBStripePath(i,group){
		var inner = this.innerSize + this.minSize + (1 - this.minSize - this.innerSize) * (this.data.groupIndex[group.id] && this.data.maxBudgetAmount ? this.data.groupIndex[group.id].expenditureAmount / this.data.maxBudgetAmount : 0);
		var outer = this.innerSize + this.minSize + (1 - this.minSize - this.innerSize) * (this.data.groupIndex[group.id] && this.data.maxBudgetAmount ? (this.data.groupIndex[group.id].budgetAmount - this.data.groupIndex[group.id].expenditureAmount) / this.data.maxBudgetAmount : 0);
		return this.getStripePath(i,inner,outer);
	}

	// generate stripe by index, and inner and outer percentage size
	getStripePath(i,inner,outer){

		i = Math.min(Math.max(i,0),this.groups.length); // i ranges from 0 to number of groups
		inner = Math.max(inner,0); // inner size must be greater than 0
		outer = Math.max(outer,inner); // outer size must be greater than inner

		var innerRadius = Math.sqrt(inner) * this.r; // we want the size to grow with area of the stripe, therefore square root (inner and outer are stil 0~1, but square root shape)
		var outerRadius = Math.sqrt(outer) * this.r;
		var start = this.groups.length ? i / this.groups.length : 0;
		var size = this.groups.length ? 1 / this.groups.length : 0;
		return this.generateStripePath(this.cx,this.cy,innerRadius,outerRadius,start,size);	
	}

	// generate SVG path attribute string for a donut stripe; start and size are percentage of whole
	generateStripePath(x,y,innerRadius,outerRadius,start,size){
		if(size >= 1) size = 0.9999; // if a stripe would be 100%, then it's circle, this is a hack to do it using this function instead of another
		
		var startAngle = 2 * Math.PI * start;
		var angle =  2 * Math.PI * size;

		var startX1 = x + Math.sin(startAngle) * outerRadius;
		var startY1 = y - Math.cos(startAngle) * outerRadius;
		var endX1 = x + Math.sin(startAngle + angle) * outerRadius;
		var endY1 = y - Math.cos(startAngle + angle) * outerRadius;

		var startX2 = x + Math.sin(startAngle + angle) * innerRadius;
		var startY2 = y - Math.cos(startAngle + angle) * innerRadius;
		var endX2 = x + Math.sin(startAngle) * innerRadius;
		var endY2 = y - Math.cos(startAngle) * innerRadius;

		var outerArc = (size > 0.5 ? 1 : 0); // decides which way will the arc go

		var properties = [];
		properties.push("M" + startX1 + "," + startY1);
		properties.push("A" + outerRadius + "," + outerRadius + " 0 " + outerArc + ",1 " + endX1 + "," + endY1);
		properties.push("L" + startX2 + "," + startY2);
		properties.push("A" + innerRadius + "," + innerRadius + " 0 " + outerArc + ",0 " + endX2 + "," + endY2);
		properties.push("Z");

		return properties.join(" ");	
	}
}