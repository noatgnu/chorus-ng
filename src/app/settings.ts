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
    const legendPos = this.legendOrder.indexOf(dataset)
    if (legendPos > -1) {
      this.legendOrder.splice(legendPos, 1)
    }
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

  updateDatasetName(oldName: string, newName: string) {
    this.importedFile[newName] = Object.assign({}, this.importedFile[oldName])
    this.filter[newName] = this.filter[oldName].map((a: any) => {
      return Object.assign({}, a)
    })
    this.pathogenicityFilter[newName] = Object.assign({}, this.pathogenicityFilter[oldName])
    if (this.visible[oldName]) {
      this.visible[newName] = Object.assign({},this.visible[oldName])
    }
    if (this.color_map[oldName]) {
      this.color_map[newName] = Object.assign({},this.color_map[oldName])
    }
    const legendPos = this.legendOrder.indexOf(oldName)
    if (legendPos > -1) {
      this.legendOrder[legendPos] = newName
    }

    for (const pos in this.selected) {
      for (const orig in this.selected[pos]) {
        for (const mut in this.selected[pos][orig]) {
          if (this.selected[pos][orig][mut][oldName]) {
            this.selected[pos][orig][mut][newName] = Object.assign({},this.selected[pos][orig][mut][oldName])
            this.selected[pos][orig][mut][newName].hovertext = this.selected[pos][orig][mut][newName].hovertext.replace(oldName, newName)
            delete this.selected[pos][orig][mut][oldName]
          }
        }
      }
    }
    this.removeDataset(oldName)
  }

  removeUserSelection(selection: string) {
    delete this.selection[selection]
    const pos = this.userSelection.indexOf(selection)
    if (pos > -1) {
      this.userSelection.splice(pos, 1)
    }
    if (this.pathogenicityFilter[selection]) {
      delete this.pathogenicityFilter[selection]
    }
    if (this.visible[selection]) {
      delete this.visible[selection]
    }
    if (this.color_map[selection]) {
      delete this.color_map[selection]
    }

    const legendPos = this.legendOrder.indexOf(selection)
    if (legendPos > -1) {
      this.legendOrder.splice(legendPos, 1)
    }

    for (const pos in this.selected) {
      for (const orig in this.selected[pos]) {
        for (const mut in this.selected[pos][orig]) {
          if (this.selected[pos][orig][mut][selection]) {
            delete this.selected[pos][orig][mut][selection]
          }
        }
      }
    }
  }
}
