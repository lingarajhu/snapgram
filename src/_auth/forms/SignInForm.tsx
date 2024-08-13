import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

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
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { signInValidation } from "@/library/validation";
import { useSignInAccount } from "@/library/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";

const SignUpForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, user } = useUserContext();

  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signInValidation>>({
    resolver: zodResolver(signInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInValidation>) {
    const session = await signInAccount(values);
    if (!session) {
      toast({
        variant: "destructive",
        description: "Opps!, Sign In falied",
      });

      return;
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      toast({ title: `Welcome back ${user.name} 🥳` });
      navigate("/");
    } else {
      return toast({ title: "signUp failed, Please try again" });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2:bold pt-5 sm:pt-12">
          Log In to your account
        </h2>

        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back ! Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-2 mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
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
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary mt-2">
            {isSigningIn ? (
              <div className="flex-center gap-2">
                <Loader />
                Loading...
              </div>
            ) : (
              "Log In"
            )}
          </Button>
        </form>
        <p className="text-small-regular text-light-2 text-center mt-2">
          Don't have an account?
          <Link
            className="text-primary-500 text-small-semibold ml-1"
            to="/sign-up"
          >
            Sign up
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default SignUpForm;
