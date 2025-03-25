import { Component } from '@angular/core';
import { HuellasService } from '../services/huellas.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import {
  FingerprintReader,
  SampleFormat,
  SamplesAcquired,
} from '@digitalpersona/devices';

@Component({
  selector: 'app-user',
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  private reader = new FingerprintReader();
  users: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5; // Número de usuarios por página
  newUser: any = {
    nombres: '',
    apellidos: '',
    correo: '',
    cedula: '',
    password: '',
    rol_id: '',
    organizaciones_venta: [
      {
        organizacion_venta_id: '',
        distrito: [
          {
            distrito_id: '',
            puntos_venta: [''],
          },
        ],
      },
    ],
    cargo_id: '',
  };

  constructor(private huellasService: HuellasService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.huellasService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        Swal.fire('Error', 'Hubo un error', 'error');
        console.error('Error al obtener usuarios', error);
      }
    );
  }

  get paginatedUsers(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.users.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.users.length) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  editUser(user: any): void {
    Swal.fire({
      title: 'Registro de Huella',
      html: `
        <p><strong>Nombre:</strong> ${user.nombres} ${user.apellidos}</p>
        <p><strong>Cédula:</strong> ${user.cedula}</p>
      `,
      confirmButtonText: 'Tomar huella',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.reader
          .startAcquisition(SampleFormat.Intermediate)
          .then(() => {
            console.log('Esperando huella...');
            this.reader.onSamplesAcquired = (event: SamplesAcquired) => {
              const template = event.samples[0]; // puede ser más de una
              console.log('Template de huella:', template);

              // Detener captura después de obtener la huella
              this.reader.stopAcquisition();

              // Enviar template al backend o procesar
              // this.enviarHuella(user, template);
            };
          })
          .catch((err) => {
            console.error('Error iniciando captura de huella:', err);
            Swal.fire(
              'Error',
              'No se pudo iniciar la captura de huella',
              'error'
            );
          });
      }
    });
  }

  createUser(userData: any): void {
    const su_id = '12345';

    this.huellasService.createUser(su_id, userData).subscribe(
      () => {
        Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
        this.loadUsers();
      },
      (error) => {
        Swal.fire('Error', 'No se pudo crear el usuario', 'error');
        console.error('Error al crear usuario:', error);
      }
    );
  }

  openCreateUserModal(): void {
    Swal.fire({
      title: 'Crear Nuevo Usuario',
      width: '900px',
      html: `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <input id="nombres" class="swal2-input" placeholder="Nombres">
            <input id="apellidos" class="swal2-input" placeholder="Apellidos">
            <input id="correo" class="swal2-input" placeholder="Correo">
            <input id="cedula" class="swal2-input" placeholder="Cédula">
            <input id="password" type="password" class="swal2-input" placeholder="Contraseña">
          </div>
          <div>
            <input id="rol_id" class="swal2-input" placeholder="Rol ID">
            <input id="organizacion_id" class="swal2-input" placeholder="Organización ID">
            <input id="distrito_id" class="swal2-input" placeholder="Distrito ID">
            <input id="punto_venta" class="swal2-input" placeholder="Punto de Venta">
            <input id="cargo_id" class="swal2-input" placeholder="Cargo ID">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Crear',
      preConfirm: () => {
        return {
          nombres: (document.getElementById('nombres') as HTMLInputElement)
            .value,
          apellidos: (document.getElementById('apellidos') as HTMLInputElement)
            .value,
          correo: (document.getElementById('correo') as HTMLInputElement).value,
          cedula: (document.getElementById('cedula') as HTMLInputElement).value,
          password: (document.getElementById('password') as HTMLInputElement)
            .value,
          rol_id: (document.getElementById('rol_id') as HTMLInputElement).value,
          organizaciones_venta: [
            {
              organizacion_venta_id: (
                document.getElementById('organizacion_id') as HTMLInputElement
              ).value,
              distrito: [
                {
                  distrito_id: (
                    document.getElementById('distrito_id') as HTMLInputElement
                  ).value,
                  puntos_venta: [
                    (document.getElementById('punto_venta') as HTMLInputElement)
                      .value,
                  ],
                },
              ],
            },
          ],
          cargo_id: (document.getElementById('cargo_id') as HTMLInputElement)
            .value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.createUser(result.value);
      }
    });
  }
}
