import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class DesechosService {

  constructor(private http: HttpClient) { }

  // Desechos por ID
  getDesecho(id: string): Observable<any> {
    return this.http.get(`${base_url}/desechos/${id}`, {
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

  // Listar desechos
  listarDesechos(
    direccion: number = -1,
    columna: string = 'createdAt'
  ): Observable<any>{
    return this.http.get(`${base_url}/desechos`,{
      params:{
        direccion: String(direccion),
        columna
      },
      headers:{'x-token': localStorage.getItem('token')}
    });
  }

  // Nuevo desecho
  nuevoDesecho(data: any): Observable<any> {
    return this.http.post(`${base_url}/desechos`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

  // Actualizar desecho
  actualizarDesecho(id: string, data: any): Observable<any> {
    return this.http.put(`${base_url}/desechos/${id}`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    })  
  }


}
