import { Injectable } from '@angular/core';
import { WineService } from '../services/wine.service';
import { MessageService } from '../services/message.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
      private wineSvc: WineService, private messageSvc: MessageService) { }

  DownloadCsvFile() {
    this.wineSvc.ExportVine().subscribe((excelData: any) => {
        const filename: string = 'Vindata';
        const headerList: string[] = Object.keys(excelData[0]);

        let csvData = this.ConvertToCsv(excelData, headerList);

        let blob = new Blob(['\ufeff' + csvData], {type: 'text/csv;charset=utf-8;'});
        let downloadLink = document.createElement("a");

        let url = URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
        if (isSafariBrowser){
            downloadLink.setAttribute("target", "_blank");
        }
        downloadLink.setAttribute("target", "_blank");
        downloadLink.setAttribute("href", url);
        downloadLink.setAttribute("download", filename + ".csv");
        downloadLink.style.visibility = "hidden";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    },
    error => {
      this.messageSvc.error(error.message, false);    
    });    
  }

  ConvertToCsv(objArray, headerList: string[]): string {

    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let output: string = '';

    let columnNames: string = 'ID;';
    for (let index in headerList) {
      columnNames += headerList[index] + ';'
    }
    columnNames = columnNames.slice(0, -1);
    

    output += columnNames + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i+1)+'';
      for (let index in headerList) {
        let head = headerList[index];
        let value = array[i][head] != undefined ? array[i][head] : '';
        line += ';' + value;
      }
      output += line + '\r\n';
    }
    return output;
  }
}
