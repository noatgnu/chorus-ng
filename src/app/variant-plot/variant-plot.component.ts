import {Component, Input} from '@angular/core';
import {Protein, Variant} from "../protein-query";
import {WebService} from "../web.service";
import {Settings} from "../settings";
import {SettingsService} from "../settings.service";
import {MatDialog} from "@angular/material/dialog";
import {LegendOrderComponent} from "./legend-order/legend-order.component";
import {LegendRenameComponent} from "./legend-rename/legend-rename.component";

@Component({
  selector: 'app-variant-plot',
  templateUrl: './variant-plot.component.html',
  styleUrls: ['./variant-plot.component.scss']
})
export class VariantPlotComponent {
  graphData: any[] = []

  graphLayout: any = {
    traceorder: 'normal',
    title: 'Variant Plot',
    autosize: true,
    xaxis: {
      title: 'Position',
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
    annotations: []
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
  variants: Variant[] = []
  @Input() set data(value: Protein) {
    this.graphLayout.title = value.name
    this.web.getProteinUniprot(value.id).subscribe((data) => {
      this.uniprotData = data
      this.variants = value.variants
      this.drawGraph()
    })

  }
  constructor(private web: WebService, private settings: SettingsService, private dialog: MatDialog) { }

  drawGraph() {
    const temp: any = {}
    for (const v of this.variants) {
      if (!(v.pathogenicity in temp)) {
        temp[v.pathogenicity] = {
          x: [],
          y: [],
          mode: 'markers',
          type: 'scattergl',
          marker: { size: 12, color: this.settings.settings.color_map[v.pathogenicity] },
          name: v.pathogenicity,
          hovermode: false,
          hoverinfo: 'skip',
          yaxis: 'y',
          visible: true,
        }
        if (!this.settings.settings.legendRename[v.pathogenicity]) {
          this.settings.settings.legendRename[v.pathogenicity] = v.pathogenicity
        } else {
          temp[v.pathogenicity].name = this.settings.settings.legendRename[v.pathogenicity].slice()
        }
        if (!this.settings.settings.legendOrder.includes(v.pathogenicity)) {
          this.settings.settings.legendOrder.push(v.pathogenicity)
        }
        if (!(v.pathogenicity in this.settings.settings.visible)) {
          this.settings.settings.visible[v.pathogenicity] = true
        } else {
          temp[v.pathogenicity].visible = this.settings.settings.visible[v.pathogenicity]
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
            visible: true
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
      }
      if (this.settings.settings.selected[v.position]) {
        if (this.settings.settings.selected[v.position][v.original]) {
          if (this.settings.settings.selected[v.position][v.original][v.mutated]) {
            temp[v.pathogenicity].x.push(v.position)
            temp[v.pathogenicity].y.push(v.score)
            continue
          }
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
    for (const key of this.settings.settings.legendOrder) {
      data.push(temp[key])
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
}
