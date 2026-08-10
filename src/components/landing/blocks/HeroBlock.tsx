import { Button } from "@/components/ui/button";
import type { Hero as HeroType, Media } from "@/payload-types";
import Link from "next/link";
import React from "react";
import PayloadImage from "../layout/payload-image";

/**
 * Hero component that displays a heading, subtext, and call-to-action buttons
 * against an optional background image.
 *
 * @param props - The Hero component props, matching the Payload Hero block type.
 */
export const HeroBlock: React.FC<HeroType> = ({ title, subtitle, backgroundImage, ctaButtons }) => {
  const image = backgroundImage as Media;

  return (
    <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-background">
      {/* Background Image with Overlay */}
      {image?.url && (
        <div className="absolute inset-0 z-0">
          <PayloadImage media={image} fill className="object-cover opacity-20" priority />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">{title}</h1>

          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              {subtitle}
            </p>
          )}

          {ctaButtons && ctaButtons.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {ctaButtons.map((button) => (
                <Button
                  key={button.id}
                  asChild
                  variant={button.style === "secondary" ? "outline" : "default"}
                  size="lg"
                  className="px-8"
                >
                  <Link href={button.link}>{button.label}</Link>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
