import { Injectable } from '@angular/core';
import {DataFrame, IDataFrame} from "data-forge";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  currentData: { [key: string]: any } = {}
  alphamissenseVariantData: IDataFrame<number, any> = new DataFrame()
  reDrawTrigger: Subject<boolean> = new Subject<boolean>()
  constructor() { }
}
