import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Building2, MapPin, Phone, Mail, Clock, Shield, Users, Wifi, Car, Coffee } from 'lucide-react-native';

const colors = { 
  ink: '#0A1929', 
  body: '#1E3A5F', 
  muted: '#64748B', 
  line: '#E2E8F0', 
  paper: '#F8FAFC', 
  white: '#FFFFFF', 
  mint: '#4ADE80', 
  mintDark: '#16A34A', 
  blueSoft: '#E0F2FE', 
  yellowSoft: '#FEF3C7' 
};

export default function ResidenceScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>RESIDENCE INFORMATION</Text>
        <Text style={styles.title}>Catsville Residence</Text>
        <Text style={styles.subtitle}>Your home away from home at CPUT.</Text>

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}><Building2 size={32} color={colors.ink} strokeWidth={2} /></View>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Catsville Student Residence</Text>
            <Text style={styles.heroSubtitle}>Cape Peninsula University of Technology</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Location & Contact</Text>
        <View style={styles.infoCard}>
          <InfoRow icon={<MapPin size={18} color={colors.mintDark} />} label="Address" value="Catsville Road, Cape Town" />
          <InfoRow icon={<Phone size={18} color={colors.mintDark} />} label="Phone" value="+27 21 123 4567" />
          <InfoRow icon={<Mail size={18} color={colors.mintDark} />} label="Email" value="catsville@cput.ac.za" last />
        </View>

        <Text style={styles.sectionTitle}>Residence Hours</Text>
        <View style={styles.hoursCard}>
          <HoursRow day="Monday - Friday" time="06:00 - 22:00" />
          <HoursRow day="Saturday" time="07:00 - 21:00" />
          <HoursRow day="Sunday" time="08:00 - 20:00" last />
        </View>

        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesGrid}>
          <AmenityCard icon={<Wifi size={20} color={colors.mintDark} />} title="Free WiFi" description="High-speed internet" />
          <AmenityCard icon={<Shield size={20} color={colors.mintDark} />} title="24/7 Security" description="Safe environment" />
          <AmenityCard icon={<Users size={20} color={colors.mintDark} />} title="Study Rooms" description="Quiet spaces" />
          <AmenityCard icon={<Coffee size={20} color={colors.mintDark} />} title="Common Area" description="Social space" />
          <AmenityCard icon={<Car size={20} color={colors.mintDark} />} title="Parking" description="Available" />
          <AmenityCard icon={<Clock size={20} color={colors.mintDark} />} title="Laundry" description="On-site facilities" />
        </View>

        <Text style={styles.sectionTitle}>Shuttle Information</Text>
        <View style={styles.shuttleCard}>
          <View style={styles.shuttleHeader}>
            <MapPin size={18} color={colors.mintDark} />
            <Text style={styles.shuttleTitle}>Campus Connection</Text>
          </View>
          <Text style={styles.shuttleText}>Regular shuttle service to CPUT Campus operates daily. Check the Schedule tab for departure times and use Live tracking for real-time updates.</Text>
          <View style={styles.shuttleStats}>
            <View style={styles.shuttleStat}>
              <Text style={styles.shuttleStatValue}>25</Text>
              <Text style={styles.shuttleStatLabel}>min trip</Text>
            </View>
            <View style={styles.shuttleStat}>
              <Text style={styles.shuttleStatValue}>30</Text>
              <Text style={styles.shuttleStatLabel}>min frequency</Text>
            </View>
            <View style={styles.shuttleStat}>
              <Text style={styles.shuttleStatValue}>22:00</Text>
              <Text style={styles.shuttleStatLabel}>last departure</Text>
            </View>
          </View>
        </View>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>📢 Important Notice</Text>
          <Text style={styles.noticeText}>Students must carry their student ID cards at all times. Visitors must be signed in at the reception desk. Quiet hours are from 22:00 to 06:00.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value, last = false }: { icon: React.ReactNode; label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, last && styles.lastRow]}>
      <View style={styles.infoIcon}>{icon}</View>
      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function HoursRow({ day, time, last = false }: { day: string; time: string; last?: boolean }) {
  return (
    <View style={[styles.hoursRow, last && styles.lastRow]}>
      <Text style={styles.hoursDay}>{day}</Text>
      <Text style={styles.hoursTime}>{time}</Text>
    </View>
  );
}

function AmenityCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <View style={styles.amenityCard}>
      <View style={styles.amenityIcon}>{icon}</View>
      <Text style={styles.amenityTitle}>{title}</Text>
      <Text style={styles.amenityDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { maxWidth: 720, width: '100%', alignSelf: 'center', paddingHorizontal: 20, paddingTop: 30, paddingBottom: 36 },
  eyebrow: { color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: colors.ink, fontSize: 30, fontWeight: '700', letterSpacing: -0.7, marginTop: 7 },
  subtitle: { color: colors.body, fontSize: 13, lineHeight: 20, marginTop: 6 },
  heroCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.ink, padding: 17, borderRadius: 21, marginTop: 22 },
  heroIcon: { width: 50, height: 50, borderRadius: 17, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  heroContent: { flex: 1, marginLeft: 12 },
  heroTitle: { color: colors.white, fontSize: 15, fontWeight: '800' },
  heroSubtitle: { color: '#A9BFBA', fontSize: 10, marginTop: 4, fontWeight: '600' },
  sectionTitle: { color: colors.ink, fontSize: 19, fontWeight: '700', marginTop: 30, marginBottom: 12 },
  infoCard: { backgroundColor: colors.white, borderRadius: 18, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.line },
  infoRow: { flexDirection: 'row', alignItems: 'center', minHeight: 70, borderBottomWidth: 1, borderBottomColor: colors.line },
  lastRow: { borderBottomWidth: 0 },
  infoIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: '#EDF8F1', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  infoCopy: { flex: 1 },
  infoLabel: { color: colors.muted, fontSize: 10, fontWeight: '700' },
  infoValue: { color: colors.ink, fontSize: 12, fontWeight: '800', marginTop: 4 },
  hoursCard: { backgroundColor: colors.white, borderRadius: 18, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.line },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 50, borderBottomWidth: 1, borderBottomColor: colors.line, paddingVertical: 12 },
  hoursDay: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  hoursTime: { color: colors.mintDark, fontSize: 12, fontWeight: '800' },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 13 },
  amenityCard: { width: '48%', backgroundColor: colors.white, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.line, alignItems: 'center' },
  amenityIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  amenityTitle: { color: colors.ink, fontSize: 12, fontWeight: '800', textAlign: 'center' },
  amenityDescription: { color: colors.muted, fontSize: 10, textAlign: 'center', marginTop: 4 },
  shuttleCard: { backgroundColor: colors.mint, borderRadius: 18, padding: 16, marginTop: 16 },
  shuttleHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  shuttleTitle: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  shuttleText: { color: colors.body, fontSize: 11, lineHeight: 16, marginBottom: 12 },
  shuttleStats: { flexDirection: 'row', justifyContent: 'space-around' },
  shuttleStat: { alignItems: 'center' },
  shuttleStatValue: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  shuttleStatLabel: { color: colors.body, fontSize: 9, marginTop: 4, fontWeight: '600' },
  noticeCard: { backgroundColor: colors.yellowSoft, borderRadius: 16, padding: 16, marginTop: 16 },
  noticeTitle: { color: colors.ink, fontSize: 12, fontWeight: '800', marginBottom: 8 },
  noticeText: { color: colors.body, fontSize: 11, lineHeight: 16 },
});