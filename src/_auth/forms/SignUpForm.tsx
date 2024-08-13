import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { z } from "zod";
import { signUpValidation } from "@/library/validation";
import Loader from "@/components/shared/Loader";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/library/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const { toast } = useToast();

  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();

  const { mutateAsync: signInAccount } = useSignInAccount();

  const { checkAuthUser } = useUserContext();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpValidation>) {
    const newUser = await createUserAccount(values);

    if (!newUser) {
      toast({
        variant: "destructive",
        description: "Opps!, Something went wrong",
      });
      return;
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        variant: "destructive",
        title: "Opps!, Sign In falied",
      });
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      toast({ title: "Account created successfully 🥳" });
      navigate("/");
    } else {
      toast({ title: "signUp failed, Please try again" });
      return;
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2:bold pt-5 sm:pt-12">
          Create a new account
        </h2>

        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use Snapgram, Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-2 mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
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
            {isCreatingAccount ? (
              <div className="flex-center gap-2">
                <Loader />
                Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
        <p className="text-small-regular text-light-2 text-center mt-2">
          Already have an account?
          <Link
            className="text-primary-500 text-small-semibold ml-1"
            to="/sign-in"
          >
            Log In
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default SignUpForm;
