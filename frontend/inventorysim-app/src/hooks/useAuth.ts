import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import authService, { type Credentials } from "@/services/auth/authService";
import type { Account } from "@/types/accounts";
import { saveToStorage } from "@/utils/storage";

// Define registration schema
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


  //Define the login schema
const loginShape = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

// Hook
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
    mode: "onBlur",
  });

  // Handle registration 
  const handleRegister = async (data: z.infer<typeof registerShape>) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Registering user (mock):", data);
      const account: Account = {
        fullname: data.fullname,
        email: data.email,
        password: data.password,
        role: data.role,
        position: data.position,
      };

      // Here you would normally call your auth service
      await authService.register(account);

      // Reset form
      RegisterFormValidation.reset();
      setLoading(false);
      

    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loginFormValidation = useForm({
    resolver: zodResolver(loginShape),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const handleLogin = async (data: z.infer<typeof loginShape>) =>{
    setLoading(true);
    setError(null);
    try{
      const credentials: Credentials = {
        identifier: data.email,
        password: data.password
      };
      const response = await authService.login(credentials);
      const {token, id, email, username, name, role} = response;


      saveToStorage.setItem("token", token);
      saveToStorage.setItem("user",JSON.stringify({id, email, username, name, role}));
      console.log("Logging in user (mock):", response);
      
      setLoading(false);
      return response;

    }catch(err:any){
      setError("Login failed. Please try again." + err.message);
      setLoading(false);
      return null;
    }
  }


  return { RegisterFormValidation, handleRegister, loading, error, loginFormValidation, handleLogin };
};