import Top from "./ui/Top";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import FormError from "./ui/FormError";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";

const ForgotPassword = () => {
  const {loading, error, forgotPasswordForm, handleForgotPassword} = useAuth();

  return (
  <div className="p-6">
    {/* Header */}
    <Top text="Reset your password" />

    {/* Form */}
    <form className="mt-10 mx-auto w-full max-w-md">
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-xl">Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email and we’ll send you a reset link
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="block text-left">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              {...forgotPasswordForm.register("email")}
            />
            {forgotPasswordForm.formState.errors.email && (
              <FormError
                message={
                  forgotPasswordForm.formState.errors.email.message?.toString() ??
                  "Invalid email address"
                }
              />
            )}
          </div>

          {error && <FormError message={error} />}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            style={{ backgroundColor: "#4F46E5", color: "white" }}
          >
            {loading ? "Sending link..." : "Send reset link"}
          </Button>
        </CardContent>

        <CardFooter>
          <p className="mx-auto text-sm text-gray-500">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-500 hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  </div>
);

}

export default ForgotPassword