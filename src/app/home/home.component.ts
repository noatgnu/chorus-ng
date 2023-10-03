import {AfterViewInit, Component} from '@angular/core';
import {Protein, Variant} from "../protein-query";
import {WebService} from "../web.service";
import {MatDialog} from "@angular/material/dialog";
import {DataService} from "../data.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SettingsService} from "../settings.service";
import {ImportedFile} from "../imported-file";
import {DataFilterDialogComponent} from "../data-filter-dialog/data-filter-dialog.component";
import {FilterColumn} from "../filter-column";
import {Settings} from "../settings";
import {fromCSV, IDataFrame} from "data-forge";
import {VariantSimple} from "../variant-simple";
import {ImportedFileManagementComponent} from "../imported-file-management/imported-file-management.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit{
  results: Protein[] = []
  fileProcessingFinished = false
  filteredData: Variant[] = []
  currentSessionID = ""
  currentSessionUrl = ""
  constructor(private route: ActivatedRoute, private web: WebService, private dialog: MatDialog, private data: DataService, private snackbar: MatSnackBar, public settings: SettingsService, private dataService: DataService){
    this.route.params.subscribe(params => {
      if (params['settings']) {
        if (params['settings'] !== "") {
          this.currentSessionID = params['settings']
          this.currentSessionUrl = location.origin + "/#/" + this.currentSessionID
          this.web.downloadSession(params['settings']).then((data: any) => {
            this.restoreFile(data)
          })
        }
      }
    })
  }

  searchForVariantUsingProtein(protein: string) {
    const req = this.web.getProtein(protein)
    this.snackbar.open("Downloading Alphamissense data for "+protein, "OK", {duration: 2000})
    req.subscribe((data) => {
      this.settings.settings.protein = protein
      this.results = data.results
    })
  }

  ngAfterViewInit() {
    if (this.settings.settings.protein === "") {
      this.searchForVariantUsingProtein("Q5S007")
    }
  }

  fileHandler(e: ImportedFile) {
    this.fileProcessingFinished = false
    const ref = this.dialog.open(DataFilterDialogComponent)
    this.settings.settings.importedFile[e.form.name] = e
    ref.componentInstance.file = e
    ref.afterClosed().subscribe((data: FilterColumn[]) => {
      let df = e.data.where(row => row[e.form.variant] !== "").bake()
      for (const f of data){
        const filterArray = f.filterValue.split("@")
        switch (f.filterType) {
          case "in":
            df = df.where(row => f.filterValue.includes(row[f.column])).bake()
            break
        }
      }

      this.processDataFrameForOverlap(df, e);
      df.getSeries(e.form.pathogenicity).distinct().bake().forEach((pathogenicity: string) => {
        if (!this.settings.settings.pathogenicityFilter[e.form.name]) {
          this.settings.settings.pathogenicityFilter[e.form.name] = {}
        }
        if (!this.settings.settings.pathogenicityFilter[e.form.name][pathogenicity]) {
          this.settings.settings.pathogenicityFilter[e.form.name][pathogenicity] = true
        }
      })
      this.data.currentData[e.form.name] = df
      this.fileProcessingFinished = true

      this.settings.settings.filter[e.form.name] = data
      this.data.reDrawTrigger.next(true)
      this.dataService.updateTrigger.next(true)
      this.snackbar.open("File processed", "OK", {duration: 2000})
    })
  }

  private processDataFrameForOverlap(df: IDataFrame<number, any>, e: ImportedFile) {
    df.forEach(row => {
      const match = /([A-Za-z]+)(\d+)([A-Za-z]+)/.exec(row[e.form.variant])
      if (match) {
        const position = parseInt(match[2])
        let mutated = match[3]
        let origin = match[1]

        if (origin.length === 3) {
          if (this.dataService.aminoAcid3to1[origin]) {
            origin = this.dataService.aminoAcid3to1[origin].slice()
          }
        }
        if (mutated.length === 3) {
          if (this.dataService.aminoAcid3to1[mutated]) {
            mutated = this.dataService.aminoAcid3to1[mutated].slice()
          }
        }
        if (origin.length === 1 && mutated.length === 1) {
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
            this.settings.settings.selected[position][origin][mutated][e.form.name] = {
              name: e.form.name, row: row,
              hovertext: hovertext, pathogenicity: row[e.form.pathogenicity]
            }
          }
        }
      }
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

  restoreFile(payload: any) {
    this.snackbar.open("Restoring settings", "OK", {duration: 2000})
    let initialSettings: any = {}
    if (typeof payload !== "string") {
      initialSettings = payload
    } else {
      initialSettings = JSON.parse(payload)
    }
    const req = this.web.getProtein(initialSettings.protein).toPromise()
    this.snackbar.open("Downloading Alphamissense data for "+initialSettings.protein, "OK", {duration: 2000})
    req.then((data) => {
      if (data) {
        this.results = data.results
        this.settings.settings = new Settings()
        for (const i in initialSettings.importedFile) {
          initialSettings.importedFile[i].data = fromCSV(initialSettings.importedFile[i].originalData)
        }
        for (const s in this.settings.settings) {
          if (initialSettings[s] !== undefined) {
            // @ts-ignore
            this.settings.settings[s] = initialSettings[s]
          }
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
        }
        this.filteredData = this.results[0].variants.filter((row: Variant) => {
          return this.settings.settings.selection[`${row.original}${row.position}${row.mutated}`] !== undefined
        })
      }
    })
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

  searchVariantsHandler(e: VariantSimple[]) {
    if (e.length > 0) {
      this.settings.settings.selectionNumber++
      let dataSetname = `(Search #${this.settings.settings.selectionNumber})`
      if (e.length === 1) {
        dataSetname = `${e[0].original}${e[0].position}${e[0].mutated} ${dataSetname}`
      } else {
        dataSetname = `${e.length} variants ${dataSetname}`
      }
      if (!this.settings.settings.userSelection.includes(dataSetname)) {
        this.settings.settings.userSelection.push(dataSetname)
        if (!this.settings.settings.pathogenicityFilter[dataSetname]) {
          this.settings.settings.pathogenicityFilter[dataSetname]= {}
        }
        if (!this.settings.settings.pathogenicityFilter[dataSetname]['']) {
          this.settings.settings.pathogenicityFilter[dataSetname][''] = true
        }
        e.forEach((variant: VariantSimple) => {
          if (!this.settings.settings.selected[variant.position]) {
            this.settings.settings.selected[variant.position] = {}
          }
          if (!this.settings.settings.selected[variant.position][variant.original]) {
            this.settings.settings.selected[variant.position][variant.original] = {}
          }
          if (!this.settings.settings.selected[variant.position][variant.original][variant.mutated]) {
            this.settings.settings.selected[variant.position][variant.original][variant.mutated] = {}
          }
          if (!this.settings.settings.selected[variant.position][variant.original][variant.mutated][dataSetname]) {
            this.settings.settings.selected[variant.position][variant.original][variant.mutated][dataSetname] = {name: dataSetname, hovertext: "", pathogenicity: ""}
          }
          if (!this.settings.settings.selection[`${variant.original}${variant.position}${variant.mutated}`]) {
            this.settings.settings.selection[`${variant.original}${variant.position}${variant.mutated}`] = variant
          }
        })
        this.data.reDrawTrigger.next(true)
        this.filteredData = this.results[0].variants.filter((row: Variant) => {
          return this.settings.settings.selection[`${row.original}${row.position}${row.mutated}`] !== undefined
        })
      }
    }
  }

  loadPrebuiltHandler(e: any) {
    this.snackbar.open("Loading prebuilt data", "OK", {duration: 2000})
    this.restoreFile(e)
  }

  dataManagementHandler() {
    const ref = this.dialog.open(ImportedFileManagementComponent)
    ref.afterClosed().subscribe((data: any) => {
      if (data) {
        if (data.subsetDialog) {
          const filterRef = this.dialog.open(DataFilterDialogComponent)
          filterRef.componentInstance.file = this.settings.settings.importedFile[data.file]
          filterRef.afterClosed().subscribe((filterData: FilterColumn[]) => {
            let df = this.settings.settings.importedFile[data.file].data.where(row => row[this.settings.settings.importedFile[data.file].form.variant] !== "").bake()
            for (const f of filterData){
              const filterArray = f.filterValue.split("@")
              switch (f.filterType) {
                case "in":
                  df = df.where(row => f.filterValue.includes(row[f.column])).bake()
                  break
              }
            }
            const newSubsetFile = Object.assign({}, this.settings.settings.importedFile[data.file])
            newSubsetFile.data = df
            newSubsetFile.form.name = newSubsetFile.form.name + " (subset)"
            this.settings.settings.importedFile[newSubsetFile.form.name] = newSubsetFile
            this.settings.settings.filter[newSubsetFile.form.name] = filterData
            this.data.currentData[newSubsetFile.form.name] = df
            this.processDataFrameForOverlap(df, newSubsetFile)
            df.getSeries(newSubsetFile.form.pathogenicity).distinct().bake().forEach((pathogenicity: string) => {
              if (!this.settings.settings.pathogenicityFilter[newSubsetFile.form.name]) {
                this.settings.settings.pathogenicityFilter[newSubsetFile.form.name] = {}
              }
              if (!this.settings.settings.pathogenicityFilter[newSubsetFile.form.name][pathogenicity]) {
                this.settings.settings.pathogenicityFilter[newSubsetFile.form.name][pathogenicity] = true
              }
            })
            this.data.reDrawTrigger.next(true)
            this.data.updateTrigger.next(true)
            this.snackbar.open("Subset successful", "OK", {duration: 2000})
          })
        } else {
          if (data.remove === true) {
            this.settings.settings.removeDataset(data.file)
          }
          this.data.reDrawTrigger.next(true)
          this.data.updateTrigger.next(true)
        }

      }
    })
  }

  saveFileToServer() {
    const data = JSON.stringify(this.settings.settings, (key, value) => {
      if (key === "data") {
        return ""
      } else {
        return value
      }
    })
    const file = new File([data], "settings.json", {type: "text/plain"})
    const payload = {file: file, description: ""}
    const req = this.web.saveSession(payload)
    req.subscribe((data: any) => {
      this.snackbar.open("File saved", "OK", {duration: 2000})
      this.currentSessionID = data.link_id
      this.currentSessionUrl = location.origin + "/#/" + data.link_id
    })
  }

  copySessionUrl() {
    navigator.clipboard.writeText(this.currentSessionUrl).then(() => {
      this.snackbar.open("Session URL copied to clipboard", "OK", {duration: 2000})
    })
  }
}
