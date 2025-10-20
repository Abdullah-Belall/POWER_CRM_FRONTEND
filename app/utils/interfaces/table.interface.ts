export interface TableDataInterface {
  name: string;
  code: string;
  population: number;
  size: number;
  density: number;
  [key: string]: string | number;
}
export interface TableColumnInterface {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}
