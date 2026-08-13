import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { Colors } from '../../theme';

interface AdaptiveContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  maxWidth?: number;
}

export const AdaptiveContainer: React.FC<AdaptiveContainerProps> = ({
  children,
  style,
  maxWidth,
}) => {
  const { isDesktop, isTablet } = useResponsive();

  const containerMaxWidth = maxWidth
    ? maxWidth
    : isTablet
    ? 768
    : '100%';

  return (
    <View style={styles.outerWrapper}>
      <View
        style={[
          styles.innerWrapper,
          { maxWidth: containerMaxWidth },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.bgApp,
    alignItems: 'center',
  },
  innerWrapper: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
});
