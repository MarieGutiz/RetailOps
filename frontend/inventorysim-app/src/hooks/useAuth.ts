import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { Account } from "@/types/accounts";
import authService from "@/services/auth/authService";

export const registerShape = z
  .object({
    fullname: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    role: z.string().default("USER"),
    position: z.string().min(2, "Position must be at least 2 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const RegisterFormValidation = useForm({
    resolver: zodResolver(registerShape),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "USER",
      position: "Student",
    },
  });

  const handleRegister = async (data: z.infer<typeof registerShape>) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Registering user:", data);

      const account: Account = {
        fullname: data.fullname,
        email: data.email,
        password: data.password,
        role: data.role,
        position: data.position,
      };

      await authService.register(account);
      RegisterFormValidation.reset();
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { RegisterFormValidation, handleRegister, loading, error };
};