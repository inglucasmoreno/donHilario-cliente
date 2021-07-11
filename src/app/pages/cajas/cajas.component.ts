import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { VentasService } from 'src/app/services/ventas.service';
import { AlertService } from '../../services/alert.service';
import { CajasService } from '../../services/cajas.service';


@Component({
  selector: 'app-cajas',
  templateUrl: './cajas.component.html',
  styles: [
  ]
})
export class CajasComponent implements OnInit {

  // Ingresos y Gastos
  public ingresos: any[] = [];
  public gastos: any[] = [];
  public totalOtrosGastos = 0;
  public totalOtrosIngresos = 0;
  
  public elementoActual: any = {
    monto: '',
    descripcion: '',
    tipo: 'Gasto'
  }

  // Ventas
  public ventas: any[] = [];

  // Control de billetes
  public billetes: any = {
    cantidad_monedas: 0,
    cantidad_5: 0,
    cantidad_10: 0,
    cantidad_20: 0,
    cantidad_50: 0,
    cantidad_100: 0,
    cantidad_200: 0,
    cantidad_500: 0,
    cantidad_1000: 0,
    total_monedas: 0,
    total_5: 0,
    total_10: 0,
    total_20: 0,
    total_50: 0,
    total_100: 0,
    total_200: 0,
    total_500: 0,
    total_1000: 0,
    total_billetes: 0,
    diferencia: 0
  }

  public data: any = {
    
    // Saldo inicial
    saldo_inicial: 0,
    
    // Total global
    total_ventas: 0,

    // Otros
    total_descuento: 0,
    total_adicional_credito: 0,
    
    // Por tipo de producto
    total_balanza: 0,
    total_mercaderia: 0,

    // Por forma de pago
    total_efectivo: 0,
    total_postnet: 0,

    // Monto total
    efectivo_en_caja: 0,
    
  }

  constructor(private dataService: DataService,
              public authService: AuthService,
              private alertService: AlertService,
              private ventasService: VentasService,
              private cajasService: CajasService) { }

  ngOnInit(): void {
    this.alertService.loading();
    this.dataService.ubicacionActual = 'Dashboard - Gestión de cajas';
    this.obtenerSaldoInicial();
    this.listarVentas();
  }
  
  // ----------------------
  // SALDO INICIAL
  // ----------------------

  // Se obtiene saldo inicial
  obtenerSaldoInicial(): void {
  this.cajasService.getSaldoInicial().subscribe( ({ monto }) => {
      monto === null ? this.data.saldo_inicial = 0 : this.data.saldo_inicial = monto; 
    },({ error }) => {
      this.alertService.errorApi(error.msg);
    });
  };

  // Actualizar saldo inicial
  actualizarSaldoInicial(): void {
    
    if(this.data.saldo_inicial === null){
      this.alertService.info('Monto inicial inválido');
      return;
    }

    this.alertService.question({ msg: '¿Quieres fijar un nuevo saldo inicial?', buttonText: 'Fijar' })
    .then(({isConfirmed}) => {  
      if (isConfirmed) {
        this.cajasService.actualizarSaldoInicial({ monto: this.data.saldo_inicial }).subscribe( () => {
          this.alertService.success('Saldo inicial actualizado correctamente');
        },({error})=>{
          this.alertService.errorApi(error.msg);
        })    
      }
    });
  }

  // ----------------------
  // ACCIONES DE CAJA
  // ----------------------

  // Listar ventas
  listarVentas(): void {
    this.ventasService.listarVentas().subscribe( ({ ventas }) => {
      this.ventas = ventas;
      this.calculos();
      this.alertService.close();
    }, ({ error }) => {
      this.alertService.errorApi(error.msg);
    });
  }

  // Crear nueva caja
  nuevaCaja(): void {
    this.alertService.question({ msg: '¿Quieres realizar el cierre de caja?', buttonText: 'Aceptar' })
    .then(({isConfirmed}) => {  
      if (isConfirmed) {
        const data = {
          billetes: this.billetes,
          ingresos: this.ingresos,
          gastos: this.gastos,
          saldo_inicial: this.data.saldo_inicial,
          total_balanza: this.data.total_balanza,
          total_mercaderia: this.data.total_mercaderia,
          total_descuentos: this.data.total_descuento,
          total_efectivo: this.data.efectivo_en_caja,
          total_efectivo_real: this.billetes.total_billetes,
          diferencia: this.billetes.diferencia,
          total_postnet: this.data.total_postnet,
          total_ventas: this.data.total_ventas,
          otros_gastos: this.totalOtrosGastos,
          otros_ingresos: this.totalOtrosIngresos
        };
        this.cajasService.nuevaCaja(data).subscribe(() => {
          this.reiniciarCaja();
          this.listarVentas();
          this.alertService.success('Cierre de caja correcto');
        },({error})=>{
          this.alertService.errorApi(error);
        })      
      }
    });  
  }

  // Reiniciar cierre de caja
  reiniciarCaja(): void {
  this.totalOtrosGastos = 0;
  this.totalOtrosIngresos = 0;
  this.billetes = {
    cantidad_monedas: 0,
    cantidad_5: 0,
    cantidad_10: 0,
    cantidad_20: 0,
    cantidad_50: 0,
    cantidad_100: 0,
    cantidad_200: 0,
    cantidad_500: 0,
    cantidad_1000: 0,
    total_monedas: 0,
    total_5: 0,
    total_10: 0,
    total_20: 0,
    total_50: 0,
    total_100: 0,
    total_200: 0,
    total_500: 0,
    total_1000: 0,
    total_billetes: 0,
    diferencia: 0
  }
  this.ingresos = [];
  this.gastos = [];
  }

  // Calculo del total de "Otros gastos" y "Otros ingresos"
  calculoGastosIngresos(): void {
    let totalGastosTmp = 0;
    let totalIngresosTmp = 0;
    
    this.ingresos.forEach( ({ monto }) => {
      totalIngresosTmp += monto; 
    });

    this.gastos.forEach( ({ monto }) => {
      totalGastosTmp += monto;
    });

    this.totalOtrosGastos = totalGastosTmp;
    this.totalOtrosIngresos = totalIngresosTmp;
  
    this.calculo_monto_total()

  }

  // Eliminar Ingreso/Gasto
  eliminarIngresoGasto(elemento: any): void {
    this.alertService.question({ msg: '¿Quieres eliminar este elemento?', buttonText: 'Eliminar' })
          .then(({isConfirmed}) => {  
            if (isConfirmed) {
              if(elemento.tipo === 'Ingreso') this.ingresos = this.ingresos.filter( ingreso => ingreso.descripcion !== elemento.descripcion );
              if(elemento.tipo === 'Gasto') this.gastos = this.gastos.filter( gasto => gasto.descripcion !== elemento.descripcion ); 
              this.calculoGastosIngresos();
            }
          });
  }

  // Nuevo Ingreso/Gasto
  nuevoIngresoGasto(): void {
    
    if(this.elementoActual.descripcion.trim() === '' || this.elementoActual.monto === null || this.elementoActual.monto === '' || this.elementoActual.monto === 0){
      this.alertService.info('Formulario inválido');
      return;
    }

    if(this.elementoActual.tipo === 'Ingreso'){
      this.ingresos.push({
        descripcion: this.elementoActual.descripcion.toUpperCase(),
        monto: this.elementoActual.monto,
        tipo: this.elementoActual.tipo
      });    
    }else if(this.elementoActual.tipo === 'Gasto'){
      this.gastos.push({
        descripcion: this.elementoActual.descripcion.toUpperCase(),
        monto: this.elementoActual.monto,
        tipo: this.elementoActual.tipo
      });      
    }
    
    this.calculoGastosIngresos();

    this.alertService.success('Elemento cargado correctamente');

    this.elementoActual = {
      descripcion: '',
      monto: '',
      tipo: this.elementoActual.tipo
    }
    
  }

  // Calculo de montos
  calculos(): void {
    
    // Montos temporales
    let total_ventas_tmp = 0;
    let total_mercaderia_tmp = 0;
    let total_balanza_tmp = 0;
    let total_efectivo_tmp = 0;
    let total_postnet_tmp = 0;
    let total_descuentos_tmp = 0;
    let total_adicional_credito_tmp = 0;

    this.ventas.forEach( venta => {
      total_ventas_tmp += venta.precio_total;
      total_mercaderia_tmp += venta.total_mercaderia;
      total_balanza_tmp += venta.total_balanza;
      if(venta.forma_pago === 'Efectivo'){
        total_efectivo_tmp += venta.precio_total
      }else{
        total_postnet_tmp += venta.precio_total - venta.total_descuento;
      };
      total_descuentos_tmp += venta.total_descuento;
      total_adicional_credito_tmp += venta.total_adicional_credito;
    });
    
    // Montos finales
    this.data.total_ventas = total_ventas_tmp;
    this.data.total_mercaderia = total_mercaderia_tmp;
    this.data.total_balanza = total_balanza_tmp;
    this.data.total_efectivo = total_efectivo_tmp;
    this.data.total_postnet = total_postnet_tmp;
    this.data.total_adicional_credito = total_adicional_credito_tmp;
    this.data.total_descuento = total_descuentos_tmp;

    this.calculo_monto_total();
    
  }

  // Ingresos - Gastos
  calculo_monto_total() {
    this.data.efectivo_en_caja = (this.data.total_ventas - this.data.total_descuento) +
                                 this.data.saldo_inicial - 
                                 this.totalOtrosGastos +
                                 this.totalOtrosIngresos - 
                                 this.data.total_postnet;
    this.calculo_billetes();
  }

  // Calculo de billetes
  calculo_billetes() {
    this.billetes.total_monedas = this.billetes.cantidad_monedas;
    this.billetes.total_5 = this.billetes.cantidad_5 * 5;
    this.billetes.total_10 = this.billetes.cantidad_10 * 10;
    this.billetes.total_20 = this.billetes.cantidad_20 * 20;
    this.billetes.total_50 = this.billetes.cantidad_50 * 50;
    this.billetes.total_100 = this.billetes.cantidad_100 * 100;
    this.billetes.total_200 = this.billetes.cantidad_200 * 200;
    this.billetes.total_500 = this.billetes.cantidad_500 * 500;
    this.billetes.total_1000 = this.billetes.cantidad_1000 * 1000;
    this.billetes.total_billetes = this.billetes.total_monedas +
                                   this.billetes.total_5 + 
                                   this.billetes.total_10 + 
                                   this.billetes.total_20 + 
                                   this.billetes.total_50 + 
                                   this.billetes.total_100 + 
                                   this.billetes.total_200 + 
                                   this.billetes.total_500 + 
                                   this.billetes.total_1000;
    this.billetes.diferencia = this.billetes.total_billetes - this.data.efectivo_en_caja;
  }

}
