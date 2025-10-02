import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

const LoginForm = () => {
  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50">
      {/* Header */}
      <div className="mx-auto w-full max-w-md">
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
      <div className="mt-10 mx-auto w-full max-w-md">
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-xl">Welcome to RetailOps</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" style={{ textAlign: "left" }}>Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
              />
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
                required
              />
            </div>

            {/* Sign in */}
            <Button type="submit" className="w-full" style={{backgroundColor: '#4F46E5', color: 'white'}}>
              Sign in
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-300"></div>
              <span className="text-gray-500 text-xs">Or continue with</span>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 text-black-700 hover:bg-gray-100"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="h-4 w-4"
                />
                Google
              </Button>

              <Button
                type="button"
                className="flex items-center gap-2 bg-gray-800 text-black-700 hover:bg-gray-700"
              >
                <img
                  src="https://www.svgrepo.com/show/349375/github.svg"
                  alt="GitHub"
                  className="h-4 w-4"
                />
                GitHub
              </Button>
            </div>
          </CardContent>

          <CardFooter>
            <p className="mx-auto text-sm text-gray-500">
              Not with us?{" "}
              <a
                href="#"
                className="font-semibold text-indigo-500 hover:underline"
              >
                Start now
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default LoginForm
