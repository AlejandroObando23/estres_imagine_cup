import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_20px_-4px_hsl(260_30%_70%/0.2)] hover:shadow-[0_8px_30px_-8px_hsl(260_30%_60%/0.15)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-primary/30 bg-transparent text-foreground hover:bg-primary/10 hover:border-primary/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[0_4px_20px_-4px_hsl(260_30%_70%/0.2)]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        lavender: "bg-lavender text-primary-foreground hover:bg-lavender/90 shadow-[0_4px_20px_-4px_hsl(260_30%_70%/0.2)] hover:shadow-[0_8px_30px_-8px_hsl(260_30%_60%/0.15)]",
        mint: "bg-mint text-secondary-foreground hover:bg-mint/90 shadow-[0_4px_20px_-4px_hsl(260_30%_70%/0.2)] hover:shadow-[0_8px_30px_-8px_hsl(260_30%_60%/0.15)]",
        peach: "bg-peach text-foreground hover:bg-peach/90 shadow-[0_4px_20px_-4px_hsl(260_30%_70%/0.2)] hover:shadow-[0_8px_30px_-8px_hsl(260_30%_60%/0.15)]",
        sky: "bg-sky text-accent-foreground hover:bg-sky/90 shadow-[0_4px_20px_-4px_hsl(260_30%_70%/0.2)] hover:shadow-[0_8px_30px_-8px_hsl(260_30%_60%/0.15)]",
        gradient: "bg-gradient-to-r from-lavender to-rose text-primary-foreground hover:opacity-90 shadow-[0_8px_30px_-8px_hsl(260_30%_60%/0.15)] hover:shadow-[0_12px_40px_-12px_hsl(260_30%_50%/0.2)]",
        glass: "bg-card/80 backdrop-blur-lg border border-primary/20 text-foreground hover:bg-card/90 shadow-[0_4px_20px_-4px_hsl(260_30%_70%/0.2)]",
        soft: "bg-muted text-muted-foreground hover:bg-muted/80",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4",
        lg: "h-14 rounded-2xl px-8 text-base",
        xl: "h-16 rounded-2xl px-10 text-lg",
        icon: "h-12 w-12",
        "icon-sm": "h-10 w-10",
        "icon-lg": "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
