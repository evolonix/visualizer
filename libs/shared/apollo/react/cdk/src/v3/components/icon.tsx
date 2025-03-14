import * as Hero16SolidIcons from '@heroicons/react/16/solid';
import * as Hero20SolidIcons from '@heroicons/react/20/solid';
import * as Hero24OutlineIcons from '@heroicons/react/24/outline';
import * as Hero24SolidIcons from '@heroicons/react/24/solid';

export type IconType = 'outline' | 'solid';
export type SolidIconSize = '24' | '20' | '16'; // Only valid for solid icons
export interface IconProps {
  icon: string;
  type?: IconType;
  solidSize?: SolidIconSize;
  // All other props passed to the component
  [x: string]: unknown;
}

export const Icon = ({ icon, type = 'outline', solidSize: size = '24', ...props }: IconProps) => {
  const clearAndUpper = (text: string) => text.replace(/-/, '').toUpperCase();
  const toPascalCase = (text: string) => text.replace(/(^\w|-\w)/g, clearAndUpper);

  // Convert icon name from kebab-case to PascalCase
  const name = `${toPascalCase(icon)}Icon`;
  const Component =
    type === 'outline'
      ? Hero24OutlineIcons[name as keyof typeof Hero24OutlineIcons]
      : size === '16'
        ? Hero16SolidIcons[name as keyof typeof Hero16SolidIcons]
        : size === '20'
          ? Hero20SolidIcons[name as keyof typeof Hero20SolidIcons]
          : Hero24SolidIcons[name as keyof typeof Hero24SolidIcons];
  return <Component {...props} />;
};
