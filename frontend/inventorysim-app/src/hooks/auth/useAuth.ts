import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import authService, { type Credentials } from "@/services/auth/authService";
import type { Account } from "@/types/accounts";
import { useProductStore } from "@/store/inventory/useProductStore";
import { saveToStorage } from "@/utils/storage";
import { useUserStore } from "@/store/user/useUserStore";

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


  // Define forgot password schema
export const forgotPasswordShape = z.object({
  email: z.string().email("Invalid email address"),
});

// Hook
export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setAuthenticated = useProductStore((s) => s.setAuthenticated);

    /** Automatically check token on mount */
    useEffect(() => {
      const token = saveToStorage.getItem("token");
      const isValid = !!token && token !== "" && token !== null;
      setAuthenticated(isValid);
    }, []);

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
      console.log("Registering user:", data);
      const account: Account = {
        fullname: data.fullname,
        email: data.email,
        password: data.password,
        role: data.role,
        position: data.position,
      };

      const response = await authService.register(account);

      // Assume success if the API returned a 201 or 200 status, or if response.data exists
      const success =
        response?.status === 200 ||
        response?.status === 201 ||
        response?.data 

      console.log("success "+success);

      if (success) {
        return { success: true, data: response?.data || null };
      } else {
        setError("Registration failed. Please try again.");
        return { success: false };
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
      return { success: false };
    } finally {
      setLoading(false);
      // Reset form
      RegisterFormValidation.reset();
    }
  };
   
  //Handle login
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
        const {token, id, email, username, name, role, position} = response;
        const user = {id, email, username, name, role, position}

        authService.saveAuthData(token, user);

         // Store reactively in Zustand
         useUserStore.getState().setUser(user);

          // Mark authenticated
          useProductStore.getState().setAuthenticated(true);
        console.log("Logging in user (mock):", response);
        
        setLoading(false);
        return response;

      }catch(err:any){
        setError("Login failed. Please try again." + err.message);
        setLoading(false);
        return null;
      }
    };

    const handleLoginWithGoogle = async () => {
      try {
        setLoading(true);
        setError(null);
        authService.loginWithGoogle();
      } catch (err) {
        setError("Google login failed");
      } finally {
        setLoading(false);
      }
    };

    const handleLoginWithGithub = async () => {
      try {
        setLoading(true);
        setError(null);
        authService.loginWithGitHub();
      } catch (err) {
        setError("GitHub login failed");
      } finally {
        setLoading(false);
      }
    };
    
    //Handle logout
    const handleLogout = () =>{
      authService.logout();
    }
    
    // Define forgot password form
    const forgotPasswordForm = useForm({
      resolver: zodResolver(forgotPasswordShape),
      defaultValues: {
        email: "",
      },
      mode: "onBlur",
    });

    const handleForgotPassword = async (
      data: z.infer<typeof forgotPasswordShape>
    ) => {
      setLoading(true);
      setError(null);

      try {
        console.log("Forgot password request for:", data.email);

        // Later: authService.forgotPassword(data.email)
        // For now: simulate success
        await new Promise((resolve) => setTimeout(resolve, 800));

        return { success: true };
      } catch (err) {
        console.error("Forgot password error:", err);
        setError("Failed to send reset link. Please try again.");
        return { success: false };
      } finally {
        setLoading(false);
        forgotPasswordForm.reset();
      }
    };

  return { 
    RegisterFormValidation,
    handleRegister,
    loading,
    error,
    loginFormValidation,
    handleLogin,
    handleLoginWithGoogle,
    handleLoginWithGithub,
    handleLogout,
    forgotPasswordForm,
    handleForgotPassword
  };
};