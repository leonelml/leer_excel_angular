import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Cargar Archivo Excel</h1>

      <div class="upload-area">
        <input
          type="file"
          (change)="onFileChange($event)"
          accept=".xlsx, .xls"
          id="fileInput"
        />
        <label for="fileInput" class="file-label">
          Seleccionar archivo Excel
        </label>
      </div>

      <div class="result" *ngIf="resultado">
        <h2>Resultados</h2>
        <p><strong>Total de registros:</strong> {{ resultado.totalRegistros }}</p>
        <p><strong>Suma total:</strong> {{ resultado.sumaTotal | number:'1.2-2' }}</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 50px auto;
      padding: 30px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    h1 {
      color: #2c3e50;
      text-align: center;
      margin-bottom: 30px;
      font-size: 28px;
      font-weight: 600;
    }

    .upload-area {
      text-align: center;
      margin: 40px 0;
    }

    input[type="file"] {
      display: none;
    }

    .file-label {
      display: inline-block;
      padding: 14px 32px;
      background: #3498db;
      color: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
    }

    .file-label:hover {
      background: #2980b9;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
    }

    .result {
      background: #f8f9fa;
      padding: 24px;
      border-radius: 12px;
      margin-top: 30px;
      border: 1px solid #e9ecef;
    }

    .result h2 {
      color: #2c3e50;
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 22px;
      font-weight: 600;
    }

    .result p {
      font-size: 16px;
      margin: 12px 0;
      color: #495057;
      line-height: 1.6;
    }

    .result strong {
      color: #2c3e50;
    }
  `]
})
export class App {
  resultado: { totalRegistros: number; sumaTotal: number } | null = null;

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        const totalRegistros = jsonData.length;
        const sumaTotal = jsonData.reduce((acc, row) => {
          const valor = parseFloat(row['suma'] || 0);
          return acc + (isNaN(valor) ? 0 : valor);
        }, 0);

        this.resultado = { totalRegistros, sumaTotal };

        alert(`Total de registros: ${totalRegistros}\nSuma total: ${sumaTotal.toFixed(2)}`);
      };

      reader.readAsArrayBuffer(file);
    }
  }
}

bootstrapApplication(App);
