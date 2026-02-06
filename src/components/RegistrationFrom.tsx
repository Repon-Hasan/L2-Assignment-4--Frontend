"use client";
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
import { registerUser } from "@/services";
import { registerSchema } from "./registerSchema";

const RegistrationFrom = () => {
  const seachParams = useSearchParams();
  const redirect = seachParams.get("redirectPath");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await registerUser(data);
      console.log(res);

      // ✅ SUCCESS HANDLING (ADDED)
      if (res) {
        toast.success("Registration successful 🎉");
        router.push(redirect || "/");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-md w-full border-2 rounded-xl m-4 p-5">
      <div className="flex items-center mb-3 gap-2">
        <div>
          <h1 className="text-lg font-semibold">Registration</h1>
          <small className="text-gray-600">
            Join us today and start your journey
          </small>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    value={field.value || ""}
                  />
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
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="SELLER">Seller</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full mb-3 cursor-pointer" type="submit">
            {isSubmitting ? "Register..." : "Register"}
          </Button>

          <div className="flex items-center justify-center">
            <small className="text-gray-600">
              You have any account?{" "}
              <Link href="/login" className="text-primary">
                login
              </Link>
            </small>
          </div>

          <div className="flex items-center justify-center">
            <Link href="/">
              <Button variant="default" className="w-full cursor-pointer">
                Back To Home
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationFrom;
