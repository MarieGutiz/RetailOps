import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
    />
  );
});

Input.displayName = "Input";

export default Input;
