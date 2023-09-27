export class Settings {
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

  visible :any= {

  }

  selected: any = {}

  legendOrder: string[] = []
}
