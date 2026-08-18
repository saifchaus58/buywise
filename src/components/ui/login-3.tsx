"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { ShieldCheck, Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { supabase } from "../../supabaseClient";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#2563EB] text-white shadow-xs hover:bg-[#1D4ED8] active:scale-[0.99]",
        destructive:
          "bg-[#DC2626] text-white shadow-xs hover:bg-[#B91C1C]",
        outline:
          "border border-[#E5E7EB] bg-[#FFFFFF] shadow-2xs hover:bg-[#F7F8FA] hover:text-[#0B0F19] text-[#0B0F19]",
        secondary:
          "bg-[#F3F4F6] text-[#0B0F19] hover:bg-[#E5E7EB]",
        ghost:
          "hover:bg-[#F7F8FA] hover:text-[#0B0F19] text-[#5F6673]",
        link: "text-[#2563EB] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-[8px] gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-[10px] px-6 has-[>svg]:px-4 text-sm font-semibold",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      className={cn(
        "bg-[#FFFFFF] text-[#0B0F19] flex flex-col gap-6 rounded-[20px] border border-[#E5E7EB] py-6 shadow-xl",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          "placeholder:text-[#8A919D] border-[#E5E7EB] flex h-10 w-full min-w-0 rounded-[10px] border bg-[#FAFAFA] px-3.5 py-2 text-sm shadow-2xs transition-colors outline-none",
          "focus:border-[#2563EB] focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#2563EB]/15",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-[#0B0F19]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-xs font-semibold text-[#0B0F19] select-none",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {}
export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    data-slot="separator-root"
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "bg-[#E5E7EB] shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
      className
    )}
    {...props}
  />
));
Separator.displayName = "SeparatorPrimitive.Root.displayName";

export const GoogleIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      fill="#EA4335"
      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
    />
    <path
      fill="#4285F4"
      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
    />
    <path
      fill="#FBBC05"
      d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 10.5 0 12s.6 2.8 1.6 4.8l3.7-2.1z"
    />
    <path
      fill="#34A853"
      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
    />
  </svg>
);

export const BuyWiseLogo = () => (
  <div className="w-10 h-10 rounded-[10px] bg-[#0B0F19] flex items-center justify-center text-white shadow-xs">
    <ShieldCheck className="w-5 h-5 text-white" />
  </div>
);

export default function Login06() {
  const {
    authMode,
    openAuthModal,
    closeAuthModal,
    login,
    signup,
    loginWithSocial,
    demoLogin,
  } = useApp();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [resetSent, setResetSent] = React.useState(false);

  const isSignUp = authMode === "signup";
  const isForgot = authMode === "forgot_password";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (isForgot) {
      if (!email.trim() || !email.includes("@")) {
        setErrorMessage("Please enter a valid email address.");
        return;
      }
      setIsLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/`,
        });
        if (error) {
          setErrorMessage(error.message);
        } else {
          setResetSent(true);
        }
      } catch (err: any) {
        setErrorMessage(err?.message || "Failed to send reset link.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setErrorMessage("Please enter your name.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setErrorMessage("Please enter a valid email address.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters.");
        return;
      }
      setIsLoading(true);
      try {
        // 1) Supabase Sign Up
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        // Check if a real session exists
        // If data.session is null, email confirmation is required -> DO NOT redirect
        if (!data?.session) {
          setSuccessMessage("Check your email and confirm your account before logging in.");
          setPassword("");
          return;
        }

        // Only redirect when a real session exists
        const userDisplayName =
          name.trim() ||
          data.user?.user_metadata?.full_name ||
          email.split("@")[0];
        await signup(userDisplayName, email.trim());
        window.history.pushState({}, "", "/");
        closeAuthModal();
      } catch (err: any) {
        setErrorMessage(err?.message || "Failed to create account. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // 2) Supabase Sign In
      if (!email.trim() || !password.trim()) {
        setErrorMessage("Please enter both email and password.");
        return;
      }
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        // 3) Only redirect when a real session exists after login
        if (data?.session && data?.user) {
          const userDisplayName =
            data.user?.user_metadata?.full_name ||
            data.user?.email?.split("@")[0] ||
            email.split("@")[0];
          await login(email.trim(), userDisplayName);
          window.history.pushState({}, "", "/");
          closeAuthModal();
        } else {
          setErrorMessage("Unable to establish session. Please verify your email.");
        }
      } catch (err: any) {
        setErrorMessage(err?.message || "Invalid email or password.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      await loginWithSocial("google");
    } catch {
      setErrorMessage("Failed to authenticate with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm rounded-[20px] px-4 sm:px-6 py-7 shadow-xl border-[#E5E7EB] bg-[#FFFFFF]">
      <CardContent className="px-2 sm:px-4">
        <div className="flex flex-col items-center space-y-5">
          <BuyWiseLogo />

          <div className="space-y-1 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B0F19] tracking-tight">
              {isForgot
                ? "Reset password"
                : isSignUp
                ? "Create your account"
                : "Welcome back"}
            </h1>
            <p className="text-[#5F6673] text-xs">
              {isForgot ? (
                "Enter your email to receive a password reset link"
              ) : isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      openAuthModal("signin");
                      setErrorMessage("");
                    }}
                    className="text-[#2563EB] font-semibold hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  First time here?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      openAuthModal("signup");
                      setErrorMessage("");
                    }}
                    className="text-[#2563EB] font-semibold hover:underline cursor-pointer"
                  >
                    Sign up for free
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-3.5">
            {/* Name Field (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-1">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-[10px]"
                  required
                />
              </div>
            )}

            {/* Email Field (Both) */}
            <div className="space-y-1">
              <Label htmlFor="auth-email">Email Address</Label>
              <Input
                id="auth-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-[10px]"
                required
              />
            </div>

            {/* Password Field (Sign In and Sign Up) */}
            {!isForgot && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auth-password">Password</Label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => {
                        openAuthModal("forgot_password");
                        setErrorMessage("");
                        setResetSent(false);
                      }}
                      className="text-[11px] text-[#2563EB] hover:underline font-medium cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-[10px] pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A919D] hover:text-[#0B0F19] p-1 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 rounded-[8px] bg-[#FEE2E2] border border-[#FECACA] text-[#991B1B] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email Confirmation / Success Message */}
            {successMessage && (
              <div className="p-3 rounded-[8px] bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs flex items-start gap-2.5 leading-relaxed">
                <Check className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Reset Success Message */}
            {isForgot && resetSent && (
              <div className="p-2.5 rounded-[8px] bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Reset link sent to {email}!</span>
              </div>
            )}

            {/* Primary Submit Button */}
            <div className="flex flex-col gap-2 pt-1">
              <Button
                type="submit"
                className="w-full rounded-[10px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold h-10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                ) : isForgot ? (
                  "Send reset link"
                ) : isSignUp ? (
                  "Create free account"
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Demo 1-Click Access */}
              {!isForgot && (
                <Button
                  type="button"
                  variant="link"
                  onClick={demoLogin}
                  className="w-full text-xs text-[#2563EB] font-medium hover:text-[#1D4ED8] flex items-center justify-center gap-1.5 h-auto py-1 cursor-pointer"
                >
                  <span>Instant Demo Access (Pre-loaded Vault)</span>
                </Button>
              )}
            </div>

            {/* OR Divider */}
            {!isForgot && (
              <>
                <div className="flex items-center gap-4 py-1">
                  <Separator className="flex-1" />
                  <span className="text-[11px] font-medium text-[#8A919D]">OR</span>
                  <Separator className="flex-1" />
                </div>

                {/* Google SSO Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full rounded-[10px] border-[#E5E7EB] hover:bg-[#F7F8FA] text-xs font-semibold flex items-center justify-center gap-2 h-10"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>Continue with Google</span>
                </Button>
              </>
            )}
          </form>

          {/* Footer Terms */}
          <p className="text-center text-[11px] text-[#8A919D] leading-tight">
            By continuing, you agree to our{" "}
            <a href="#terms" className="underline hover:text-[#0B0F19]">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#privacy" className="underline hover:text-[#0B0F19]">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
