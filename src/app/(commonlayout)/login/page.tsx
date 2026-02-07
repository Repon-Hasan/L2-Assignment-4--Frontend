"use client"; // ✅ MUST be first line

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { loginUser } from "@/services";
import { useUser } from "@/components/provider/UserProvider";
import { loginSchema } from "@/components/loginSchema";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirectPath");
  const router = useRouter();
  const { refreshUser } = useUser();

  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { formState: { isSubmitting } } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await loginUser(data);

      if (res?.token) {
        localStorage.setItem("authToken", res.token);

        if (res.user.status === "BANNED") {
          toast.error("Your account has been banned. Please contact support.");
          return;
        }

        toast.success("Logged in successfully 🎉");

        await refreshUser();

        router.push(redirect || "/");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const demoCredentials = {
    admin: { email: "admin@gmail.com", password: "admin123" },
    user: { email: "user@gmail.com", password: "admin123" },
  };

  return (
    <div className="max-w-md w-full border-2 rounded-xl mx-auto my-6 p-5">
      <div className="flex items-center mb-3 gap-2">
        <div>
          <h1 className="text-lg font-semibold">Login</h1>
          <small className="text-gray-600">Join us today and start your journey</small>
        </div>
      </div>

      <div className="flex items-center my-5 justify-around">
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            form.setValue("email", demoCredentials.admin.email);
            form.setValue("password", demoCredentials.admin.password);
          }}
        >
          Demo Admin
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            form.setValue("email", demoCredentials.user.email);
            form.setValue("password", demoCredentials.user.password);
          }}
        >
          Demo User
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} placeholder="Enter your email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Enter password" value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit">
            {isSubmitting ? "Logging..." : "Login"}
          </Button>

          <div className="flex justify-center">
            <small className="text-gray-600">
              Don&apos;t have an account? <Link href="/register" className="text-primary">Register</Link>
            </small>
          </div>

          <div className="flex justify-center mt-2">
            <Link href="/">
              <Button variant="default" className="w-full">Back To Home</Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
