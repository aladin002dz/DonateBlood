import Image from "next/image"
import { cn } from "@/lib/utils"

type LogoSize = "nav" | "home" | "mobile"

interface LogoProps {
  size?: LogoSize
  className?: string
  alt?: string
}

const sizeConfig: Record<LogoSize, { width: number; height: number; src: string; srcSet?: string }> = {
  nav: {
    width: 24,
    height: 24,
    src: "/logo/logo-nav.png",
  },
  mobile: {
    width: 32,
    height: 32,
    src: "/logo/logo-mobile.png",
  },
  home: {
    width: 80,
    height: 80,
    src: "/logo/logo-home.png",
  },
}

export function Logo({ size = "nav", className, alt = "Logo" }: LogoProps) {
  const config = sizeConfig[size]

  return (
    <Image
      src={config.src}
      alt={alt}
      width={config.width}
      height={config.height}
      className={cn("object-contain", className)}
      priority={size === "home"}
    />
  )
}

