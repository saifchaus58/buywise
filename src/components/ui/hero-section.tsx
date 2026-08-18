import React from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { Mockup, MockupFrame } from "./mockup";
import { Glow } from "./glow";
import { cn } from "../../lib/utils";

export interface HeroAction {
  text: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "glow" | "outline" | "secondary";
}

export interface HeroProps {
  badge?: {
    text: string;
    action: {
      text: string;
      href?: string;
      onClick?: () => void;
    };
  };
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  actions: HeroAction[];
  image?: {
    light: string;
    dark?: string;
    alt: string;
  };
  children?: React.ReactNode;
  className?: string;
}

export function HeroSection({
  badge,
  title,
  description,
  actions,
  image,
  children,
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative text-[#0B0F19]",
        "pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-6 lg:px-8",
        "overflow-hidden",
        className
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:gap-12">
        <div className="flex flex-col items-center gap-5 text-center sm:gap-8 max-w-4xl mx-auto">
          {/* Badge */}
          {badge && (
            <div className="animate-appear">
              <Badge
                variant="outline"
                className="gap-2 px-3.5 py-1.5 rounded-full border-[#E5E7EB] bg-white/90 backdrop-blur-md shadow-xs hover:border-[#BFDBFE] transition-all cursor-pointer group"
                onClick={badge.action.onClick}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="text-[#5F6673] text-xs font-medium">
                  {badge.text}
                </span>
                <span className="flex items-center gap-1 text-[#2563EB] text-xs font-semibold group-hover:translate-x-0.5 transition-transform">
                  {badge.action.text}
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Badge>
            </div>
          )}

          {/* Title */}
          <div className="relative z-10 inline-block animate-appear">
            {typeof title === "string" ? (
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#0B0F19] leading-[1.08]">
                {title}
              </h1>
            ) : (
              title
            )}
          </div>

          {/* Description */}
          <div className="relative z-10 max-w-2xl animate-appear opacity-0 delay-100">
            {typeof description === "string" ? (
              <p className="text-base sm:text-lg md:text-xl font-normal text-[#5F6673] leading-relaxed">
                {description}
              </p>
            ) : (
              description
            )}
          </div>

          {/* Actions */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3.5 animate-appear opacity-0 delay-300 pt-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "default"}
                size="lg"
                onClick={action.onClick}
                className="cursor-pointer gap-2"
                asChild={!!action.href && !action.onClick}
              >
                {action.href && !action.onClick ? (
                  <a href={action.href} className="flex items-center gap-2">
                    {action.icon}
                    <span>{action.text}</span>
                  </a>
                ) : (
                  <>
                    {action.icon}
                    <span>{action.text}</span>
                  </>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Mockup Frame with Glow */}
        <div className="relative pt-6 sm:pt-10 max-w-5xl mx-auto w-full">
          <MockupFrame
            className="animate-appear opacity-0 delay-700 w-full rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-[#FFFFFF]/80 backdrop-blur-xl shadow-2xl p-2 sm:p-4"
            size="large"
          >
            <Mockup type="responsive" className="w-full bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#E5E7EB]">
              {children ? (
                children
              ) : image ? (
                <img
                  src={image.light}
                  alt={image.alt}
                  className="w-full h-auto object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : null}
            </Mockup>
          </MockupFrame>
          <Glow
            variant="top"
            className="animate-appear-zoom opacity-0 delay-1000"
          />
        </div>
      </div>
    </section>
  );
}
