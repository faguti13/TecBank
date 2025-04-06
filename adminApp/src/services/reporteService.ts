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
}

export const reporteService = new ReporteService(); 