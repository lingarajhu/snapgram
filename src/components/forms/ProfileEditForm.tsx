import { IUser } from "@/library/types";
import { UpdateProfileValidation } from "@/library/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Textarea } from "../ui/textarea";
import ProfilePhotoUploader from "../shared/ProfilePhotoUploader";
import { useUpdateUser } from "@/library/react-query/queriesAndMutation";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../shared/Loader";

type ProfileEditFormProps = {
  currentUser: IUser;
};

const ProfileEditForm = ({ currentUser }: ProfileEditFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { mutateAsync: updateUser, isPending: isUpdatingProfile } =
    useUpdateUser();

  const form = useForm<z.infer<typeof UpdateProfileValidation>>({
    resolver: zodResolver(UpdateProfileValidation),
    defaultValues: {
      file: [],
      name: currentUser.name,
      username: currentUser.username,
      email: currentUser.email,
      bio: currentUser.bio,
    },
  });

  async function onSubmit(values: z.infer<typeof UpdateProfileValidation>) {
    const updatedProfile = await updateUser({
      ...values,
      userId: currentUser.id,
      imageUrl: currentUser.imageUrl,
    });

    if (!updatedProfile) {
      toast({ title: "Please try again" });
    }

    return navigate(`/profile/${currentUser.id}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-5xl gap-8"
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ProfilePhotoUploader
                  fieldChange={field.onChange}
                  mediaUrl={currentUser?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_lable ">Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={currentUser.name}
                  className="shad-input placeholder:text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_lable">Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={currentUser.username}
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_lable">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={currentUser.email}
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_lable">Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={currentUser.bio}
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <Button
          className="shad-button_primary whitespace-nowrap"
          type="submit"
          disabled={isUpdatingProfile}
        >
          {isUpdatingProfile ? (
            <div className="flex-center gap-2">
              <Loader />
              Loading...
            </div>
          ) : (
            <div>Update Profile</div>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileEditForm;
