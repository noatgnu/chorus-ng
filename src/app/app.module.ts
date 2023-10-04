import { NgModule, isDevMode } from '@angular/core';
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
import {MatSidenavModule} from "@angular/material/sidenav";
import { VariantSearchComponent } from './variant-search/variant-search.component';
import { DataViewerComponent } from './data-viewer/data-viewer.component';
import { DataDetailsComponent } from './data-viewer/data-details/data-details.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatLegacyChipsModule} from "@angular/material/legacy-chips";
import {MatChipsModule} from "@angular/material/chips";
import {NgOptimizedImage} from "@angular/common";
import { PrebuiltSessionSelectionComponent } from './prebuilt-session-selection/prebuilt-session-selection.component';
import { ImportedFileManagementComponent } from './imported-file-management/imported-file-management.component';
import { HomeComponent } from './home/home.component';
import { AnnotationEditorComponent } from './variant-plot/annotation-editor/annotation-editor.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DataRenameDialogComponent } from './data-rename-dialog/data-rename-dialog.component';
import { DataFindOverlapComponent } from './data-find-overlap/data-find-overlap.component';
import { UserSelectionManagementComponent } from './user-selection-management/user-selection-management.component';


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
    CustomDomainsComponent,
    VariantSearchComponent,
    DataViewerComponent,
    DataDetailsComponent,
    PrebuiltSessionSelectionComponent,
    ImportedFileManagementComponent,
    HomeComponent,
    AnnotationEditorComponent,
    DataRenameDialogComponent,
    DataFindOverlapComponent,
    UserSelectionManagementComponent
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
        NgxColorsModule,
        MatSidenavModule,
        MatExpansionModule,
        MatLegacyChipsModule,
        MatChipsModule,
        NgOptimizedImage,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: !isDevMode(),
          // Register the ServiceWorker as soon as the application is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        })
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
