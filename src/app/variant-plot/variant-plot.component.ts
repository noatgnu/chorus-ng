import {Component, Input} from '@angular/core';
import {Protein} from "../protein-query";
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

@Component({
  selector: 'app-variant-plot',
  templateUrl: './variant-plot.component.html',
  styleUrls: ['./variant-plot.component.scss']
})
export class VariantPlotComponent {
  graphData: any[] = []
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
      zeroline: false
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

  @Input() set data(value: Protein) {
    this.graphLayout.title = value.name
    this.web.getProteinUniprot(value.id).subscribe((data) => {
      this.uniprotData = data
      this.variants = new DataFrame(value.variants)
      this.drawGraph()
    })

  }
  constructor(private web: WebService, private settings: SettingsService, private dialog: MatDialog, private dataService: DataService) {
    this.dataService.reDrawTrigger.subscribe((data) => {
      if (data) {
        this.drawGraph()
      }
    })
  }

  drawGraph() {
    const temp: any = {}
    for (const v of this.variants) {
      if (this.settings.settings.selected[v.position]) {
        if (this.settings.settings.selected[v.position][v.original]) {
          if (this.settings.settings.selected[v.position][v.original][v.mutated]) {
            let groupName: string = `Alphamissense(${v.pathogenicity})`
            let hovertext: string = `<b>Alphamissense</b><br>Pathogenicity: ${v.pathogenicity}<br>Score: ${v.score}<br>`
            for (const d in this.settings.settings.selected[v.position][v.original][v.mutated]) {
              if (this.settings.settings.pathogenicityFilter[d][this.settings.settings.selected[v.position][v.original][v.mutated][d].pathogenicity] === true) {
                groupName = groupName + " + " + d
                hovertext = hovertext + this.settings.settings.selected[v.position][v.original][v.mutated][d].hovertext
              }
            }
            if (groupName !== `Alphamissense(${v.pathogenicity})`) {

              if (!temp[groupName]) {
                temp[groupName] = {
                  x: [],
                  y: [],
                  text: [],
                  mode: 'markers',
                  type: 'scattergl',
                  marker: { size: 12},
                  name: groupName,
                  hoverinfo: 'text',
                  yaxis: 'y',
                  visible: true,
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
            }
          }
        }
      }
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
}
