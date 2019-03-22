export class ImportedRecord {
	paragraph: number;
	item: number;
	event: number;
	budgetAmount: number = 0;
	amount: number = 0;
}

export class ImportedPayment {
	type: string;
	id: string;
	counterparty_id: string;
	counterparty_name: string;
	amount: number;
	comment: string;
	paragraph: number;
	item: number;
	event: number;
}

export class ImportedEvent {
	srcId: number;
	name: string;
}

export class ImportedData {
	payments: ImportedPayment[] = [];
	records: ImportedRecord[] = [];
	events: ImportedEvent[] = [];
};