import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LogoProps {
  /**
   * The text or component to display for the brand name.
   * If image or svg is provided, this will be used alongside it unless logoOnly is true.
   */
  brandName?: React.ReactNode;
  /**
   * Alt text for the image logo. Falls back to brandName if it's a string, or "Logo".
   */
  alt?: string;
  /**
   * Optional image source for the logo.
   */
  logoImage?: string;
  /**
   * Optional SVG component or element for the logo.
   */
  logoSvg?: React.ReactNode;
  /**
   * Width of the logo (default: 30)
   */
  width?: number;
  /**
   * Height of the logo (default: 30)
   */
  height?: number;
  /**
   * Additional class names for the container.
   */
  className?: string;
  /**
   * If true, renders only the logo without the text.
   */
  logoOnly?: boolean;
}

/**
 * A flexible logo component that supports text, images, or SVGs.
 *
 * @param {LogoProps} props - The component props.
 * @param {React.ReactNode} [props.brandName] - The text or component to display for the brand name.
 * @param {string} [props.alt] - Alt text for the image logo.
 * @param {string} [props.logoImage] - Optional image URL for the logo.
 * @param {React.ReactNode} [props.logoSvg] - Optional SVG element or component for the logo.
 * @param {number} [props.width=30] - The width of the logo in pixels.
 * @param {number} [props.height=30] - The height of the logo in pixels.
 * @param {string} [props.className] - Additional CSS classes for the container.
 * @param {boolean} [props.logoOnly=false] - If true, only the logo will be rendered without the brand name.
 *
 * @example
 * ```tsx
 * <Logo brandName="OpenAI" logoImage="/logo.png" />
 * <Logo logoSvg={<MySvg />} logoOnly />
 * ```
 */

export function Logo({
  brandName,
  alt,
  logoImage,
  logoSvg,
  width = 30,
  height = 30,
  className,
  logoOnly = false,
}: LogoProps) {
  const imageAlt = alt || (typeof brandName === "string" ? brandName : "Logo");

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {logoImage ? (
        <Image
          src={logoImage}
          alt={imageAlt}
          width={width}
          height={height}
          className="object-contain"
          priority
        />
      ) : logoSvg ? (
        <div
          className="flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
          style={{ width, height }}
          {...(typeof logoSvg === "string"
            ? { dangerouslySetInnerHTML: { __html: logoSvg } }
            : { children: logoSvg })}
        />
      ) : null}

      {brandName && (
        <span className="font-bold tracking-tight text-foreground">
          {logoOnly ? "AE" : brandName}
        </span>
      )}
    </div>
  );
}
