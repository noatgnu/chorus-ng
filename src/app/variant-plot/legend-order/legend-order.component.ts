import {Component, Input} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {SettingsService} from "../../settings.service";

@Component({
  selector: 'app-legend-order',
  templateUrl: './legend-order.component.html',
  styleUrls: ['./legend-order.component.scss']
})
export class LegendOrderComponent {
  @Input() legendOrder: string[] = []

  constructor(public settings: SettingsService) { }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.legendOrder, event.previousIndex, event.currentIndex)
  }

}
