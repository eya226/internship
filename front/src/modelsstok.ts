export interface StockOTDto {
  codeComplet: string;
  emplacement: string;

}
export interface Stockage {
  id: number;
  codePlan: string;
  codeBaguette: string;
  dateEnregistrement: string;
  codeITM: string;
  codeOT: string;
  codeComplet: string;

  emplacement: string;
}


export interface StockOTDto {
  codeComplet: string;
  emplacement: string;
  codeITM: string;
  codeOT?: string;
  dateEnregistrement?: string;
}
