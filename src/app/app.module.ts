import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import { ProteinSelectionComponent } from './protein-selection/protein-selection.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import { VariantPlotComponent } from './variant-plot/variant-plot.component';
import { LegendOrderComponent } from './variant-plot/legend-order/legend-order.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatListModule} from "@angular/material/list";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {MatMenuModule} from "@angular/material/menu";
import { LegendRenameComponent } from './variant-plot/legend-rename/legend-rename.component';
import { ColorPickerComponent } from './variant-plot/color-picker/color-picker.component';
import { FileInputComponent } from './file-input/file-input.component';
import {MatSelectModule} from "@angular/material/select";
import { DataFilterDialogComponent } from './data-filter-dialog/data-filter-dialog.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { PathogenicityFilterComponent } from './variant-plot/pathogenicity-filter/pathogenicity-filter.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import { CustomDomainsComponent } from './variant-plot/custom-domains/custom-domains.component';
import {NgxColorsModule} from "ngx-colors";


PlotlyModule.plotlyjs = PlotlyJS;
@NgModule({
  declarations: [
    AppComponent,
    ProteinSelectionComponent,
    VariantPlotComponent,
    LegendOrderComponent,
    LegendRenameComponent,
    ColorPickerComponent,
    FileInputComponent,
    DataFilterDialogComponent,
    PathogenicityFilterComponent,
    CustomDomainsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PlotlyModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatListModule,
    CdkDropList,
    CdkDrag,
    MatMenuModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCheckboxModule,
    NgxColorsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
