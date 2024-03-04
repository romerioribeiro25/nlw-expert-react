import { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: "font-medium hover:underline",
  variants: {
    color: {
      primary: "text-lime-400",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

type ButtonVariantProps = VariantProps<typeof button>;

interface ButtonProps
  extends Omit<ComponentProps<"button">, "color">,
    ButtonVariantProps {}

export function Button({ color, className, ...props }: ButtonProps) {
  return (
    <button className={button({ color, className })}>{props.children}</button>
  );
}
