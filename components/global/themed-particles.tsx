'use client';

import { ComponentProps } from 'react';
import { Particles } from '../ui/particles';
import { useTheme } from 'next-themes';

export function ThemedParticles(props: Omit<ComponentProps<typeof Particles>, 'color'>) {
  const theme = useTheme();
  return <Particles {...props} color={theme.resolvedTheme === 'dark' ? '#fff' : '#000'} />;
}
