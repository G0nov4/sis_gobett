import { Document, Page, Text, View, StyleSheet, Image, PDFViewer } from '@react-pdf/renderer';
import logo from '../../assets/Logo Gobett.png';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        flexDirection: 'column'
    },
    header: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'auto'
    },
    logo: {
        width: 100,
        height: 50,
        objectFit: 'contain'
    },
    headerCenter: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        padding: '0 20px'
    },
    headerRight: {
        width: 200,
        fontSize: 10
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#666',
        marginBottom: 20
    },
    fabricContainer: {
        flexDirection: 'column',
        marginBottom: 20
    },
    fabricHeader: {
        flexDirection: 'row',
        marginBottom: 15,
        height: 'auto'
    },
    fabricImage: {
        width: '30%',
        height: 200,
        paddingRight: 15
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
    },
    fabricInfo: {
        width: '70%',
        border: '1pt solid #666'
    },
    infoRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#666'
    },
    infoLabel: {
        width: '30%',
        padding: 5,
        backgroundColor: '#f5f5f5',
        borderRightWidth: 1,
        borderRightColor: '#666'
    },
    infoValue: {
        width: '70%',
        padding: 5
    },
    rollsContainer: {
        marginTop: 15
    },
    colorSection: {
        marginBottom: 15
    },
    colorHeader: {
        backgroundColor: '#f0f0f0',
        padding: 5,
        marginBottom: 5
    },
    rollsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    },
    rollBox: {
        border: '1pt solid #666',
        padding: 5,
        backgroundColor: '#fff'
    },
    rollBoxUnavailable: {
        backgroundColor: '#ffccc7'
    },
    rollBoxStore: {
        backgroundColor: '#bae7ff'
    },
    rollBoxReserved: {
        backgroundColor: '#ffffb8'
    },
    statusIcon: {
        textAlign: 'center'
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    legendBox: {
        width: 10,
        height: 10,
        marginRight: 5
    },
    legendText: {
        fontSize: 10
    }
});

const FabricReport = ({ fabrics }) => {
    const groupRollsByColor = (rolls) => {
        return rolls.reduce((groups, roll) => {
            const colorName = roll.attributes.color.data.attributes.name;
            if (!groups[colorName]) {
                groups[colorName] = [];
            }
            groups[colorName].push(roll);
            return groups;
        }, {});
    };

    return (
        <Document>
            {fabrics.map((fabric) => (
                <Page key={fabric.id} size="A4" style={styles.page}>
                    <View style={styles.header}>
                        <Image 
                            src={logo} 
                            style={styles.logo} 
                        />
                        <View style={styles.headerCenter}>
                            <Text>
                                {fabrics.length > 1 ? 'REPORTE DE TELAS' : `REPORTE DE TELA - ${fabric.attributes.name.toUpperCase()}`}
                            </Text>
                        </View>
                        <View style={styles.headerRight}>
                            <Text>Fecha: {new Date().toLocaleDateString()}</Text>
                            <Text>Total Colores: {fabric.attributes.colors.data.length}</Text>
                            <Text>Total Rollos: {fabric.attributes.rolls.data.length}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.fabricContainer}>
                        <View style={styles.fabricHeader}>
                            <View style={styles.fabricImage}>
                                {fabric.attributes.fabric_images.data[0] && (
                                    <Image
                                        style={styles.image}
                                        src={process.env.REACT_APP_BACKEND_URL + fabric.attributes.fabric_images.data[0].attributes.url}
                                    />
                                )}
                            </View>
                            <View style={styles.fabricInfo}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Código</Text>
                                    <Text style={styles.infoValue}>{fabric.attributes.code}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Nombre</Text>
                                    <Text style={styles.infoValue}>{fabric.attributes.name}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Descripción</Text>
                                    <Text style={styles.infoValue}>{fabric.attributes.description}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Ancho</Text>
                                    <Text style={styles.infoValue}>{fabric.attributes.height} cm</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Peso</Text>
                                    <Text style={styles.infoValue}>{fabric.attributes.weight} gr/m²</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.rollsContainer}>
                            {Object.entries(groupRollsByColor(fabric.attributes.rolls.data)).map(([color, rolls]) => (
                                <View key={color} style={styles.colorSection}>
                                    <View style={styles.colorHeader}>
                                        <Text>{color} - {rolls.length} rollos</Text>
                                    </View>
                                    <View style={styles.rollsGrid}>
                                        {rolls.map((roll) => (
                                            <View 
                                                key={roll.id} 
                                                style={[
                                                    styles.rollBox,
                                                    roll.attributes.status === 'NO_DISPONIBLE' && styles.rollBoxUnavailable,
                                                    roll.attributes.status === 'EN_TIENDA' && styles.rollBoxStore,
                                                    roll.attributes.status === 'RESERVADO' && styles.rollBoxReserved,
                                                    { width: '10%', height: 'auto' }
                                                ]}
                                            >
                                                <Text style={{ fontSize: 10, color: 'gray' }}>{roll.attributes.code}</Text>
                                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{roll.attributes.roll_footage} m</Text>
                                                <Text style={[styles.statusIcon, { fontSize: 12 }]}>
                                                    {roll.attributes.status === 'NO_DISPONIBLE' && '❌'}
                                                    {roll.attributes.status === 'EN_TIENDA' && '🏪'}
                                                    {roll.attributes.status === 'RESERVADO' && '🔒'}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.legend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendBox, { backgroundColor: '#fff' }]} />
                            <Text style={styles.legendText}>Disponible</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendBox, { backgroundColor: '#ffccc7' }]} />
                            <Text style={styles.legendText}>No Disponible</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendBox, { backgroundColor: '#bae7ff' }]} />
                            <Text style={styles.legendText}>En Tienda</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendBox, { backgroundColor: '#ffffb8' }]} />
                            <Text style={styles.legendText}>Reservado</Text>
                        </View>
                    </View>
                </Page>
            ))}
        </Document>
    );
};

export const generateFabricReport = (fabrics) => {
    return (
        <PDFViewer style={{ width: '100%', height: '100%' }}>
            <FabricReport fabrics={fabrics.data} />
        </PDFViewer>
    );
};

export default FabricReport; 