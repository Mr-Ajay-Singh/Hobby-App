import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../theme';
import { useActiveHobbyStore } from '@/features/dashboard/store/useActiveHobbyStore';

interface DesktopSidebarProps {
  onOpenSwitcher?: () => void;
  onOpenSettings?: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  onOpenSwitcher,
  onOpenSettings,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { activeUserHobbyId } = useActiveHobbyStore();

  const isRouteActive = (route: string) => {
    if (route === '/' && (pathname === '/' || pathname === '')) return true;
    return pathname.startsWith(route) && route !== '/';
  };

  const navItems = [
    {
      label: 'Dashboard',
      icon: 'grid' as const,
      route: '/',
      onPress: () => router.push('/'),
    },
    {
      label: 'AI Coach Chat',
      icon: 'message-square' as const,
      route: '/skill-chat',
      onPress: () =>
        router.push({
          pathname: '/skill-chat',
          params: activeUserHobbyId ? { userHobbyId: activeUserHobbyId } : undefined,
        }),
    },
    {
      label: 'Leaderboard',
      icon: 'award' as const,
      route: '/leaderboard',
      onPress: () => router.push('/leaderboard'),
    },
  ];

  return (
    <View style={styles.sidebar}>
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons name="robot-happy" size={24} color="#FFFFFF" />
        </View>
        <View>
          <Text style={styles.brandTitle}>Skill AI Coach</Text>
          <Text style={styles.brandSubtitle}>Personalized Learning</Text>
        </View>
      </View>

      {/* Navigation Items */}
      <View style={styles.navSection}>
        <Text style={styles.sectionLabel}>NAVIGATION</Text>
        {navItems.map((item) => {
          const active = isRouteActive(item.route);
          return (
            <TouchableOpacity
              key={item.label}
              style={[styles.navItem, active && styles.navItemActive]}
              onPress={item.onPress}
              activeOpacity={0.8}
            >
              <Feather
                name={item.icon}
                size={18}
                color={active ? Colors.primaryBtn : Colors.textSecondary}
              />
              <Text style={[styles.navItemText, active && styles.navItemTextActive]}>
                {item.label}
              </Text>
              {active && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Actions & Settings Footer */}
      {onOpenSwitcher && (
        <View style={styles.footerSection}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onOpenSwitcher}
            activeOpacity={0.8}
          >
            <Feather name="plus-circle" size={16} color={Colors.accentCyan} />
            <Text style={styles.actionBtnText}>Switch / Add Hobby</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    backgroundColor: Colors.bgCard,
    borderRightWidth: 1,
    borderRightColor: Colors.borderCard,
    paddingVertical: 24,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    height: '100%',
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  logoCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.primaryBtn,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  brandSubtitle: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  navSection: {
    flex: 1,
    gap: 6,
  },
  sectionLabel: {
    color: Colors.textSubtle,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  navItemText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  navItemTextActive: {
    color: Colors.primaryBtn,
    fontWeight: '800',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primaryBtn,
  },
  footerSection: {
    gap: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.bgCardSubtle,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: 12,
    paddingVertical: 10,
  },
  actionBtnText: {
    color: Colors.accentCyan,
    fontSize: 13,
    fontWeight: '700',
  },
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  settingsBtnText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
});
