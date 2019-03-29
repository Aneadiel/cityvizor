import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as iconv from "iconv-lite";

import { AccountingData, ImportedData, AccountingPayment, AccountingRecord, ImportedPayment, ImportedRecord, AccountingEvent, ImportedEvent } from 'app/shared/schema';
import { Buffer } from 'buffer';

interface ExportOptions {
  encoding: string;
  delimiter: string;
  newline: string;
  header?: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  async exportRecords(records: (ImportedRecord | AccountingRecord)[], options: ExportOptions) {
    await this.downloadFile(this.createCSV(records, options), "records.csv", options.encoding);
  }
  async exportPayments(payments: (ImportedPayment | AccountingPayment)[], options: ExportOptions) {
    await this.downloadFile(this.createCSV(payments, options), "records.csv", options.encoding);
  }
  async exportEvents(events: (ImportedEvent | AccountingEvent)[], options: ExportOptions) {
    await this.downloadFile(this.createCSV(events, options), "events.csv", options.encoding);
  }
  async exportCityVizorData(data: ImportedData | AccountingData, options: ExportOptions) {
    const records = [];
    records.push(...(<(ImportedRecord | AccountingRecord)[]>data.records).map(record => ({
      type: null,
      paragraph: record.paragraph,
      item: record.item,
      event: record.event,
      amount: record.amount,
      budgetAmount: record.budgetAmount
    })));
    records.push(...(<(ImportedPayment | AccountingPayment)[]>data.payments).map(payment => ({
      type: payment.type === "invoice_incoming" ? "KDF" : "KOF",
      paragraph: payment.paragraph,
      item: payment.item,
      event: payment.event,
      amount: payment.amount,
      date: payment.date,
      counterpartyId: payment.counterpartyId,
      counterpartyName: payment.counterpartyName,
      description: payment.description
    })));
    await this.downloadFile(this.createCSV(records, options), "data.csv", options.encoding);
  }

  async exportCityVizorEvents(data: ImportedData | AccountingData, options: ExportOptions) {
    const events = (<(ImportedEvent | AccountingEvent)[]>data.events).map(event => ({
      srcId: event.srcId,
      name: event.name
    }));
    await this.downloadFile(this.createCSV(events, options), "events.csv", options.encoding);
  }

  createCSV(data: any[], options: ExportOptions) {

    var header = options.header;

    if (!header) {
      header = data.reduce((acc, cur) => {
        Object.keys(cur).forEach(key => acc[key] = key);
        return acc;
      }, {});
    }

    // initiate csv string
    var csv = "";

    // create header
    csv += Object.values(header).join(options.delimiter) + options.newline;

    // append rows
    data.forEach(row => {
      csv += Object.keys(header)
        .map(key => {
          const value = row[key];
          if (typeof value === "string") return "\"" + value + "\"";
          if (typeof value === "number") return String(value).replace(".", ",");
          if (value instanceof Date) return value.toISOString();
          if (!value) return "";
          return "[Invalid value]";
        })
        .join(options.delimiter)
      csv += options.newline;
    });

    return csv;

  }

  downloadFile(data: string, filename: string, encoding: string) {
    const buffer = iconv.encode(data, encoding);
    var blob = new Blob([this.toArrayBuffer(buffer)], { type: "text/plain;charset=" + this.encodingToCharset(encoding) });
    saveAs(blob, filename);
  }

  toArrayBuffer(myBuf: Buffer): ArrayBuffer {
    var myBuffer = new ArrayBuffer(myBuf.length);
    var res = new Uint8Array(myBuffer);
    for (var i = 0; i < myBuf.length; ++i) {
      res[i] = myBuf[i];
    }
    return myBuffer;
  }

  encodingToCharset(encoding: string): string {
    return encoding.replace("win", "windows-");
  }

}
