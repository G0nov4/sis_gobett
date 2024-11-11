import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0',
        padding: 5,
        marginBottom: 10,
    },
    table: {
        width: '100%',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 5,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 3,
    },
    summaryBox: {
        border: 1,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    }
});

export const generateSalesReport = (data, filters) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Encabezado */}
            <Text style={styles.title}>REPORTE DE VENTAS</Text>
            
            {/* Filtros Aplicados */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Filtros Aplicados</Text>
                <Text>Período: {filters.startDate} - {filters.endDate}</Text>
                {filters.vendor && <Text>Vendedor: {filters.vendor}</Text>}
                {/* ... otros filtros ... */}
            </View>

            {/* Resumen General */}
            <View style={styles.summaryBox}>
                <Text style={{ fontWeight: 'bold' }}>Resumen General</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text>Total Ventas: {data.totalVentas}</Text>
                        <Text>Ventas Completadas: {data.ventasCompletadas}</Text>
                        <Text>Ventas Pendientes: {data.ventasPendientes}</Text>
                    </View>
                    <View>
                        <Text>Monto Total: Bs. {data.montoTotal}</Text>
                        <Text>Promedio por Venta: Bs. {data.promedioVenta}</Text>
                        <Text>Por Cobrar: Bs. {data.totalPorCobrar}</Text>
                    </View>
                </View>
            </View>

            {/* Top Productos */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Productos Más Vendidos</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={{ width: '40%' }}>Producto</Text>
                        <Text style={{ width: '20%' }}>Cantidad</Text>
                        <Text style={{ width: '20%' }}>Total</Text>
                        <Text style={{ width: '20%' }}>Frecuencia</Text>
                    </View>
                    {data.masVendidos.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={{ width: '40%' }}>{item.producto}</Text>
                            <Text style={{ width: '20%' }}>{item.cantidadTotal}</Text>
                            <Text style={{ width: '20%' }}>Bs. {item.montoTotal}</Text>
                            <Text style={{ width: '20%' }}>{item.frecuencia}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Análisis de Pagos */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Métodos de Pago</Text>
                <View style={styles.table}>
                    {data.metodoPago.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={{ width: '40%' }}>{item.metodo}</Text>
                            <Text style={{ width: '30%' }}>{item.cantidad} ventas</Text>
                            <Text style={{ width: '30%' }}>Bs. {item.total}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Tendencias */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tendencia de Ventas</Text>
                {data.diarias.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={{ width: '40%' }}>{item.fecha}</Text>
                        <Text style={{ width: '30%' }}>{item.cantidad} ventas</Text>
                        <Text style={{ width: '30%' }}>Bs. {item.total}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
); 