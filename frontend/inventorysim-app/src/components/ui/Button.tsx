import { Button as RadixButton } from "@radix-ui/themes";
import type { ButtonProps } from "@radix-ui/themes";

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <RadixButton
      {...props}
      className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700${className ? ` ${className}` : ""}`}
    >
      {children}
    </RadixButton>
  );
};