import {IDataFrame} from "data-forge";

export interface ImportedFile {
  columns: string[]
  originalData: string
  data: IDataFrame
  dataType: string
  form: any
  originalFileName: string
}
