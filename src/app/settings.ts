import {ImportedFile} from "./imported-file";
import {VariantSimple} from "./variant-simple";

export class Settings {
  selectionNumber: number = 0
  userSelection: string[] = []
  color_map:any  = {
    "pathogenic": "#ff5671",
    "pathogenic only in Alphamissense": "rgba(255,86,113,0.01)",
    "ambiguous": "#ffc955",
    "ambiguous only in Alphamissense": "rgba(255,201,85,0.01)",
    "benign": "#4e804e",
    "benign only in Alphamissense": "rgba(78,128,78,0.01)",
    "MDSGene - probable pathogenic": "#4a54db",
    "MDSGene - possibly pathogenic": "#29eeed",
    "MDSGene - clearly pathogenic mutations": "#bc64ff",
  }


  protein: string = ""

  visible :any= {

  }

  selected: any = {}

  legendOrder: string[] = []

  legendRename: any = {}

  filter: any = {}

  domains: any[] = []

  importedFile: {[key: string]: ImportedFile} = {}

  pathogenicityFilter: {[key: string]: {[key: string]: boolean} } = {}
  showbackground: boolean = true
  selection: any = {}
  annotations: any = {}
  removeDataset(dataset: string) {
    delete this.importedFile[dataset]
    delete this.filter[dataset]
    delete this.pathogenicityFilter[dataset]
    delete this.visible[dataset]
    delete this.color_map[dataset]
    for (const pos in this.selected) {
      for (const orig in this.selected[pos]) {
        for (const mut in this.selected[pos][orig]) {
          if (this.selected[pos][orig][mut][dataset]) {
            delete this.selected[pos][orig][mut][dataset]
          }
        }
      }
    }

  }
}
