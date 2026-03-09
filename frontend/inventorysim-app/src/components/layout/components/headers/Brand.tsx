import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * Brand Component
 *
 * Renders the RetailOps Sim logo and text in either "header" or "nav" variant.
 *
 * Features:
 * - Avatar with logo image (`imgSrc`) and fallback initials.
 * - Collapsible brand text when used in navigation (`nav`) variant.
 * - Gradient-styled brand name "RetailOps Sim".
 * - Optional subtext "Optimize. Simulate."
 * - Supports `asChild` wrapper pattern for custom element wrappers.
 * - Responsive sizing for header vs navigation placement.
 */


type Variant = 'nav' | 'header';

interface BrandProps {
  variant?: Variant;
  /** For nav: collapsed toggles hiding of brand text */
  collapsed?: boolean;
  imgSrc: string;
  imgAlt?: string;
  href?: string;
  className?: string;
  asChild?: boolean;
}

const Brand = ({
  variant = 'header',
  collapsed = false,
  imgSrc,
  imgAlt = 'RetailOps Sim Logo',
  href = '/',
  className = '',
  asChild = false,
}: BrandProps) => {
  const isNav = variant === 'nav';
  const Wrapper = asChild ? 'div' : 'a';
  const wrapperProps = asChild ? {} : { href };

  return (
    <Wrapper
      {...wrapperProps}
      className={`flex items-center gap-2 transition-all duration-300 ${className}`}
    >
      {/* Avatar sizes & shape differs by variant */}
      <Avatar
        className={
          isNav
            ? 'h-8 w-8 rounded-lg shrink-0' // nav avatar
            : 'h-6 w-6 sm:h-8 sm:w-8 rounded-none shrink-0' // header avatar
        }
      >
        <AvatarImage src={imgSrc} alt={imgAlt} />
        <AvatarFallback>RS</AvatarFallback>
      </Avatar>

      {/* Brand text RETAIL OPS */}
      <div
        className={`flex flex-col transition-opacity duration-300
          ${
            isNav
              ? // nav: support collapsed behaviour (opacity + width)
                collapsed
                ? 'opacity-0 w-0 overflow-hidden'
                : 'opacity-100 w-auto'
              : // header: responsive font sizing (sm keeps desktop look)
                'opacity-100 w-auto'
          }`}
      >
        <span
          className={`${
            isNav ? 'text-base' : 'text-sm sm:text-base'
          } font-semibold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent`}
        >
          RetailOps Sim
        </span>
        <span
          className={`${
            isNav ? 'text-[10px]' : 'text-[8px] sm:text-[10px]'
          } text-muted-foreground tracking-wide ${isNav ? 'mt-0.5' : '-mt-1'}`}
        >
          Optimize. Simulate.
        </span>
      </div>
    </Wrapper>
  );
};

export default Brand;
