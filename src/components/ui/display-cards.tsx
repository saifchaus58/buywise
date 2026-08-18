import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  onClick?: () => void;
}

export function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-indigo-400" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "bg-indigo-600 text-white",
  titleClassName = "text-indigo-600",
  onClick,
  ...props
}: DisplayCardProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      onClick={onClick}
      {...props}
      className={cn(
        "relative flex h-36 w-[19rem] sm:w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-2xl border-2 border-slate-200/90 bg-white/95 backdrop-blur-md px-4 py-3.5 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[18rem] after:bg-gradient-to-l after:from-white after:to-transparent after:content-[''] hover:border-indigo-400 hover:bg-white shadow-xl cursor-pointer [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className
      )}
    >
      <div>
        <span className={cn("relative inline-block rounded-full p-1.5 shadow-sm", iconClassName)}>
          {icon}
        </span>
        <p className={cn("text-sm font-bold tracking-tight", titleClassName)}>{title}</p>
      </div>
      <p className="whitespace-nowrap text-sm font-semibold text-slate-800 line-clamp-1">{description}</p>
      <p className="text-xs text-slate-400 font-medium">{date}</p>
    </div>
  );
}

export interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards: DisplayCardProps[] = [
    {
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-slate-200 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className:
        "[grid-area:stack] translate-x-8 sm:translate-x-14 translate-y-6 sm:translate-y-8 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-slate-200 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className:
        "[grid-area:stack] translate-x-16 sm:translate-x-28 translate-y-12 sm:translate-y-16 hover:translate-y-6",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700 my-2">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
