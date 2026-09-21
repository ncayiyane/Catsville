import { Tabs } from 'expo-router';
import { CalendarDays, MapPin, Building2 } from 'lucide-react-native';

const colors = {
  ink: '#112A2D',
  muted: '#6E8583',
  line: '#E5EEEA',
  paper: '#F7FBF8',
  white: '#FFFFFF',
  mint: '#BFE7D1',
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          height: 78,
          paddingTop: 10,
          paddingBottom: 12,
          borderTopColor: colors.line,
          backgroundColor: colors.white,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Live',
          tabBarIcon: ({ color, size }) => <MapPin color={color} size={size} strokeWidth={2.2} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} strokeWidth={2.2} />,
        }}
      />
      <Tabs.Screen
        name="residence"
        options={{
          title: 'Residence',
          tabBarIcon: ({ color, size }) => <Building2 color={color} size={size} strokeWidth={2.2} />,
        }}
      />
    </Tabs>
  );
}
