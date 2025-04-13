import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Prestamo } from './prestamoService';

export interface ReporteMora {
    nombreCliente: string;
    cedula: string;
    numeroPrestamo: number;
    cuotasVencidas: number;
    montoAdeudado: number;
    moneda: string;
}

export interface ReporteAsesor {
    nombreAsesor: string;
    ventasColones: number;
    ventasDolares: number;
    comisionesColones: number;
    comisionesDolares: number;
    comisionTotal: number;
}

//Función para formatear valores con validaciones
//Si el valor es nulo o no está definido se devuelve 0
const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
        return "Valor no disponible";
    }
//Si es un string si valor tampoco esta disponible
    const stringValue = value.toString().trim();
    if (stringValue === '') {
        return "Valor no disponible";
    }
//Transorma los valores a número y los valida 
    const num = typeof value === 'number' ? value : parseFloat(stringValue);
    if (isNaN(num)) {
        console.warn('Valor inválido para formatear:', value);
        return "Valor no disponible";
    }
//Se formatea con 2 decimales 
    return num.toLocaleString('es-CR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};


class ReporteService {
    private API_URL = 'http://localhost:5240/api';

    async generarReporteMorosidad(): Promise<ReporteMora[]> {
        try {
            console.log('Iniciando solicitud de reporte de morosidad');
            const response = await fetch(`${this.API_URL}/Reportes/morosidad`);
            const responseText = await response.text();

            if (!response.ok) {
                console.error('Error en la respuesta:', response.status, responseText);
                throw new Error(responseText || 'Error al obtener el reporte de morosidad');
            }

            try {
                const data = JSON.parse(responseText);
                console.log('Datos del reporte recibidos:', data);
                
                return data;
            } catch (parseError) {
                console.error('Error al parsear la respuesta:', parseError);
                throw new Error('Error al procesar la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error en generarReporteMorosidad:', error);
            throw error;
        }
    }

    generarPDFMorosidad(datos: ReporteMora[]): void {
        try {
            console.log('Iniciando generación de PDF con datos:', datos);
            const doc = new jsPDF();

            // Configurar fuente para caracteres especiales
            doc.setFont("helvetica");
            
            // Título del reporte
            const titulo = 'Reporte de Morosidad - TecBank';
            const fecha = format(new Date(), "d 'de' MMMM 'de' yyyy");
            
            // Centrar el título
            const pageWidth = doc.internal.pageSize.width;
            const titleWidth = doc.getStringUnitWidth(titulo) * 18 / doc.internal.scaleFactor;
            const titleX = (pageWidth - titleWidth) / 2;
            
            doc.setFontSize(18);
            doc.text(titulo, titleX, 20);
            
            doc.setFontSize(12);
            doc.text(`Generado el ${fecha}`, 14, 30);

            // Configuración de la tabla
            autoTable(doc, {
                head: [['Cliente', 'Cédula', 'N° Préstamo', 'Cuotas Vencidas', 'Monto Adeudado']],
                body: datos.map(item => [
                    item.nombreCliente,
                    item.cedula,
                    item.numeroPrestamo.toString(),
                    item.cuotasVencidas.toString(),
                    `${item.moneda} ${item.montoAdeudado.toLocaleString('es-CR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`
                ]),
                startY: 40,
                styles: {
                    fontSize: 10,
                    cellPadding: 3,
                    font: "helvetica"
                },
                headStyles: {
                    fillColor: [41, 98, 255],
                    textColor: 255,
                    fontSize: 11,
                    fontStyle: 'bold',
                    halign: 'center'
                },
                columnStyles: {
                    0: { cellWidth: 'auto' },
                    1: { cellWidth: 'auto' },
                    2: { cellWidth: 'auto', halign: 'center' },
                    3: { cellWidth: 'auto', halign: 'center' },
                    4: { cellWidth: 'auto', halign: 'right' }
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                margin: { top: 40 },
                didDrawPage: (data) => {
                    // Pie de página
                    doc.setFontSize(10);
                    doc.text(
                        `Página ${data.pageNumber} de ${doc.getNumberOfPages()}`,
                        doc.internal.pageSize.width - 20,
                        doc.internal.pageSize.height - 10,
                        { align: 'right' }
                    );
                }
            });

            // Guardar el PDF
            const fileName = `Reporte_Morosidad_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
            console.log('Guardando PDF con nombre:', fileName);
            doc.save(fileName);
        } catch (error) {
            console.error('Error al generar PDF:', error);
            throw new Error('Error al generar el PDF del reporte');
        }
    }
    //Reporte de asesores
    async generarReporteAsesores(): Promise<ReporteAsesor[]> {
        try {
            console.log('Iniciando solicitud de reporte de asesores');
            const response = await fetch(`${this.API_URL}/Reportes/asesores`);
            const responseText = await response.text();
     
            if (!response.ok) {
                console.error('Error en la respuesta:', response.status, responseText);
                throw new Error(responseText || 'Error al obtener el reporte de asesores');
            }
     
            try {
                // Se intenta parsear el texto a JSON
                console.log('Texto bruto recibido:', responseText);
                const data = JSON.parse(responseText);
                console.log('Datos parseados:', data);

                // Log detallado por cada asesor
                data.forEach((asesor: any, index: number) => {
                    console.log(`Asesor ${index + 1}:`);
                    console.log(`  Nombre: ${asesor.nombreAsesor}`);
                    console.log(`  Ventas Colones: ${asesor.ventasColones}`);
                    console.log(`  Ventas Dólares: ${asesor.ventasDolares}`);
                    console.log(`  Comisión Colones: ${asesor.comisionesColones}`);
                    console.log(`  Comisión Dólares: ${asesor.comisionesDolares}`);
                    console.log(`  Comisión Total: ${asesor.comisionTotal}`);
                });
                console.log('Datos del reporte recibidos:', JSON.stringify(data));
                return data;
            } catch (parseError) {
                console.error('Error al parsear la respuesta:', parseError);
                throw new Error('Error al procesar la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error en generarReporteAsesores:', error);
            throw error;
        }
     }
     
    generarPDFAsesores(datos: ReporteAsesor[]): void {
        try {
            console.log('Iniciando generación de PDF con datos de asesores:', datos);
            const doc = new jsPDF();

            // Configurar fuente para caracteres especiales
            doc.setFont("helvetica");
            
            // Título del reporte
            const titulo = 'Reporte de Asesores - TecBank';
            
            // Centrar el título
            const pageWidth = doc.internal.pageSize.width;
            const titleWidth = doc.getStringUnitWidth(titulo) * 18 / doc.internal.scaleFactor;
            const titleX = (pageWidth - titleWidth) / 2;

            doc.setFontSize(18);
            doc.text(titulo, titleX, 20);

            doc.setFontSize(12);
            doc.text('Reporte de Asesores', 14, 30);

            // Configuración de la tabla
            autoTable(doc, {
                head: [['Asesor', 'Ventas Colones', 'Ventas Dólares', 'Comisión Colones', 'Comisión Dólares', 'Comisión Total']],
                //Formateo de los datos antes de agregarse
                body: datos.map(item => {
                    console.log('Formateando fila de asesor:', item.nombreAsesor);
                    const ventasColones = formatValue(item.ventasColones);
                    const ventasDolares = formatValue(item.ventasDolares);
                    const comisionesColones = formatValue(item.comisionesColones);
                    const comisionesDolares = formatValue(item.comisionesDolares);
                    const comisionTotal = formatValue(item.comisionTotal);
    
                    console.log(`  ventasColones: ${ventasColones}`);
                    console.log(`  ventasDolares: ${ventasDolares}`);
                    console.log(`  comisionColones: ${comisionesColones}`);
                    console.log(`  comisionDolares: ${comisionesDolares}`);
                    console.log(`  totalComision: ${comisionTotal}`);
    
                    return [
                        item.nombreAsesor,
                        ventasColones,
                        ventasDolares,
                        comisionesColones,
                        comisionesDolares,
                        comisionTotal,
                    ];
                }),

                startY: 40,
                styles: {
                    fontSize: 10,
                    cellPadding: 3,
                    font: "helvetica"
                },
                headStyles: {
                    fillColor: [41, 98, 255],
                    textColor: 255,
                    fontSize: 11,
                    fontStyle: 'bold',
                    halign: 'center'
                },
                columnStyles: {
                    0: { cellWidth: 'auto' },
                    1: { cellWidth: 'auto', halign: 'right' },
                    2: { cellWidth: 'auto', halign: 'right' },
                    3: { cellWidth: 'auto', halign: 'right' },
                    4: { cellWidth: 'auto', halign: 'right' },
                    5: { cellWidth: 'auto', halign: 'right' }
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                margin: { top: 40 },
                didDrawPage: (data) => {
                    // Pie de página
                    doc.setFontSize(10);
                    doc.text(
                        `Página ${data.pageNumber} de ${doc.getNumberOfPages()}`,
                        doc.internal.pageSize.width - 20,
                        doc.internal.pageSize.height - 10,
                        { align: 'right' }
                    );
                }
            });

            // Guardar el PDF
            const fileName = `Reporte_Asesores_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
            console.log('Guardando PDF con nombre:', fileName);
            doc.save(fileName);
        } catch (error) {
            console.error('Error al generar PDF:', error);
            throw new Error('Error al generar el PDF del reporte de asesores');
        }
    }
    }
export const reporteService = new ReporteService(); 