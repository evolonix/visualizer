import * as Hero16SolidIcons from '@heroicons/react/16/solid';
import * as Hero20SolidIcons from '@heroicons/react/20/solid';
import * as Hero24OutlineIcons from '@heroicons/react/24/outline';
import * as Hero24SolidIcons from '@heroicons/react/24/solid';

export type IconType = 'outline' | 'solid'; // outline is only valid for 24px icons
export type SolidIconSize = 24 | 20 | 16; // Only valid for solid icons
export interface DynamicIconProps {
  icon: string;
  type?: IconType;
  solidSize?: SolidIconSize;
  // All other props passed to the component
  [x: string]: unknown;
}

export const DynamicIcon = ({
  icon,
  type = 'outline',
  solidSize = 24,
  ...props
}: DynamicIconProps) => {
  // Convert icon name from kebab-case to PascalCase (e.g. cog-6-tooth to Cog6ToothIcon)
  const iconName = icon
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
    .concat('Icon');

  const Icon =
    type === 'solid' && solidSize === 16
      ? Hero16SolidIcons[iconName as keyof typeof Hero16SolidIcons]
      : type === 'solid' && solidSize === 20
        ? Hero20SolidIcons[iconName as keyof typeof Hero20SolidIcons]
        : type === 'solid' && solidSize === 24
          ? Hero24SolidIcons[iconName as keyof typeof Hero24SolidIcons]
          : Hero24OutlineIcons[iconName as keyof typeof Hero24OutlineIcons];

  if (!Icon) {
    throw new Error(`Icon ${icon} does not exist`);
  }

  return <Icon {...props} />;
};
