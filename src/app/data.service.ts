import { Injectable } from '@angular/core';
import {DataFrame, IDataFrame} from "data-forge";
import {Subject} from "rxjs";
import {VariantSimple} from "./variant-simple";
import {Variant} from "./protein-query";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  currentData: { [key: string]: IDataFrame } = {}
  reDrawTrigger: Subject<boolean> = new Subject<boolean>()
  updateTrigger: Subject<boolean> = new Subject<boolean>()
  annotationTrigger: Subject<{ variant: Variant, status: boolean }> = new Subject<{variant: Variant, status: boolean}>()
  constructor() { }

  aminoAcid3to1: { [key: string]: string } = {
    "ALA": "A",
    "ARG": "R",
    "ASN": "N",
    "ASP": "D",
    "CYS": "C",
    "GLU": "E",
    "GLN": "Q",
    "GLY": "G",
    "HIS": "H",
    "ILE": "I",
    "LEU": "L",
    "LYS": "K",
    "MET": "M",
    "PHE": "F",
    "PRO": "P",
    "SER": "S",
    "THR": "T",
    "TRP": "W",
    "TYR": "Y",
    "VAL": "V",
    "ASX": "B",
    "GLX": "Z",
    "XAA": "X",
    "XLE": "J",
    "TERM": "*"
  }
}
