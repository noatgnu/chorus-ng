import {AfterViewInit, Component} from '@angular/core';
import {Protein, ProteinQuery, Variant} from "./protein-query";
import {WebService} from "./web.service";
import {ImportedFile} from "./imported-file";
import {MatDialog} from "@angular/material/dialog";
import {DataFilterDialogComponent} from "./data-filter-dialog/data-filter-dialog.component";
import {FilterColumn} from "./filter-column";
import {DataFrame, fromCSV, IDataFrame, Series} from "data-forge";
import {DataService} from "./data.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SettingsService} from "./settings.service";
import {VariantSimple} from "./variant-simple";
import {Settings} from "./settings";
import {ImportedFileManagementComponent} from "./imported-file-management/imported-file-management.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent{

}
