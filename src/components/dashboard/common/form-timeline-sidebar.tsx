"use client";

import { CheckCircle2, HelpCircle, LucideIcon, Sparkles } from "lucide-react";
import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface VerticalTimelineStep {
  id: number;
  label: string;
  icon: LucideIcon;
  complete?: boolean;
}

interface FormTimelineSidebarProps {
  timelineTitle: string;
  steps: VerticalTimelineStep[];
  currentStep: number;
  disclaimerTitle?: string;
  disclaimerDescription?: string;
}

export function FormTimelineSidebar({
  timelineTitle,
  steps,
  currentStep,
  disclaimerTitle,
  disclaimerDescription,
}: FormTimelineSidebarProps) {
  return (
    <aside className="flex flex-col gap-6 order-2 lg:order-1">
      {/* 1. Steps Timeline Card */}
      <Card className="bg-card border shadow-xs">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2.5">
            <Sparkles className="size-5 text-primary shrink-0" />
            {timelineTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <div className="relative ps-7 space-y-8 before:absolute before:left-3 rtl:before:left-auto rtl:before:right-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isDone = Boolean(step.complete) || step.id < currentStep;

              return (
                <div key={step.id} className="relative flex items-center gap-4 py-1">
                  <span
                    className={`absolute -left-7 rtl:-left-auto rtl:-right-7 flex size-6.5 items-center justify-center rounded-full text-xs font-bold ring-4 ring-background transition-colors ${
                      isDone
                        ? "bg-emerald-500 text-white"
                        : isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="size-4" /> : step.id}
                  </span>
                  <div className="flex items-center gap-2.5 min-w-0 ms-2">
                    <StepIcon
                      className={`size-5 shrink-0 ${
                        isActive
                          ? "text-primary"
                          : isDone
                            ? "text-emerald-500"
                            : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`text-base font-medium truncate ${
                        isActive
                          ? "text-foreground font-semibold"
                          : isDone
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 2. Optional Disclaimer Card */}
      {disclaimerTitle && disclaimerDescription && (
        <Card className="border shadow-xs border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
              <HelpCircle className="size-4 shrink-0" />
              {disclaimerTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">{disclaimerDescription}</p>
          </CardContent>
        </Card>
      )}
    </aside>
  );
}
