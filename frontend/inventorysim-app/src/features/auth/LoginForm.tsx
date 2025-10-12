import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Link, useNavigate } from "react-router-dom"
import SocialBtns from "./ui/SocialBtns"
import Divider from "./ui/Divider"
import { useAuth } from "@/hooks/useAuth"
import FormError from "./ui/FormError"

const LoginForm = () => {
  const navigate = useNavigate();
  const {loginFormValidation, handleLogin, loading, error} = useAuth();


  const onSubmit = loginFormValidation.handleSubmit(async (data) => {
    console.log("Valid form data:", data);
    const response = await handleLogin(data);
   
    if (response) {
      console.log("Login successful:", response);
      //navigate(`/profile/${response.id}`);
      navigate(`/profile/user=${response.id}`);

    }
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mx-auto w-full max-w-md ">
        <img
          src="src/assets/range.jpg"
          alt="RetailOps"
          className="mx-auto h-12 w-auto"
        />
        <h2 className="mt-8 text-center text-3xl font-bold tracking-tight text-blue-950">
          Sign in to your account
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="mt-10 mx-auto w-full max-w-md">
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-xl">Welcome to RetailOps</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-left">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                {...loginFormValidation.register("email")}
              />
              {loginFormValidation.formState.errors.email && (
                <FormError message={loginFormValidation.formState.errors.email.message?.toString() ?? "Invalid email address"} />
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-sm font-medium text-indigo-500 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                {...loginFormValidation.register("password")}
              />
               {loginFormValidation.formState.errors.password && (
                <FormError message={loginFormValidation.formState.errors.password.message?.toString() ?? "Invalid password"} />
              )}
            </div>
            {error && <FormError message={error} />}
            {/* Sign in */}
            <Button type="submit" 
            className="w-full" style={{backgroundColor: '#4F46E5', color: 'white'}}>
               {loading ? "Logging in..." : "Sign in"}
            </Button>

            {/* Divider */}
           <Divider text="Or continue with" />

            {/* Social buttons */}
            <SocialBtns />
          </CardContent>

          <CardFooter>
            <p className="mx-auto text-sm text-gray-500">
              Not with us?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-500 hover:underline"
              >
                Start now
              </Link>
            </p>
          </CardFooter>
        </Card>
    </form>
    </div>
  )
}

export default LoginForm
