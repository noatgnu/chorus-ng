import {Component, Input} from '@angular/core';
import {Protein, Variant} from "../protein-query";

@Component({
  selector: 'app-variant-plot',
  templateUrl: './variant-plot.component.html',
  styleUrls: ['./variant-plot.component.scss']
})
export class VariantPlotComponent {
  graphData: any[] = []
  graphLayout: any = {
    title: 'Variant Plot',
    autosize: true,
    xaxis: {
      title: 'Position',
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      title: 'Score',
      showline: false
    }

  }
  @Input() set data(value: Protein) {
    this.graphLayout.title = value.name
    this.drawGraph(value.variants)
  }
  constructor() { }

  drawGraph(variants: Variant[]) {
    const temp: any = {}
    for (const v of variants) {
      if (!(v.pathogenicity in temp)) {
        temp[v.pathogenicity] = {
          x: [],
          y: [],
          mode: 'markers',
          type: 'scattergl',
          marker: { size: 12, opacity: 0.01 },
          name: v.pathogenicity,
          hovermode: false,
        }
      }
      temp[v.pathogenicity].x.push(v.position)
      temp[v.pathogenicity].y.push(v.score)

    }
    const data: any[] = []
    for (const key in temp) {
      data.push(temp[key])
    }
    console.log(data)
    this.graphData = data
  }
}
