"use client";

import { Button as ButtonPrimitive } from '@base-ui/react/button';

// BaseUI event type
type BaseUIEvent<T extends React.SyntheticEvent> = T & {
  preventBaseUIHandler: () => void;
  baseUIHandlerPrevented?: boolean;
};
import { cva, type VariantProps } from 'class-variance-authority';
import { useAnimate } from 'motion/react';
import { useCallback, useRef, useState } from 'react';
import { cn } from '#/lib/utils';

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-xl text-sm font-bold whitespace-nowrap outline-none select-none disabled:pointer-events-none disabled:opacity-50 disabled:grayscale [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'text-white',
        outline: 'text-foreground',
        secondary: 'text-secondary-foreground',
        ghost: 'text-foreground',
        destructive: 'text-white',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-12 gap-2 px-6',
        xs: "h-8 gap-1 px-3 text-xs",
        sm: "h-10 gap-1.5 px-4 text-[0.8rem]",
        lg: 'h-14 gap-2 px-8 text-base',
        xl: 'h-16 gap-3 px-10 text-lg',
        icon: 'size-12',
        'icon-xs': "size-8",
        'icon-sm': 'size-10',
        'icon-lg': 'size-14',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Splash particle animation
function useSplashAnimation() {
  const [scope, animate] = useAnimate();

  const createParticle = (x: string, y: string, isDark: boolean) => {
    const ele = document.createElement("div");
    const size = Math.floor(Math.random() * 10) + 10;
    
    ele.className = cn(
      "absolute rounded-full pointer-events-none",
      isDark ? "bg-white/80" : "bg-black/80"
    );
    
    Object.assign(ele.style, {
      height: `${size}px`,
      width: `${size}px`,
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
    });

    return ele;
  };

  const triggerSplash = async (e: BaseUIEvent<React.MouseEvent<HTMLButtonElement>>) => {
    if (!scope.current) return;
    
    const wrapper = scope.current.querySelector("[data-splash-wrapper]");
    if (!wrapper) return;

    const isDark = document.documentElement.classList.contains("dark");
    const numParticles = Math.floor(Math.random() * 5) + 5;
    const particles: HTMLElement[] = [];

    const bounding = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX ? `${e.clientX - bounding.left}px` : "50%";
    const clickY = e.clientY ? `${e.clientY - bounding.top}px` : "50%";

    for (let i = 0; i < numParticles; i++) {
      const particle = createParticle(clickX, clickY, isDark);
      wrapper.appendChild(particle);
      particles.push(particle);
    }

    await Promise.all(
      particles.map((particle) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 50;
        const xOffset = Math.cos(angle) * distance;
        const yOffset = Math.sin(angle) * distance;

        return animate(
          particle, 
          { x: xOffset, y: yOffset, scale: 0, opacity: 0 },
          { duration: 0.4, ease: "easeOut" }
        );
      })
    );

    particles.forEach((p) => p.remove());
  };

  return { scope, triggerSplash };
}

// Press feedback hook
function usePressFeedback(duration = 100) {
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const press = useCallback(() => {
    setIsPressed(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsPressed(false), duration);
  }, [duration]);

  return { isPressed, press };
}

export interface ButtonProps extends ButtonPrimitive.Props, VariantProps<typeof buttonVariants> {}

function Button({
  className,
  variant = 'default',
  size = 'default',
  children,
  onClick,
  render,
  ...props
}: ButtonProps) {
  const { scope, triggerSplash } = useSplashAnimation();
  const { isPressed, press } = usePressFeedback(100);

  const handleClick = (e: BaseUIEvent<React.MouseEvent<HTMLButtonElement>>) => {
    press();
    triggerSplash(e);
    onClick?.(e);
  };

  // Variant-based colors (오렌지 계열)
  const getVariantColors = () => {
    switch (variant) {
      case 'default':
        return {
          shadow: 'bg-orange-700',
          surface: 'bg-orange-500 group-hover/button:bg-orange-400',
        };
      case 'secondary':
        return {
          shadow: 'bg-secondary-foreground/40',
          surface: 'bg-secondary group-hover/button:bg-secondary/80',
        };
      case 'destructive':
        return {
          shadow: 'bg-red-800',
          surface: 'bg-red-500 group-hover/button:bg-red-400',
        };
      case 'outline':
      case 'ghost':
        return {
          shadow: 'bg-foreground/20',
          surface: 'bg-background group-hover/button:bg-muted border-2 border-border',
        };
      case 'link':
        return null;
      default:
        return {
          shadow: 'bg-orange-700',
          surface: 'bg-orange-500 group-hover/button:bg-orange-400',
        };
    }
  };

  const colors = getVariantColors();

  // 3D 버튼 내용 (shadow + surface layers)
  const buttonContent = colors ? (
    <>
      {/* Splash particles container */}
      <span data-splash-wrapper className="absolute inset-0 pointer-events-none z-10" />
      

      
      {/* Surface layer with press animation */}
      <span
        className={cn(
          "relative flex items-center justify-center w-full h-full rounded-xl px-4 select-none",
          "transition-transform duration-75 ease-out shadow-2xl",
          colors.surface,
          isPressed 
            ? "translate-y-[4px]" 
            : "group-hover/button:translate-y-[-1px]"
        )}
      >
        {children}
      </span>
    </>
  ) : (
    <>{children}</>
  );

  return (
    <ButtonPrimitive
      ref={scope}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      render={render}
      {...props}
    >
      {buttonContent}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
