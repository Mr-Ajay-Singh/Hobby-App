import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Tabs } from 'expo-router';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface TabConfig {
  name: string;
  label: string;
  activeIcon: IconName;
  inactiveIcon: IconName;
}

const TAB_CONFIGS: Record<string, TabConfig> = {
  index: {
    name: 'index',
    label: 'Home',
    activeIcon: 'home',
    inactiveIcon: 'home-outline',
  },
  learn: {
    name: 'learn',
    label: 'Learn',
    activeIcon: 'school',
    inactiveIcon: 'school-outline',
  },
  prelims: {
    name: 'prelims',
    label: 'Prelims',
    activeIcon: 'book-open-page-variant',
    inactiveIcon: 'book-open-page-variant-outline',
  },
  mains: {
    name: 'mains',
    label: 'Mains',
    activeIcon: 'file-document-edit',
    inactiveIcon: 'file-document-edit-outline',
  },
  news: {
    name: 'news',
    label: 'News',
    activeIcon: 'receipt-text',
    inactiveIcon: 'receipt-text-outline',
  },
};

export type CustomTabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>
>[0];

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const config = TAB_CONFIGS[route.name] || {
            name: route.name,
            label: route.name,
            activeIcon: 'circle' as IconName,
            inactiveIcon: 'circle-outline' as IconName,
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const activeColor = '#2F69FE';
          const inactiveColor = '#7A808E';
          const iconColor = isFocused ? activeColor : inactiveColor;
          const textColor = isFocused ? activeColor : inactiveColor;
          const iconName = isFocused ? config.activeIcon : config.inactiveIcon;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={config.label}
              testID={descriptors[route.key]?.options?.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.7}
              style={styles.tabItem}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={iconName}
                  size={24}
                  color={iconColor}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: textColor,
                    fontWeight: isFocused ? '600' : '400',
                  },
                ]}
              >
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F1015',
    borderTopWidth: 1,
    borderTopColor: '#1A1C24',
    paddingTop: 8,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconContainer: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: 0.1,
  },
});
