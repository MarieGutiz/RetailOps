import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Link } from "react-router-dom"
import Positions from "./ui/Positions"
import SocialBtns from "./ui/SocialBtns"
import Divider from "./ui/Divider"

const RegisterForm = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mx-auto w-full max-w-md">
        <img
          src="src/assets/range.jpg"
          alt="RetailOps"
          className="mx-auto h-12 w-auto"
        />
        <h2 className="mt-8 text-center text-3xl font-bold tracking-tight text-blue-950">
          Create your account
        </h2>
      </div>

      {/* Form */}
      <div className="mt-10 mx-auto w-full max-w-md">
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-xl">Join RetailOps</CardTitle>
            <CardDescription>Fill in your details to get started</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="block text-left">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-left">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="block text-left">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="block text-left">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            {/* Insert position */}
            <div className="flex items-center gap-2">
            <Label htmlFor="position" className="text-sm font-medium text-left">
                Position:
            </Label>
            <Positions />
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              className="w-full bg-indigo-500 text-white hover:bg-indigo-600"
              style={{backgroundColor: '#4F46E5', color: 'white'}}
            >
              Create Account
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
      </div>
    </div>
  )
}

export default RegisterForm
