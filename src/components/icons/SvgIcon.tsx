import icons from './icons.json';

type IconName = keyof typeof icons.icons;

interface SvgIconProps {
  name: string;
  size?: number;
  className?: string;
}

function isIconName(name: string): name is IconName {
  return Object.prototype.hasOwnProperty.call(icons.icons, name);
}

const SvgIcon = ({ name, size = 20, className = '' }: SvgIconProps) => {
  const iconSvg = isIconName(name) ? icons.icons[name] : undefined;
  
  if (!iconSvg) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  // Create a sanitized SVG string
  const svg = iconSvg
    .replace(/width="[^"]*"/, `width="${size}"`)
    .replace(/height="[^"]*"/, `height="${size}"`)
    .replace(/<svg/, `<svg width="${size}" height="${size}"`);

  return (
    <span 
      className={`flex justify-center items-center ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default SvgIcon;
