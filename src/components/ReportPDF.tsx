import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

// Puedes registrar una fuente si quieres un look más profesional
// Font.register({ family: 'Roboto', src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxM.woff2' });

interface Supplement {
  name: string;
  link: string;
}

interface ReportPDFProps {
  title: string;
  content: string;
  supplements: Supplement[];
  date?: string;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: 32,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  headerBlock: {
    backgroundColor: '#dc2626',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentBlock: {
    marginBottom: 24,
    lineHeight: 1.6,
    fontSize: 12,
    color: '#222',
  },
  sectionTitle: {
    color: '#b91c1c',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
  },
  supplementList: {
    marginTop: 8,
    marginLeft: 12,
  },
  supplementItem: {
    marginBottom: 6,
    fontSize: 12,
  },
  link: {
    color: '#2563eb',
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
  date: {
    color: '#888',
    fontSize: 10,
    textAlign: 'right',
    marginBottom: 4,
  },
});

const ReportPDF: React.FC<ReportPDFProps> = ({ title, content, supplements, date }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.contentBlock}>
        {date ? `${date}\n` : ''}
        {title ? `${title}\n\n` : ''}
        {content}
      </Text>
      {supplements.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Enlaces a productos recomendados:</Text>
          <View style={styles.supplementList}>
            {supplements.map((supp, idx) => (
              <Text key={idx} style={styles.supplementItem}>
                {`${idx + 1}. `}
                <Link src={supp.link} style={styles.link}>{supp.name}</Link>
              </Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  </Document>
);

export default ReportPDF; 