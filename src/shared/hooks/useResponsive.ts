import { useWindowDimensions, Platform } from 'react-native';

export const Breakpoints = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
};

export interface ResponsiveInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWeb: boolean;
}

export const useResponsive = (): ResponsiveInfo => {
  const { width, height } = useWindowDimensions();

  const isMobile = width < Breakpoints.tablet;
  const isTablet = width >= Breakpoints.tablet && width < Breakpoints.desktop;
  const isDesktop = width >= Breakpoints.desktop;
  const isWeb = Platform.OS === 'web';

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isWeb,
  };
};
