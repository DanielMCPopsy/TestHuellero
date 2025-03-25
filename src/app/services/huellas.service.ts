import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { URL_DEV, USER_MAIL, USER_PASS } from '../Environments/Constants';

@Injectable({
  providedIn: 'root'
})
export class HuellasService {
  
  private apiUrl = `${URL_DEV}/login`;
  private apiUrl2 = `${URL_DEV}/AdministracionUsuarios/GetAll?rol=EMBAJADOR&estado=1`;

  constructor(private http: HttpClient) { }

  login(): Observable<any> {
    const body = {
      email: USER_MAIL,
      password: USER_PASS
    };

    return this.http.post<any>(this.apiUrl, body).pipe(
      tap(response => {
        if (response?.token) {
          sessionStorage.setItem('token', response.token);
          Swal.fire('¡Éxito!', 'Inicio de sesión exitoso.', 'success');
        }
      }),
      catchError(error => {
        Swal.fire('Error', 'No se pudo iniciar sesión. Verifica tus credenciales.', 'error');
        throw error;
      })
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  logout(): void {
    sessionStorage.removeItem('token');
    Swal.fire('Sesión cerrada', 'Has cerrado sesión correctamente.', 'info');
  }

  getUsers(): Observable<any[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(this.apiUrl2, { headers });
  }

  createUser(su_id: string, userData: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${URL_DEV}/AdministracionUsuarios/Create/${su_id}`, userData, { headers });
  }
}
