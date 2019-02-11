export interface inmuebleInterface {
  idUsuario?: string;
  tipo_hogar?: string;
  operacion?: string;
  dormitorio?: string;
  baño?: string;
  cochera?: string;
  area?:string;
  vista?:string;
  tipo_departamento?:string;
  amoblado?:string;
  estreno?:string;
  proyecto?:string;
  mantenimiento?:  {type?: string , price?: string}
  presupuesto?:  {type?: string , price?: string}
}

