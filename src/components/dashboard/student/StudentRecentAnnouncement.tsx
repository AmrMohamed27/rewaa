"use client";

import { DashboardCard } from "@/components/dashboard/overview/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { getStoredAnnouncements } from "@/lib/settings-storage";
import { AnnouncementItem } from "@/types/settings";
import { ArrowRight, ExternalLink, Megaphone } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

export function StudentRecentAnnouncement() {
  const t = useTranslations("studentDashboard.announcement");
  const [recentAnnouncement, setRecentAnnouncement] = useState<AnnouncementItem | null>(null);

  useEffect(() => {
    const loadLatestAnnouncement = () => {
      const all = getStoredAnnouncements();
      // Filter for active ones, sorted by createdAt descending (most recent first)
      const active = all
        .filter((a) => a.active)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      if (active.length > 0) {
        setRecentAnnouncement(active[0]);
      } else if (all.length > 0) {
        // Fallback to most recent even if inactive
        const sortedAll = [...all].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setRecentAnnouncement(sortedAll[0]);
      } else {
        setRecentAnnouncement(null);
      }
    };

    loadLatestAnnouncement();
    window.addEventListener("rewaa_announcements_updated", loadLatestAnnouncement);
    return () => window.removeEventListener("rewaa_announcements_updated", loadLatestAnnouncement);
  }, []);

  if (!recentAnnouncement) {
    return null;
  }

  const hasLink = Boolean(recentAnnouncement.url && recentAnnouncement.url.trim().length > 0);
  const isExternal = hasLink && /^https?:\/\//i.test(recentAnnouncement.url!);

  return (
    <DashboardCard className="relative overflow-hidden p-0 bg-card border border-border/80 shadow-xs">
      {/* End-aligned Image with fade effect from white/card background */}
      {recentAnnouncement.coverImage && (
        <div className="absolute inset-y-0 inset-e-0 w-full sm:w-1/2 md:w-5/12 pointer-events-none overflow-hidden select-none">
          <Image
            src={recentAnnouncement.coverImage}
            alt={recentAnnouncement.title || t("imageAlt")}
            fill
            className="object-cover object-center opacity-30 ltr:mask-[linear-gradient(to_right,transparent_0%,black_70%)] rtl:mask-[linear-gradient(to_left,transparent_0%,black_70%)]"
            unoptimized
          />
          {/* Subtle gradient wash over the image */}
          <div className="absolute inset-0 bg-linear-to-e from-card via-card/70 to-transparent" />
        </div>
      )}

      {/* Content Container (Start aligned) */}
      <div className="relative z-10 p-6 sm:p-8 max-w-2xl flex flex-col items-start gap-4 text-start">
        {/* Announcement Badge */}
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-3 py-1 font-semibold text-xs rounded-full"
        >
          <Megaphone className="size-3.5" />
          <span>{t("badge")}</span>
        </Badge>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-snug">
          {recentAnnouncement.title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
          {recentAnnouncement.description}
        </p>

        {/* CTA Button */}
        <div className="pt-2">
          {hasLink ? (
            isExternal ? (
              <Button asChild size="default" className="gap-2 font-semibold shadow-xs">
                <a href={recentAnnouncement.url!} target="_blank" rel="noopener noreferrer">
                  <span>{t("viewLink")}</span>
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            ) : (
              <Button asChild size="default" className="gap-2 font-semibold shadow-xs">
                <Link href={recentAnnouncement.url!}>
                  <span>{t("viewLink")}</span>
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </Button>
            )
          ) : (
            <Button
              asChild
              variant="default"
              size="default"
              className="gap-2 font-semibold shadow-xs"
            >
              <Link href="/contact-us">
                <span>{t("contactUs")}</span>
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </DashboardCard>
  );
}
