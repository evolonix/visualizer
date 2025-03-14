// libs/shared/apollo/react/src/components/dynamic-icon.tsx
import * as Hero20SolidIcons from '@heroicons/react/20/solid';
import * as Hero24OutlineIcons from '@heroicons/react/24/outline';
import * as Hero24SolidIcons from '@heroicons/react/24/solid';

export type IconName = keyof typeof Hero24OutlineIcons | keyof typeof Hero24SolidIcons | keyof typeof Hero20SolidIcons;
export type IconType = 'outline' | 'solid';
export type SolidIconSize = '24' | '20'; // Only valid for solid icons
export interface DynamicIconProps {
  icon: IconName | string;
  type?: IconType;
  solidSize?: SolidIconSize;
  // All other props passed to the component
  [x: string]: unknown;
}

export const DynamicIcon = ({ icon, type = 'outline', solidSize: size = '24', ...props }: DynamicIconProps) => {
  const Icon =
    type === 'outline'
      ? Hero24OutlineIcons[icon as IconName]
      : size === '20'
        ? Hero20SolidIcons[icon as IconName]
        : Hero24SolidIcons[icon as IconName];
  return <Icon {...props} />;
};
