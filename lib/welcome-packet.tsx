// Welcome Packet PDF generator using @react-pdf/renderer
// Server-side only — do not import in client components

import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  renderToBuffer,
} from '@react-pdf/renderer'

// Property location (replace with real coordinates)
const PROPERTY_LAT = process.env.PROPERTY_LAT ?? '51.5074'
const PROPERTY_LON = process.env.PROPERTY_LON ?? '-0.1278'
const PROPERTY_ADDRESS = process.env.PROPERTY_ADDRESS ?? 'Katey\'s BNB, 1 Meadow Lane, Countryside'

function getGoogleMapsUrl(lat: string, lon: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`
}

function getAppleMapsUrl(lat: string, lon: string): string {
  return `https://maps.apple.com/?daddr=${lat},${lon}&dirflg=d`
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#FAF8F5',
    padding: 48,
    color: '#1C1917',
  },
  header: {
    marginBottom: 32,
    borderBottomWidth: 2,
    borderBottomColor: '#C4622D',
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#C4622D',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#78716C',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#1C1917',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  text: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#44403C',
    marginBottom: 6,
  },
  highlight: {
    fontSize: 11,
    color: '#C4622D',
    fontFamily: 'Helvetica-Bold',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D6D0C8',
  },
  linkLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1C1917',
    marginRight: 8,
    width: 100,
  },
  link: {
    fontSize: 10,
    color: '#C4622D',
    flex: 1,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8E4DF',
    marginVertical: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 48,
    right: 48,
    textAlign: 'center',
    fontSize: 9,
    color: '#78716C',
  },
  recommendationItem: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#C4622D',
  },
  recommendationTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1C1917',
    marginBottom: 3,
  },
  recommendationDesc: {
    fontSize: 10,
    color: '#78716C',
    lineHeight: 1.5,
  },
})

interface WelcomePacketData {
  guestName: string
  roomName: string
  checkIn: Date
  checkOut: Date
  reservationId: string
}

const HOST_RECOMMENDATIONS = [
  {
    title: 'The Old Mill Bakery',
    description:
      'A 5-minute walk down the lane. Try the sourdough loaf — it\'s baked fresh every morning at 7am. Ask for Sarah, she\'ll save you a slice.',
  },
  {
    title: 'Riverside Walk',
    description:
      'Follow the footpath behind the garden gate for a 2-mile circular walk along the river. Best at sunrise when the mist is still on the water.',
  },
  {
    title: 'The Copper Kettle',
    description:
      'Our favourite local pub, 10 minutes by car. The Sunday roast is legendary — book ahead on weekends. They stock local ales from the Meadow Brewery.',
  },
  {
    title: 'Hilltop Viewpoint',
    description:
      'Drive 15 minutes north to the car park at Beacon Hill. The 360° view at sunset is something you\'ll remember for years.',
  },
  {
    title: 'Artisan Market',
    description:
      'Every Saturday morning in the village square. Local cheese, honey, pottery, and seasonal produce. Arrive early for the best selection.',
  },
]

function WelcomePacketDocument({ data }: { data: WelcomePacketData }) {
  const googleMapsUrl = getGoogleMapsUrl(PROPERTY_LAT, PROPERTY_LON)
  const appleMapsUrl = getAppleMapsUrl(PROPERTY_LAT, PROPERTY_LON)

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <Document
      title={`Welcome Packet — ${data.guestName}`}
      author="Katey's BNB"
      subject="Your stay at Katey's BNB"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Katey&apos;s BNB</Text>
          <Text style={styles.subtitle}>
            A personal welcome from your host, Katey
          </Text>
        </View>

        {/* Booking summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Booking</Text>
          <Text style={styles.text}>
            <Text style={styles.highlight}>Guest: </Text>
            {data.guestName}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.highlight}>Room: </Text>
            {data.roomName}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.highlight}>Check-in: </Text>
            {formatDate(data.checkIn)}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.highlight}>Check-out: </Text>
            {formatDate(data.checkOut)}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.highlight}>Reservation ID: </Text>
            {data.reservationId}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Navigation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Getting Here</Text>
          <Text style={styles.text}>{PROPERTY_ADDRESS}</Text>
          <Text style={styles.text}>
            Use the links below to navigate directly to us:
          </Text>

          <View style={styles.linkRow}>
            <Text style={styles.linkLabel}>Google Maps</Text>
            <Link src={googleMapsUrl} style={styles.link}>
              {googleMapsUrl}
            </Link>
          </View>

          <View style={styles.linkRow}>
            <Text style={styles.linkLabel}>Apple Maps</Text>
            <Link src={appleMapsUrl} style={styles.link}>
              {appleMapsUrl}
            </Link>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Host recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Katey&apos;s Recommendations</Text>
          <Text style={styles.text}>
            These are my personal favourites — places I love and think you will too.
          </Text>

          {HOST_RECOMMENDATIONS.map((rec, i) => (
            <View key={i} style={styles.recommendationItem}>
              <Text style={styles.recommendationTitle}>{rec.title}</Text>
              <Text style={styles.recommendationDesc}>{rec.description}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Katey&apos;s BNB · {PROPERTY_ADDRESS} · hello@kateys-bnb.com
        </Text>
      </Page>
    </Document>
  )
}

export async function generateWelcomePacket(data: WelcomePacketData): Promise<Buffer> {
  const buffer = await renderToBuffer(<WelcomePacketDocument data={data} />)
  return Buffer.from(buffer)
}

export { getGoogleMapsUrl, getAppleMapsUrl }
