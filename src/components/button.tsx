import { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: "font-medium outline-none transition duration-300",
  variants: {
    color: {
      transparent: "text-lime-400 hover:underline",
      lime: "bg-lime-500 text-white hover:bg-lime-700",
    },
    size: {
      sm: "py-4 text-sm",
    },
  },
  defaultVariants: {
    color: "transparent",
  },
});

type ButtonVariantProps = VariantProps<typeof button>;

interface ButtonProps
  extends Omit<ComponentProps<"button">, "color">,
    ButtonVariantProps {}

export function Button({ color, size, className, ...props }: ButtonProps) {
  return (
    <button className={button({ color, size, className })} {...props}>
      {props.children}
    </button>
  );
}
