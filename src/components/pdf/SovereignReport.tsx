import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#0f172a', // slate-900
    fontFamily: 'Helvetica',
    color: '#f8fafc', // slate-50
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#334155', // slate-700
    paddingBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#818cf8', // indigo-400
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8', // slate-400
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#1e293b', // slate-800
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fbbf24', // amber-400
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dataLabel: {
    width: 120,
    fontSize: 12,
    color: '#94a3b8',
  },
  dataValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
  },
  narrativeText: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#cbd5e1', // slate-300
    marginBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#64748b', // slate-500
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  }
});

export const SovereignReport = ({ 
  name, 
  compoundNumber, 
  planet, 
  narrative 
}: { 
  name: string, 
  compoundNumber: number, 
  planet: string, 
  narrative: string 
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>The Pilgrim's Revelation</Text>
        <Text style={styles.subtitle}>Sovereign Numerology Profile for {name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deterministic Core</Text>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Identity Name:</Text>
          <Text style={styles.dataValue}>{name}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Compound Vibration:</Text>
          <Text style={styles.dataValue}>{compoundNumber}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Governing Planet:</Text>
          <Text style={styles.dataValue}>{planet}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The Narrative</Text>
        {narrative.split('\n\n').map((paragraph, idx) => (
          <Text key={idx} style={styles.narrativeText}>
            {paragraph.replace(/\*\*/g, '') /* Basic markdown removal */}
          </Text>
        ))}
      </View>

      <View style={styles.footer}>
        <Text>NUMERIQ.AI — Sovereign Engine v1.0</Text>
        <Text>Generated securely under Chaldean strict compliance.</Text>
      </View>
    </Page>
  </Document>
);
