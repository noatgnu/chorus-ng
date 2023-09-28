import {AfterViewInit, Component} from '@angular/core';
import {Protein, ProteinQuery} from "./protein-query";
import {WebService} from "./web.service";
import {ImportedFile} from "./imported-file";
import {MatDialog} from "@angular/material/dialog";
import {DataFilterDialogComponent} from "./data-filter-dialog/data-filter-dialog.component";
import {FilterColumn} from "./filter-column";
import {fromCSV, Series} from "data-forge";
import {DataService} from "./data.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SettingsService} from "./settings.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit{
  title = 'chorus-ng';
  results: Protein[] = []
  fileProcessingFinished = false
  constructor(private web: WebService, private dialog: MatDialog, private data: DataService, private snackbar: MatSnackBar, private settings: SettingsService) {

  }

  searchForVariantUsingProtein(protein: string) {
    const req = this.web.getProtein(protein)
    req.subscribe((data) => {
      this.settings.settings.protein = protein
      this.results = data.results
    })
  }

  ngAfterViewInit() {
    this.searchForVariantUsingProtein("Q5S007")
  }

  fileHandler(e: ImportedFile) {
    this.fileProcessingFinished = false
    const ref = this.dialog.open(DataFilterDialogComponent)
    this.settings.settings.importedFile[e.form.name] = e
    ref.componentInstance.file = e
    ref.afterClosed().subscribe((data: FilterColumn[]) => {
      let df = e.data.where(row => row[e.form.variant] !== "").bake()
      for (const f of data){
        switch (f.filterType) {
          case "in":
            df = df.where(row => f.filterValue === row[f.column]).bake()
            break
        }
      }


      df.forEach(row => {
        const match = /([A-Za-z]+)(\d+)([A-Za-z]+)/.exec(row[e.form.variant])
        if (match) {
          const position = parseInt(match[2])
          const mutated = match[3]
          const origin = match[1]
          if (!this.settings.settings.selected[position]) {
            this.settings.settings.selected[position] = {}
          }
          if (!this.settings.settings.selected[position][origin]) {
            this.settings.settings.selected[position][origin] = {}
          }
          if (!this.settings.settings.selected[position][origin][mutated]) {
            this.settings.settings.selected[position][origin][mutated] = {}
          }

          if (!this.settings.settings.selected[position][origin][mutated][e.form.name]) {
            let hovertext: string = `
            <b>${e.form.name}</b> <br>
            Variant: ${row[e.form.variant]} <br>
            Position: ${position} <br>
            ${e.form.pathogenicity}: ${row[e.form.pathogenicity]} <br>
            `
            for (const c of e.form.columnsToKeep) {
              hovertext += `${c}: ${row[c]} <br>`
            }
            this.settings.settings.selected[position][origin][mutated][e.form.name] ={name: e.form.name, row: row,
              hovertext: hovertext, pathogenicity: row[e.form.pathogenicity]
            }
          }
        }
      })
      df.getSeries(e.form.pathogenicity).distinct().bake().forEach((pathogenicity: string) => {
        if (!this.settings.settings.pathogenicityFilter[e.form.name]) {
          this.settings.settings.pathogenicityFilter[e.form.name]= {}
        }
        if (!this.settings.settings.pathogenicityFilter[e.form.name][pathogenicity]) {
          this.settings.settings.pathogenicityFilter[e.form.name][pathogenicity] = true
        }
      })
      this.data.currentData[e.form.name] = df
      this.fileProcessingFinished = true
      this.snackbar.open("File processed", "OK", {duration: 2000})
      this.settings.settings.filter[e.form.name] = data
      this.data.reDrawTrigger.next(true)
    })
  }

  saveFile() {
    const payload = JSON.stringify(this.settings.settings, (key, value) => {
      if (key === "data") {
        return ""
      } else {
        return value
      }
    })
    const blob = new Blob([payload], {type: 'text/plain'})
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = "settings.json"
    document.body.appendChild(a)
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url)
  }

  restoreFile(payload: string) {
    const initialSettings = JSON.parse(payload)
    for (const i in initialSettings.importedFile) {
      initialSettings.importedFile[i].data = fromCSV(initialSettings.importedFile[i].originalData)
    }
    for (const s in this.settings.settings) {
      // @ts-ignore
      this.settings.settings[s] = initialSettings[s]
    }

    for (const i in this.settings.settings.importedFile) {
      const data = this.settings.settings.importedFile[i].data
      const form = this.settings.settings.importedFile[i].form
      let df = data.where(row => row[form.variant] !== "").bake()
      for (const f of this.settings.settings.filter[i]){
        switch (f.filterType) {
          case "in":
            df = df.where(row => f.filterValue === row[f.column]).bake()
            break
        }
      }
      this.data.currentData[form.name] = df
      this.searchForVariantUsingProtein(this.settings.settings.protein)
    }
  }

  reloadFileHandler(e: any) {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      // @ts-ignore
      this.restoreFile(event.target.result)
    }
    reader.readAsText(file)
  }
}
