import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Protein, Variant} from "../protein-query";
import {WebService} from "../web.service";
import {SettingsService} from "../settings.service";
import {MatDialog} from "@angular/material/dialog";
import {LegendOrderComponent} from "./legend-order/legend-order.component";
import {LegendRenameComponent} from "./legend-rename/legend-rename.component";
import {DataService} from "../data.service";
import {DataFrame, IDataFrame} from "data-forge";
import {PathogenicityFilterComponent} from "./pathogenicity-filter/pathogenicity-filter.component";
import {ColorPickerComponent} from "./color-picker/color-picker.component";
import {CustomDomainsComponent} from "./custom-domains/custom-domains.component";
import {FormBuilder} from "@angular/forms";
import {VariantSimple} from "../variant-simple";
import {AnnotationEditorComponent} from "./annotation-editor/annotation-editor.component";

@Component({
  selector: 'app-variant-plot',
  templateUrl: './variant-plot.component.html',
  styleUrls: ['./variant-plot.component.scss']
})
export class VariantPlotComponent {
  graphData: any[] = []
  @Output() selected: EventEmitter<VariantSimple[]> = new EventEmitter<VariantSimple[]>()
  defaultColorList: string[] = [
    "#E69F00",
    "#56B4E9",
    "#009E73",
    "#F0E442",
    "#0072B2",
    "#D55E00",
    "#CC79A7",
    "#000000"
  ]
  graphLayout: any = {
    traceorder: 'normal',
    title: 'Variant Plot',
    autosize: true,
    xaxis: {
      title: '',
      showgrid: false,
      showline: true,
      zeroline: false,
      range: [0, 1],
    },
    yaxis: {
      title: 'Score',
      showgrid: false,
      showline: false,
      zeroline: false,
      domain: [0, 0.8],
      range: [0, 1]
    },
    yaxis2: {
      showgrid: false,
      showline: false,
      zeroline: false,
      domain: [0.9, 1],
      showticklabels: false,
      range: [0, 1]
    },
    grid: {
      rows: 2,
      columns: 1,
      pattern: 'independent',
      roworder: 'bottom to top'
    },
    shapes: [],
    annotations: [],
    legend: {
      orientation: 'h',
    }
  }
  config: any = {
    toImageButtonOptions: {
      format: 'svg',
      filename: this.graphLayout.title.text,
      height: this.graphLayout.height,
      width: this.graphLayout.width,
      scale: 1
    }
  }
  uniprotData: any = undefined
  variants: IDataFrame = new DataFrame()
  annotationMap: any = {}
  @Input() set data(value: Protein) {
    this.graphLayout.title = value.name
    this.web.getProteinUniprot(value.id).subscribe((data) => {
      this.uniprotData = data
      this.variants = new DataFrame(value.variants)
      this.drawGraph()
    })

  }

  form = this.fb.group({
    showbackground: [true],
  })
  constructor(private web: WebService, public settings: SettingsService, private dialog: MatDialog, private dataService: DataService, private fb: FormBuilder) {
    this.dataService.reDrawTrigger.subscribe((data) => {
      if (data) {
        this.drawGraph()
      }
    })
    this.form.controls.showbackground.valueChanges.subscribe((data) => {
      if (data !== null) {
        this.settings.settings.showbackground = data
        this.drawGraph()
      }
    })
    this.dataService.annotationTrigger.subscribe((data) => {
      if (data) {
        if (!data.status) {
          this.removeAnnotationLabelForData(data.variant)
        } else {
          if (!this.settings.settings.annotations[`${data.variant.position}${data.variant.original}${data.variant.mutated}`]) {
            this.addAnnotationLabelForData(data.variant)
          }
        }
        console.log(this.settings.settings.annotations)
      }
    })
  }

  drawGraph() {
    console.log(this.settings.settings.annotations)
    const temp: any = {}
    for (const v of this.variants) {
      if (this.settings.settings.selected[v.position]) {
        if (this.settings.settings.selected[v.position][v.original]) {
          if (this.settings.settings.selected[v.position][v.original][v.mutated]) {
            //let groupName: string = `Alphamissense(${v.pathogenicity})`

            let hovertext: string = `<b>Alphamissense</b><br>Pathogenicity: ${v.pathogenicity}<br>Score: ${v.score}<br>Variants: ${v.original}${v.position}${v.mutated}<br>`
            for (const d in this.settings.settings.selected[v.position][v.original][v.mutated]) {
              if (this.settings.settings.pathogenicityFilter[d][this.settings.settings.selected[v.position][v.original][v.mutated][d].pathogenicity] === true) {
                //groupName = groupName + " + " + d
                hovertext = hovertext + this.settings.settings.selected[v.position][v.original][v.mutated][d].hovertext
              }
            }
            for (const d in this.settings.settings.selected[v.position][v.original][v.mutated]) {
              if (this.settings.settings.pathogenicityFilter[d][this.settings.settings.selected[v.position][v.original][v.mutated][d].pathogenicity] === true) {
                const groupName = d
                if (groupName !== ``) {

                  if (!temp[groupName]) {
                    temp[groupName] = {
                      x: [],
                      y: [],
                      text: [],
                      mode: 'markers',
                      type: 'scattergl',
                      marker: {
                        size: 12,
                        line: {
                          width: 1,
                          color: 'rgba(0,0,0,0.5)',
                        }
                      },
                      name: groupName,
                      hoverinfo: 'text',
                      yaxis: 'y',
                      visible: true,
                      data: [],

                    }
                    if (!this.settings.settings.legendRename[groupName]) {
                      this.settings.settings.legendRename[groupName] = groupName
                    } else {
                      temp[groupName].name = this.settings.settings.legendRename[groupName].slice()
                    }
                    if (!this.settings.settings.legendOrder.includes(groupName)) {
                      this.settings.settings.legendOrder.push(groupName)
                    }
                    if (!(groupName in this.settings.settings.visible)) {
                      this.settings.settings.visible[groupName] = true
                    } else {
                      temp[groupName].visible = this.settings.settings.visible[groupName]
                    }

                  }
                  temp[groupName].x.push(v.position)
                  temp[groupName].y.push(v.score)
                  temp[groupName].text.push(hovertext)
                  temp[groupName].data.push(v)
                }
              }
            }

          }
        }
      }
      if (this.settings.settings.showbackground) {
        if (!(v.pathogenicity + " only in Alphamissense" in temp)) {
          temp[v.pathogenicity + " only in Alphamissense"] = {
            x: [],
            y: [],
            mode: 'markers',
            type: 'scattergl',
            marker: { size: 12, color: this.settings.settings.color_map[v.pathogenicity + " only in Alphamissense"] },
            name: v.pathogenicity + " only in Alphamissense",
            hovermode: false,
            hoverinfo: 'skip',
            yaxis: 'y',
            visible: true,
            showlegend: false
          }
          if (!this.settings.settings.legendRename[v.pathogenicity + " only in Alphamissense"]) {
            this.settings.settings.legendRename[v.pathogenicity + " only in Alphamissense"] = v.pathogenicity + " only in Alphamissense"
          } else {
            temp[v.pathogenicity + " only in Alphamissense"].name = this.settings.settings.legendRename[v.pathogenicity + " only in Alphamissense"].slice()
          }
          if (!this.settings.settings.legendOrder.includes(v.pathogenicity + " only in Alphamissense")) {
            this.settings.settings.legendOrder.push(v.pathogenicity + " only in Alphamissense")
          }
          if (!(v.pathogenicity + " only in Alphamissense" in this.settings.settings.visible)) {
            this.settings.settings.visible[v.pathogenicity + " only in Alphamissense"] = true
          } else {
            temp[v.pathogenicity + " only in Alphamissense"].visible = this.settings.settings.visible[v.pathogenicity + " only in Alphamissense"]
          }
        }
        temp[v.pathogenicity + " only in Alphamissense"].x.push(v.position)
        temp[v.pathogenicity + " only in Alphamissense"].y.push(v.score)
      }
    }
    temp["domain"] = {
      x: [],
      y: [],
      mode: 'markers',
      type: 'scattergl',
      marker: { size: 12, opacity: 0.01 },
      name: "domain",
      hovermode: false,
      hoverinfo: 'skip',
      yaxis: 'y2',
      showlegend: false
    }
    const shapes: any[] = []
    const annotations: any[] = []
    if (this.uniprotData) {
      this.graphLayout.title = this.uniprotData["Gene Names"]
      this.graphLayout.xaxis.range = [0, this.uniprotData["Sequence"].length]
      if (this.settings.settings.domains.length > 0) {
        this.uniprotData["domains"] = this.settings.settings.domains
      }
      if (this.uniprotData["domains"]) {
        if (this.uniprotData["domains"].length > 0) {
          for (const d of this.uniprotData["domains"]) {
            shapes.push({
              type: 'rect',
              xref: 'x',
              yref: 'y2',
              x0: d["start"],
              y0: 0,
              x1: d["end"],
              y1: 1,
              fillcolor: '#d3d3d3',
              line: {
                width: 1,
                color: 'rgba(0,0,0,0.5)'
              }
            })
            shapes.push({
              type: 'rect',
              xref: 'x',
              yref: 'y',
              x0: d["start"],
              y0: 0,
              x1: d["end"],
              y1: 1,
              layer: 'below',
              line: {
                width: 1,
                color: 'rgba(0,0,0,0.5)'
              }
            })
            annotations.push({
              x: (d["start"] + d["end"]) / 2,
              y: 0.5,
              xref: 'x',
              yref: 'y2',
              text: `${d["domain"]} ${d["start"]}-${d["end"]}`,
              showarrow: false,
              font: {
                family: 'Arial, monospace',
                size: 9,
              }
            })
          }
        }
      }
      for (let i = 0; i < this.uniprotData["Sequence"].length; i = i+100) {
        shapes.push({
          type: 'line',
          xref: 'x',
          yref: 'y',
          x0: i,
          y0: 0,
          x1: i,
          y1: 1,
          line: {
            color: 'rgba(0,0,0,0.3)',
            width: 1,
            dash: 'dot'
          }
        })
      }
    }
    for (const a in this.settings.settings.annotations) {
      console.log(a)
      console.log(this.settings.settings.annotations[a])
      annotations.push(this.settings.settings.annotations[a])
    }
    const data: any[] = []
    let colorCount = 0
    for (const key of this.settings.settings.legendOrder) {
      if (temp[key]) {
        if (key in this.settings.settings.color_map){
          temp[key].marker.color = this.settings.settings.color_map[key]
          if (this.defaultColorList[colorCount] === this.settings.settings.color_map[key]) {
            colorCount++
            if (colorCount >= this.defaultColorList.length) {
              colorCount = 0
            }
          }
        } else {
          temp[key].marker.color = this.defaultColorList[colorCount]
          this.settings.settings.color_map[key] = this.defaultColorList[colorCount].slice()
          colorCount++
          if (colorCount >= this.defaultColorList.length) {
            colorCount = 0
          }
        }
        data.push(temp[key])
      }
    }
    this.graphLayout.shapes = shapes
    this.graphLayout.annotations = annotations
    this.graphData = data
    this.config = {
      toImageButtonOptions: {
        format: 'svg',
        filename: this.graphLayout.title.text,
        height: this.graphLayout.height,
        width: this.graphLayout.width,
        scale: 1
      }
    }
    console.log(this.graphData)
  }

  legendClickHandler(event: any) {
    if (event.event.srcElement.__data__[0].trace.visible === "legendonly") {
      this.settings.settings.visible[event.event.srcElement.__data__[0].trace.name] = true
    } else {
      this.settings.settings.visible[event.event.srcElement.__data__[0].trace.name] = "legendonly"
    }
  }

  openLegendOrder() {
    const ref = this.dialog.open(LegendOrderComponent)
    ref.componentInstance.legendOrder = [...this.settings.settings.legendOrder]
    ref.afterClosed().subscribe((data) => {
      if (data) {
        if (data.length > 0) {
          this.settings.settings.legendOrder = data
          this.drawGraph()
        }
      }
    })
  }

  openLegendRename() {
    const ref = this.dialog.open(LegendRenameComponent, {width: "50vw"})
    ref.componentInstance.legend= Object.assign({}, this.settings.settings.legendRename)
    ref.afterClosed().subscribe((data) => {
      if (data) {
        this.settings.settings.legendRename = data
        this.drawGraph()
        this.dataService.updateTrigger.next(true)
      }
    })
  }

  openPathogenicityFilter() {
    const ref = this.dialog.open(PathogenicityFilterComponent)
    ref.componentInstance.pathogenicityFilter = Object.assign({}, this.settings.settings.pathogenicityFilter)
    ref.afterClosed().subscribe((data) => {
      if (data) {
        for (const f of data) {
          this.settings.settings.pathogenicityFilter[f.dataset][f.pathogenicity] = f.status
        }
        this.drawGraph()
      }
    })
  }

  openColorPicker() {
    const ref = this.dialog.open(ColorPickerComponent)
    const colors: any[] = []
    for (const d of this.settings.settings.legendOrder) {
      colors.push({color: this.settings.settings.color_map[d], legend: d})
    }
    ref.componentInstance.colors = colors
    ref.afterClosed().subscribe((data) => {
      if (data) {
        for (const d of data) {
          this.settings.settings.color_map[d.legend] = d.color
        }
        this.drawGraph()
      }
    })
  }

  openCustomDomains() {
    const ref = this.dialog.open(CustomDomainsComponent)

    ref.componentInstance.domains = this.settings.settings.domains.map((d: any) => {
      return {
        name: d["domain"].slice(),
        start: d["start"],
        end: d["end"]
      }
    })
    ref.afterClosed().subscribe((data) => {
      if (data) {
        this.settings.settings.domains = data
        this.drawGraph()
      }
    })
  }

  clickHandler(event: any) {
    if ("points" in event) {
      const selected: VariantSimple[] = []
      for (const p of event["points"]) {
        const data: any = p.data.data[p.pointNumber]
        if (this.settings.settings.selected[data.position]) {
          if (this.settings.settings.selected[data.position][data.original]) {
            if (this.settings.settings.selected[data.position][data.original][data.mutated]) {
              selected.push({position: data.position, original: data.original, mutated: data.mutated})
            }
          }
        }
      }
      if (selected.length > 0) {
        this.selected.emit(selected)
      }
    }
  }

  addAnnotationLabelForData(data: Variant) {
    const annotation: any = {
      variantdata:`${data.original}${data.position}${data.mutated}`,
      x: data.position,
      y: data.score,
      xref: 'x',
      yref: 'y',
      text: `${data.original}${data.position}${data.mutated}`,
      showarrow: true,
      arrowhead: 1,
      arrowsize: 1,
      arrowwidth: 1,
      ax: -20,
      ay: -20,
      font: {
        family: 'Arial, monospace',
        size: 15,
        color: '#000000'
      }
    }
    this.settings.settings.annotations[`${data.original}${data.position}${data.mutated}`] = annotation
    this.graphLayout.annotations.push(annotation)
    this.graphLayout.annotations = [...this.graphLayout.annotations]
  }

  removeAnnotationLabelForData(data: any) {
    const index = this.graphLayout.annotations.findIndex((a: any) => {
      return a.variantdata === `${data.original}${data.position}${data.mutated}`
    })
    console.log(index)
    if (index > -1) {
      this.graphLayout.annotations.splice(index, 1)
    }
    delete this.settings.settings.annotations[`${data.original}${data.position}${data.mutated}`]
    this.graphLayout.annotations = [...this.graphLayout.annotations]
  }

  openAnnotationEditor() {
    const ref = this.dialog.open(AnnotationEditorComponent)
    ref.componentInstance.data = Object.values(this.annotationMap)
    ref.afterClosed().subscribe((data) => {
      if (data) {
        for (const d of data) {
          this.annotationMap[d.value.variantdata]["ax"] = d.value["ax"]
          this.annotationMap[d.value.variantdata]["ay"] = d.value["ay"]
          this.annotationMap[d.value.variantdata]["text"] = d.value["text"]
          this.annotationMap[d.value.variantdata]["font"]["color"] = d.value["color"]
          this.annotationMap[d.value.variantdata]["font"]["size"] = d.value["fontsize"]
          this.annotationMap[d.value.variantdata]["showarrow"] = d.value["showarrow"]
          this.annotationMap[d.value.variantdata]["arrowhead"] = d.value["arrowhead"]
          this.annotationMap[d.value.variantdata]["arrowsize"] = d.value["arrowsize"]
          this.annotationMap[d.value.variantdata]["arrowwidth"] = d.value["arrowwidth"]
        }
        this.settings.settings.annotations = Object.assign({}, this.annotationMap)
        this.graphLayout.annotations = [...this.graphLayout.annotations]
      }
    })
  }
}
