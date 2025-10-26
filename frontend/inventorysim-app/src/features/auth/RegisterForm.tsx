import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Link, useNavigate } from "react-router-dom"
import Positions from "./ui/Positions"
import SocialBtns from "./ui/SocialBtns"
import Divider from "./ui/Divider"
import {  useAuth } from "@/hooks/useAuth"
import FormError from "./ui/FormError"
import { Controller } from "react-hook-form"
import toast from "react-hot-toast";
import Top from "./ui/Top"

const RegisterForm = () => {
  const navigate = useNavigate();
   const { RegisterFormValidation, handleRegister, loading, error} = useAuth();

  const onSubmit = RegisterFormValidation.handleSubmit(async (data) => {
    console.log(" Valid form data:", data);
    const response = await handleRegister(data);
    console.log("Response "+response);
    
    if (response?.success) {
    toast.success("Registration successful! Redirecting to login...");
    setTimeout(() => navigate("/login"), 2000);
    } else {
      toast.error("Registration failed. Please try again.");
    }
   
  });

  return (
    <>
   <div className="p-6">
      {/* Header */}
      <Top text="Create your account" />

      {/* Form */}
      <form onSubmit={onSubmit} className="mt-10 mx-auto w-full max-w-md" >
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-xl">Join RetailOps</CardTitle>
            <CardDescription>Fill in your details to get started</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="fullname" className="block text-left">Full Name</Label>
              <Input
                id="fullname"
                type="text"
                 {...RegisterFormValidation.register("fullname")}
                placeholder="Dexter Newte"
                required
              />
              {RegisterFormValidation.formState.errors.fullname && (
                <FormError message={RegisterFormValidation.formState.errors.fullname.message ?? "Invalid name"} />
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-left">Email address</Label>
              <Input
                id="email"
                type="email"
                {...RegisterFormValidation.register("email")}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              {RegisterFormValidation.formState.errors.email && (
                <FormError message={RegisterFormValidation.formState.errors.email.message ?? "Invalid email"} />
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="block text-left">Password</Label>
              <Input
                id="password"
                type="password"
                {...RegisterFormValidation.register("password")}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
              {RegisterFormValidation.formState.errors.password && (
                <FormError message={RegisterFormValidation.formState.errors.password.message ?? "Invalid password"} />
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="block text-left">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                {...RegisterFormValidation.register("confirmPassword")}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
              {RegisterFormValidation.formState.errors.confirmPassword && (
                <FormError message={RegisterFormValidation.formState.errors.confirmPassword.message?.toString() ?? "Passwords do not match"} />
              )}
            </div>
            {/* Insert position */}
            <div className="flex items-center gap-2">
            <Label htmlFor="position" className="text-sm font-medium text-left">
                Position:
            </Label>
            <Controller
              name="position"
              control={RegisterFormValidation.control}
              rules={{ required: "Position is required" }}
              render={({ field }) => (
                <Positions position={field.value} setPosition={field.onChange} />
              )}
            />

            </div>
            {/* Show form error if any */}
            {error && <FormError message={error} />}
            {/* Register Button */}
            <Button
              type="submit"
              className="w-full bg-indigo-500 text-white hover:bg-indigo-600"
              style={{backgroundColor: '#4F46E5', color: 'white'}}
            >
                {loading ? "Registering..." : "Create Account"}
            </Button>

            {/* Divider */}
            <Divider text="Or continue with" />

            {/* Social buttons */}
            <SocialBtns />
          </CardContent>

          <CardFooter>
            <p className="mx-auto text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-500 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </div>
   </>
  )
}

export default RegisterForm
