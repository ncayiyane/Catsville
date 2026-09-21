import { useState, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import { ArrowDown, ArrowUp, CalendarDays, Clock3, Info, Route, MapPin, Search, Bus, ArrowRight } from 'lucide-react-native';

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
  yellowSoft: '#FEF3C7',
  orange: '#F97316',
  purple: '#7C3AED'
};

type ShuttleDeparture = {
  id: string;
  time: string;
  origin: string;
  destination: string;
  direction: 'catsville-to-campus' | 'campus-to-residence';
  period: 'morning' | 'afternoon' | 'evening';
};

const shuttleSchedule: ShuttleDeparture[] = [
  // Morning - All Catsville → CPUT Campus
  { id: '0630', time: '06:30', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'morning' },
  { id: '0700', time: '07:00', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'morning' },
  { id: '0730', time: '07:30', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'morning' },
  { id: '0800', time: '08:00', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'morning' },
  { id: '0830', time: '08:30', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'morning' },
  { id: '0900', time: '09:00', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'morning' },
  { id: '1000', time: '10:00', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'morning' },
  { id: '1100', time: '11:00', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'morning' },
  { id: '1200', time: '12:00', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'afternoon' },
  { id: '1240', time: '12:40', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'afternoon' },
  // Afternoon/Evening - Mixed directions
  { id: '1320', time: '13:20', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'afternoon' },
  { id: '1400', time: '14:00', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'afternoon' },
  { id: '1440', time: '14:40', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'afternoon' },
  { id: '1520', time: '15:20', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'afternoon' },
  { id: '1600', time: '16:00', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'afternoon' },
  { id: '1700', time: '17:00', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'evening' },
  { id: '1800', time: '18:00', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'evening' },
  { id: '1900', time: '19:00', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'evening' },
  { id: '2000', time: '20:00', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'evening' },
  { id: '2100', time: '21:00', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'evening' },
  { id: '2200', time: '22:00', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'evening' },
];

function formatDate() {
  return new Intl.DateTimeFormat('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
}

function getNextShuttle(): ShuttleDeparture | null {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  for (const shuttle of shuttleSchedule) {
    const [hours, minutes] = shuttle.time.split(':').map(Number);
    const shuttleTime = hours * 60 + minutes;
    
    if (shuttleTime > currentTime) {
      return shuttle;
    }
  }
  
  return null; // No more shuttles today
}

function getTimeUntilNext(shuttle: ShuttleDeparture): string {
  const now = new Date();
  const [hours, minutes] = shuttle.time.split(':').map(Number);
  const shuttleTime = new Date();
  shuttleTime.setHours(hours, minutes, 0, 0);
  
  const diffMs = shuttleTime.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins <= 0) return 'Departing now';
  if (diffMins === 1) return 'Departs in 1 minute';
  return `Departs in ${diffMins} minutes`;
}

export default function ScheduleScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState<'all' | 'catsville-to-campus' | 'campus-to-residence'>('all');
  const [periodFilter, setPeriodFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  
  const nextShuttle = useMemo(() => getNextShuttle(), []);
  const currentDate = useMemo(() => formatDate(), []);
  
  const filteredSchedule = useMemo(() => {
    return shuttleSchedule.filter(shuttle => {
      const matchesSearch = searchQuery === '' || 
        shuttle.time.includes(searchQuery) ||
        shuttle.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shuttle.destination.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDirection = directionFilter === 'all' || shuttle.direction === directionFilter;
      const matchesPeriod = periodFilter === 'all' || shuttle.period === periodFilter;
      
      return matchesSearch && matchesDirection && matchesPeriod;
    });
  }, [searchQuery, directionFilter, periodFilter]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>CPUT SHUTTLE TRACKER</Text>
        <Text style={styles.title}>Full Schedule</Text>
        <Text style={styles.subtitle}>Complete Catsville ↔ CPUT Campus timetable • {currentDate}</Text>

        {/* Next Shuttle Card */}
        {nextShuttle ? (
          <View style={styles.nextShuttleCard}>
            <View style={styles.nextShuttleHeader}>
              <Bus size={20} color={colors.mintDark} />
              <Text style={styles.nextShuttleTitle}>NEXT SHUTTLE</Text>
            </View>
            <Text style={styles.nextShuttleTime}>{nextShuttle.time}</Text>
            <View style={styles.nextShuttleRoute}>
              <Text style={styles.nextShuttleOrigin}>{nextShuttle.origin}</Text>
              <ArrowRight size={16} color={colors.mintDark} />
              <Text style={styles.nextShuttleDestination}>{nextShuttle.destination}</Text>
            </View>
            <Text style={styles.nextShuttleCountdown}>{getTimeUntilNext(nextShuttle)}</Text>
          </View>
        ) : (
          <View style={styles.noShuttleCard}>
            <Text style={styles.noShuttleText}>No more scheduled shuttles today.</Text>
          </View>
        )}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.muted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search time, CPUT, Catsville..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Filter Schedule</Text>
          <Text style={styles.sectionCount}>{filteredSchedule.length} departures</Text>
        </View>

        {/* Direction Filters */}
        <View style={styles.filterContainer}>
          <Pressable 
            style={[styles.filterButton, directionFilter === 'all' && styles.filterButtonActive]}
            onPress={() => setDirectionFilter('all')}
          >
            <Text style={[styles.filterText, directionFilter === 'all' && styles.filterTextActive]}>All Routes</Text>
          </Pressable>
          <Pressable 
            style={[styles.filterButton, directionFilter === 'catsville-to-campus' && styles.filterButtonActive]}
            onPress={() => setDirectionFilter('catsville-to-campus')}
          >
            <Text style={[styles.filterText, directionFilter === 'catsville-to-campus' && styles.filterTextActive]}>To Campus</Text>
          </Pressable>
          <Pressable 
            style={[styles.filterButton, directionFilter === 'campus-to-residence' && styles.filterButtonActive]}
            onPress={() => setDirectionFilter('campus-to-residence')}
          >
            <Text style={[styles.filterText, directionFilter === 'campus-to-residence' && styles.filterTextActive]}>To Residence</Text>
          </Pressable>
        </View>

        {/* Period Filters */}
        <View style={styles.periodFilterContainer}>
          <Pressable 
            style={[styles.periodFilter, periodFilter === 'all' && styles.periodFilterActive]}
            onPress={() => setPeriodFilter('all')}
          >
            <Text style={[styles.periodFilterText, periodFilter === 'all' && styles.periodFilterTextActive]}>All Day</Text>
          </Pressable>
          <Pressable 
            style={[styles.periodFilter, periodFilter === 'morning' && styles.periodFilterActive]}
            onPress={() => setPeriodFilter('morning')}
          >
            <Text style={[styles.periodFilterText, periodFilter === 'morning' && styles.periodFilterTextActive]}>Morning</Text>
          </Pressable>
          <Pressable 
            style={[styles.periodFilter, periodFilter === 'afternoon' && styles.periodFilterActive]}
            onPress={() => setPeriodFilter('afternoon')}
          >
            <Text style={[styles.periodFilterText, periodFilter === 'afternoon' && styles.periodFilterActive]}>Afternoon</Text>
          </Pressable>
          <Pressable 
            style={[styles.periodFilter, periodFilter === 'evening' && styles.periodFilterActive]}
            onPress={() => setPeriodFilter('evening')}
          >
            <Text style={[styles.periodFilterText, periodFilter === 'evening' && styles.periodFilterTextActive]}>Evening</Text>
          </Pressable>
        </View>

        {/* Schedule List */}
        <View style={styles.scheduleList}>
          {filteredSchedule.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No shuttles match your filters</Text>
            </View>
          ) : (
            filteredSchedule.map((shuttle) => {
              const isNext = nextShuttle?.id === shuttle.id;
              return (
                <View key={shuttle.id} style={[styles.shuttleCard, isNext && styles.shuttleCardNext]}>
                  {isNext && <View style={styles.nextBadge}><Text style={styles.nextBadgeText}>NEXT</Text></View>}
                  <View style={styles.shuttleTime}>
                    <Text style={[styles.shuttleTimeText, isNext && styles.shuttleTimeTextNext]}>{shuttle.time}</Text>
                  </View>
                  <View style={styles.shuttleRoute}>
                    <View style={styles.shuttleOrigin}>
                      <Bus size={14} color={isNext ? colors.mintDark : colors.muted} />
                      <Text style={[styles.shuttleOriginText, isNext && styles.shuttleOriginTextNext]}>{shuttle.origin}</Text>
                    </View>
                    <ArrowRight size={16} color={isNext ? colors.mintDark : colors.muted} />
                    <View style={styles.shuttleDestination}>
                      <MapPin size={14} color={isNext ? colors.mintDark : colors.muted} />
                      <Text style={[styles.shuttleDestinationText, isNext && styles.shuttleDestinationTextNext]}>{shuttle.destination}</Text>
                    </View>
                  </View>
                  <View style={[styles.periodBadge, { backgroundColor: shuttle.period === 'morning' ? colors.blueSoft : colors.yellowSoft }]}>
                    <Text style={styles.periodBadgeText}>{shuttle.period}</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.infoCard}>
          <Info size={18} color={colors.mintDark} />
          <Text style={styles.infoText}>21 scheduled departures today. Times are based on official shuttle schedule. Each time applies to the direction shown.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { maxWidth: 800, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 },
  eyebrow: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' },
  title: { color: colors.ink, fontSize: 36, fontWeight: '800', letterSpacing: -1, marginTop: 8 },
  subtitle: { color: colors.body, fontSize: 15, lineHeight: 22, marginTop: 6 },
  nextShuttleCard: { backgroundColor: colors.ink, borderRadius: 24, padding: 24, marginTop: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  nextShuttleHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  nextShuttleTitle: { color: colors.mint, fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },
  nextShuttleTime: { color: colors.white, fontSize: 56, fontWeight: '800', letterSpacing: -2, marginBottom: 20 },
  nextShuttleRoute: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 },
  nextShuttleOrigin: { color: colors.white, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  nextShuttleDestination: { color: colors.white, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  nextShuttleCountdown: { color: colors.mint, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  noShuttleCard: { backgroundColor: colors.yellowSoft, borderRadius: 24, padding: 24, marginTop: 24, alignItems: 'center', borderWidth: 2, borderColor: colors.orange },
  noShuttleText: { color: colors.ink, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16, marginTop: 24, borderWidth: 2, borderColor: colors.line, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: colors.ink, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginBottom: 16 },
  sectionTitle: { color: colors.ink, fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  sectionCount: { color: colors.muted, fontSize: 14, fontWeight: '600', backgroundColor: colors.blueSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  filterContainer: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  filterButton: { flex: 1, minWidth: 110, backgroundColor: colors.white, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 2, borderColor: colors.line, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  filterButtonActive: { backgroundColor: colors.mint, borderColor: colors.mintDark, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  filterText: { color: colors.body, fontSize: 13, fontWeight: '700' },
  filterTextActive: { color: colors.ink },
  periodFilterContainer: { flexDirection: 'row', gap: 10 },
  periodFilter: { flex: 1, backgroundColor: colors.white, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, borderWidth: 2, borderColor: colors.line, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  periodFilterActive: { backgroundColor: colors.blueSoft, borderColor: colors.mintDark, borderWidth: 2 },
  periodFilterText: { color: colors.body, fontSize: 12, fontWeight: '700' },
  periodFilterTextActive: { color: colors.ink },
  scheduleList: { marginTop: 24 },
  emptyState: { backgroundColor: colors.white, borderRadius: 20, padding: 48, alignItems: 'center', borderWidth: 2, borderColor: colors.line, marginTop: 24 },
  emptyStateText: { color: colors.muted, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  shuttleCard: { backgroundColor: colors.white, borderRadius: 18, padding: 20, marginBottom: 12, borderWidth: 2, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  shuttleCardNext: { backgroundColor: '#F0FDF4', borderColor: colors.mintDark, borderWidth: 3 },
  nextBadge: { position: 'absolute', top: -10, right: -10, backgroundColor: colors.mint, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  nextBadgeText: { color: colors.ink, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  shuttleTime: { width: 70, alignItems: 'center' },
  shuttleTimeText: { color: colors.ink, fontSize: 20, fontWeight: '800' },
  shuttleTimeTextNext: { color: colors.mintDark },
  shuttleRoute: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  shuttleOrigin: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  shuttleOriginText: { color: colors.ink, fontSize: 13, fontWeight: '600', flex: 1 },
  shuttleOriginTextNext: { color: colors.mintDark, fontWeight: '700' },
  shuttleDestination: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  shuttleDestinationText: { color: colors.ink, fontSize: 13, fontWeight: '600', flex: 1 },
  shuttleDestinationTextNext: { color: colors.mintDark, fontWeight: '700' },
  periodBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  periodBadgeText: { color: colors.ink, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  infoCard: { flexDirection: 'row', gap: 12, backgroundColor: colors.blueSoft, borderRadius: 18, padding: 18, marginTop: 32, alignItems: 'flex-start', borderWidth: 1, borderColor: colors.mintDark },
  infoText: { color: colors.body, fontSize: 13, lineHeight: 20, flex: 1, fontWeight: '600' },
});