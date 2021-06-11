export class Producto {
    constructor(
        public _id: string,
        public codigo: string,
        public tipo: string,
        public descripcion: string,
        public unidad_medida: string,
        public stock_minimo: boolean,
        public cantidad_minima: number,
        public precio: number,
        public activo: boolean,
        public cantidad?: number   
    ){}   
}