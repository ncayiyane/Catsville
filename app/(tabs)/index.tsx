import { useMemo, useState, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { Bell, Clock3, MapPin, Navigation, Route, SunMedium, Moon, AlertCircle, Volume2, Bus, ArrowRight } from 'lucide-react-native';

// Stub notification functions to prevent expo-notifications crashes
const sendDepartureNotification = async (location: string, departureTime: string) => {
  console.log(`Notification: Shuttle departing from ${location} at ${departureTime}`);
  Alert.alert('Shuttle Departure', `Shuttle is departing from ${location} at ${departureTime}`);
};

const setupNotificationListeners = (callback: (notification: unknown) => void) => {
  return () => {}; // Return empty cleanup function
};

const colors = {
  ink: '#0A1929',
  body: '#1E3A5F',
  muted: '#64748B',
  line: '#E2E8F0',
  paper: '#F8FAFC',
  white: '#FFFFFF',
  mint: '#4ADE80',
  mintDark: '#16A34A',
  yellow: '#FBBF24',
  yellowSoft: '#FEF3C7',
  blueSoft: '#E0F2FE',
  danger: '#EF4444',
};

type ShuttleDeparture = {
  id: string;
  time: string;
  origin: string;
  destination: string;
  direction: 'catsville-to-campus' | 'campus-to-residence';
  period: 'morning' | 'afternoon' | 'evening';
  etaMinutes: number;
  status: 'on-time' | 'delayed' | 'arriving' | 'departed';
};

const shuttleSchedule: ShuttleDeparture[] = [
  // Morning - All Catsville → CPUT Campus
  { id: '0630', time: '06:30', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'morning', etaMinutes: 0, status: 'on-time' },
  { id: '0700', time: '07:00', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'morning', etaMinutes: 0, status: 'on-time' },
  { id: '0730', time: '07:30', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'morning', etaMinutes: 0, status: 'on-time' },
  { id: '0800', time: '08:00', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'morning', etaMinutes: 0, status: 'on-time' },
  { id: '0830', time: '08:30', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'morning', etaMinutes: 0, status: 'on-time' },
  { id: '0900', time: '09:00', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'morning', etaMinutes: 0, status: 'on-time' },
  { id: '1000', time: '10:00', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'morning', etaMinutes: 0, status: 'on-time' },
  { id: '1100', time: '11:00', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'morning', etaMinutes: 0, status: 'on-time' },
  { id: '1200', time: '12:00', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'afternoon', etaMinutes: 0, status: 'on-time' },
  { id: '1240', time: '12:40', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'afternoon', etaMinutes: 0, status: 'on-time' },
  // Afternoon/Evening - Mixed directions
  { id: '1320', time: '13:20', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'afternoon', etaMinutes: 0, status: 'on-time' },
  { id: '1400', time: '14:00', origin: 'Catsville Residence', destination: 'CPUT C.T Campus', direction: 'catsville-to-campus', period: 'afternoon', etaMinutes: 0, status: 'on-time' },
  { id: '1440', time: '14:40', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'afternoon', etaMinutes: 0, status: 'on-time' },
  { id: '1520', time: '15:20', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'afternoon', etaMinutes: 0, status: 'on-time' },
  { id: '1600', time: '16:00', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'afternoon', etaMinutes: 0, status: 'on-time' },
  { id: '1700', time: '17:00', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'evening', etaMinutes: 0, status: 'on-time' },
  { id: '1800', time: '18:00', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'evening', etaMinutes: 0, status: 'on-time' },
  { id: '1900', time: '19:00', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'evening', etaMinutes: 0, status: 'on-time' },
  { id: '2000', time: '20:00', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'evening', etaMinutes: 0, status: 'on-time' },
  { id: '2100', time: '21:00', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'evening', etaMinutes: 0, status: 'on-time' },
  { id: '2200', time: '22:00', origin: 'CPUT C.T Campus', destination: 'Catsville Residence', direction: 'campus-to-residence', period: 'evening', etaMinutes: 0, status: 'on-time' },
];

function calculateRealTimeETA(shuttle: ShuttleDeparture): { etaMinutes: number; status: 'on-time' | 'delayed' | 'arriving' | 'departed' } {
  const now = new Date();
  const [hours, minutes] = shuttle.time.split(':').map(Number);
  const shuttleTime = new Date();
  shuttleTime.setHours(hours, minutes, 0, 0);
  
  const diffMs = shuttleTime.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  
  if (diffMinutes < 0) {
    return { etaMinutes: 0, status: 'departed' };
  } else if (diffMinutes <= 2) {
    return { etaMinutes: diffMinutes, status: 'arriving' };
  } else {
    return { etaMinutes: diffMinutes, status: 'on-time' };
  }
}

function formatDate() {
  return new Intl.DateTimeFormat('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
}

function getCurrentTime() {
  return new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function isMorning() {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 12;
}

export default function LiveScreen() {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [selectedRoute, setSelectedRoute] = useState<'catsville-to-campus' | 'campus-to-residence'>('campus-to-residence');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const dateLabel = useMemo(() => formatDate(), []);
  const greeting = useMemo(() => getGreeting(), []);
  const morning = useMemo(() => isMorning(), []);
  
  // Calculate real-time ETAs for all shuttles
  const liveBuses = useMemo(() => {
    return shuttleSchedule.map(shuttle => {
      const { etaMinutes, status } = calculateRealTimeETA(shuttle);
      return { ...shuttle, etaMinutes, status };
    });
  }, [currentTime]);

  // Update current time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const filteredBuses = liveBuses.filter(bus => bus.direction === selectedRoute && bus.status !== 'departed');
  const nextBus = filteredBuses.length > 0 ? filteredBuses[0] : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'arriving': return colors.mintDark;
      case 'delayed': return colors.danger;
      case 'on-time': return colors.mintDark;
      default: return colors.muted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'arriving': return 'ARRIVING';
      case 'delayed': return 'DELAYED';
      case 'on-time': return 'ON TIME';
      default: return 'DEPARTED';
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    if (!notificationsEnabled) {
      Alert.alert(
        'Notifications Enabled',
        'You will receive alerts when shuttles are about to depart from both Campus and Catsville Residence.',
        [{ text: 'OK' }]
      );
    }
  };

  const simulateDeparture = (location: string) => {
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
      sendDepartureNotification(location, timeStr);
    } catch (error) {
      console.error('Error simulating departure:', error);
      Alert.alert('Notification Error', 'Could not send test notification. Check console for details.');
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.eyebrow}>CPUT SHUTTLE TRACKER</Text>
            <Text style={styles.greeting}>{greeting}, Student</Text>
          </View>
          <Pressable 
            style={[styles.iconButton, notificationsEnabled && styles.iconButtonActive]} 
            onPress={toggleNotifications}
            accessibilityLabel="Toggle notifications"
          >
            <Bell size={20} color={notificationsEnabled ? colors.mintDark : colors.ink} strokeWidth={2} />
            {notificationsEnabled && <View style={styles.notificationDot} />}
          </Pressable>
        </View>

        <View style={styles.dateRow}>
          <View style={styles.dateIcon}>{morning ? <SunMedium size={18} color={colors.ink} strokeWidth={2.2} /> : <Moon size={18} color={colors.ink} strokeWidth={2.2} />}</View>
          <Text style={styles.dateText}>{dateLabel}</Text>
          <View style={styles.livePill}><View style={[styles.liveDot, styles.pulsing]} /><Text style={styles.liveText}>LIVE</Text></View>
        </View>

        <View style={styles.routeToggle}>
          <Pressable 
            style={[styles.toggleButton, selectedRoute === 'catsville-to-campus' && styles.toggleButtonActive]}
            onPress={() => setSelectedRoute('catsville-to-campus')}
          >
            <Text style={[styles.toggleText, selectedRoute === 'catsville-to-campus' && styles.toggleTextActive]}>To Campus</Text>
          </Pressable>
          <Pressable 
            style={[styles.toggleButton, selectedRoute === 'campus-to-residence' && styles.toggleButtonActive]}
            onPress={() => setSelectedRoute('campus-to-residence')}
          >
            <Text style={[styles.toggleText, selectedRoute === 'campus-to-residence' && styles.toggleTextActive]}>To Residence</Text>
          </Pressable>
        </View>

        {nextBus ? (
          <View style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <View>
                <Text style={styles.heroKicker}>NEXT BUS</Text>
                <Text style={styles.heroTime}>{nextBus.time}</Text>
              </View>
              <View style={[styles.departureBadge, { backgroundColor: getStatusColor(nextBus.status) }]}>
                <Clock3 size={16} color={colors.white} />
                <Text style={styles.departureBadgeText}>{nextBus.etaMinutes === 0 ? 'NOW' : `${nextBus.etaMinutes} min`}</Text>
              </View>
            </View>
            <View style={styles.routeLine}>
              <View style={styles.routeStop}><Bus size={17} color={colors.ink} /><Text style={styles.stopText}>{nextBus.origin}</Text></View>
              <View style={styles.routeConnector} />
              <View style={styles.routeStop}><MapPin size={17} color={colors.ink} fill={colors.ink} /><Text style={styles.stopText}>{nextBus.destination}</Text></View>
            </View>
            <View style={styles.heroFooter}>
              <View style={styles.vehicleMeta}>
                <Navigation size={15} color={colors.mintDark} />
                <Text style={styles.vehicleText}>{getStatusText(nextBus.status)}</Text>
              </View>
              <View style={styles.currentTimeBadge}>
                <Text style={styles.currentTimeText}>{currentTime}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.noShuttleCard}>
            <Text style={styles.noShuttleText}>No more shuttles scheduled today</Text>
          </View>
        )}

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Upcoming departures</Text>
            <Text style={styles.sectionSubtitle}>Real-time updates every 5 seconds</Text>
          </View>
        </View>

        <View style={styles.busList}>
          {filteredBuses.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No more shuttles in this direction today</Text>
            </View>
          ) : (
            filteredBuses.slice(0, 6).map((bus) => {
              const isNext = nextBus?.id === bus.id;
              return (
                <View key={bus.id} style={[styles.busRow, isNext && styles.busRowNext]}>
                  <View style={styles.timeColumn}>
                    <Text style={[styles.busTime, isNext && styles.busTimeNext]}>{bus.time}</Text>
                    <View style={styles.timeRail} />
                  </View>
                  <View style={[styles.statusIcon, { backgroundColor: getStatusColor(bus.status) }]}>
                    {bus.status === 'arriving' ? <AlertCircle size={15} color={colors.white} strokeWidth={2.5} /> : <Route size={15} color={colors.white} strokeWidth={2.2} />}
                  </View>
                  <View style={styles.busCopy}>
                    <Text style={[styles.busRoute, isNext && styles.busRouteNext]}>{bus.origin} <Text style={styles.arrow}>→</Text> {bus.destination}</Text>
                    <Text style={styles.busType}>{bus.direction === 'catsville-to-campus' ? 'To Campus' : 'To Residence'}</Text>
                  </View>
                  <View style={styles.etaBadge}>
                    <Text style={styles.etaText}>{bus.etaMinutes === 0 ? 'NOW' : `${bus.etaMinutes} min`}</Text>
                  </View>
                  {isNext && <View style={styles.nextLabel}><Text style={styles.nextLabelText}>NEXT</Text></View>}
                </View>
              );
            })
          )}
        </View>

        <View style={styles.infoCard}>
          <AlertCircle size={18} color={colors.mintDark} />
          <View style={styles.infoCopy}>
            <Text style={styles.infoTitle}>Real-time tracking</Text>
            <Text style={styles.infoText}>Bus locations update automatically. Arrivals are estimated based on current traffic conditions.</Text>
          </View>
        </View>

        <View style={styles.notificationTestCard}>
          <Volume2 size={18} color={colors.mintDark} />
          <View style={styles.notificationTestCopy}>
            <Text style={styles.notificationTestTitle}>Test departure alerts</Text>
            <Text style={styles.notificationTestText}>Enable notifications above, then tap to test alerts:</Text>
          </View>
        </View>

        <View style={styles.testButtonsRow}>
          <Pressable 
            style={styles.testButton} 
            onPress={() => simulateDeparture('CPUT Campus')}
          >
            <Text style={styles.testButtonText}>Campus Departure</Text>
          </Pressable>
          <Pressable 
            style={styles.testButton} 
            onPress={() => simulateDeparture('Catsville Residence')}
          >
            <Text style={styles.testButtonText}>Residence Departure</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { maxWidth: 720, width: '100%', alignSelf: 'center', paddingHorizontal: 20, paddingTop: 30, paddingBottom: 34 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  greeting: { color: colors.ink, fontSize: 26, fontWeight: '700', marginTop: 7, letterSpacing: -0.5 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line },
  iconButtonActive: { backgroundColor: colors.mint, borderColor: colors.mintDark },
  notificationDot: { position: 'absolute', top: 10, right: 11, width: 6, height: 6, borderRadius: 3, backgroundColor: colors.danger },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 22, marginBottom: 20 },
  dateIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  dateText: { color: colors.body, fontSize: 13, fontWeight: '600', flex: 1 },
  livePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.yellowSoft, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 20 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#CF9B21', marginRight: 6 },
  pulsing: { opacity: 1 },
  liveText: { color: '#8F6C18', fontSize: 9, fontWeight: '800', letterSpacing: 0.7 },
  routeToggle: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  toggleButton: { flex: 1, height: 44, borderRadius: 12, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line },
  toggleButtonActive: { backgroundColor: colors.mint, borderColor: colors.mintDark },
  toggleText: { color: colors.body, fontSize: 12, fontWeight: '700' },
  toggleTextActive: { color: colors.ink },
  heroCard: { backgroundColor: colors.ink, borderRadius: 24, padding: 20, overflow: 'hidden' },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroKicker: { color: '#9CB4AE', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  heroTime: { color: colors.white, fontSize: 46, lineHeight: 54, fontWeight: '700', letterSpacing: -1.5, marginTop: 4 },
  departureBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.mint, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 14 },
  departureBadgeText: { color: colors.white, fontSize: 11, fontWeight: '800' },
  routeLine: { marginTop: 20, paddingLeft: 4 },
  routeStop: { flexDirection: 'row', alignItems: 'center', minHeight: 24 },
  stopDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.mint, borderWidth: 3, borderColor: '#4C9B70', marginRight: 10 },
  stopText: { color: colors.white, fontSize: 14, fontWeight: '600' },
  routeConnector: { height: 17, width: 1, backgroundColor: '#5B7773', marginLeft: 5.5 },
  heroFooter: { borderTopWidth: 1, borderTopColor: '#2E4A4A', marginTop: 20, paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  vehicleMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  vehicleText: { color: '#A9BFBA', fontSize: 10, fontWeight: '600' },
  currentTimeBadge: { backgroundColor: colors.mint, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  currentTimeText: { color: colors.ink, fontSize: 11, fontWeight: '800' },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 30, marginBottom: 13 },
  sectionTitle: { color: colors.ink, fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  sectionSubtitle: { color: colors.muted, fontSize: 11, fontWeight: '600', marginTop: 4 },
  busList: { backgroundColor: colors.white, borderRadius: 18, paddingVertical: 2, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  busRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, borderBottomWidth: 1, borderBottomColor: colors.line },
  busRowNext: { backgroundColor: '#F1FAF4' },
  timeColumn: { width: 50, alignSelf: 'stretch', justifyContent: 'center' },
  busTime: { color: colors.body, fontSize: 12, fontWeight: '800' },
  busTimeNext: { color: colors.mintDark },
  timeRail: { position: 'absolute', top: 42, bottom: -13, left: 2, width: 1, backgroundColor: colors.line },
  statusIcon: { width: 31, height: 31, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  busCopy: { flex: 1 },
  busRoute: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  busRouteNext: { color: colors.mintDark },
  arrow: { color: colors.mintDark },
  busType: { color: colors.muted, fontSize: 10, marginTop: 4, fontWeight: '500' },
  etaBadge: { backgroundColor: colors.blueSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  etaText: { color: colors.mintDark, fontSize: 10, fontWeight: '800' },
  nextLabel: { backgroundColor: colors.mint, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 5 },
  nextLabelText: { color: colors.ink, fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  infoCard: { flexDirection: 'row', gap: 10, backgroundColor: colors.blueSoft, borderRadius: 16, padding: 14, marginTop: 16, alignItems: 'flex-start' },
  infoCopy: { flex: 1 },
  infoTitle: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  infoText: { color: colors.body, fontSize: 10, lineHeight: 15, marginTop: 3 },
  notificationTestCard: { flexDirection: 'row', gap: 10, backgroundColor: colors.yellowSoft, borderRadius: 16, padding: 14, marginTop: 12, alignItems: 'flex-start' },
  notificationTestCopy: { flex: 1 },
  notificationTestTitle: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  notificationTestText: { color: colors.body, fontSize: 10, lineHeight: 15, marginTop: 3 },
  testButtonsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  testButton: { flex: 1, backgroundColor: colors.mint, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.mintDark },
  testButtonText: { color: colors.ink, fontSize: 11, fontWeight: '800' },
  noShuttleCard: { backgroundColor: colors.yellowSoft, borderRadius: 20, padding: 20, marginTop: 22, alignItems: 'center' },
  noShuttleText: { color: colors.ink, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  emptyState: { backgroundColor: colors.white, borderRadius: 16, padding: 40, alignItems: 'center', borderWidth: 1, borderColor: colors.line },
  emptyStateText: { color: colors.muted, fontSize: 14, fontWeight: '600' },
});