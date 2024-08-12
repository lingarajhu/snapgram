import ProfileEditForm from "@/components/forms/ProfileEditForm";
import { useUserContext } from "@/context/AuthContext";

const UpdateProfile = () => {
  const { user } = useUserContext();
  console.log(user);

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl w-full flex-start gap-3 justify-start">
          <img src="/assets/icons/edit.svg" width={36} height={36} alt="add" />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>
        <ProfileEditForm currentUser={user} />
      </div>
    </div>
  );
};

export default UpdateProfile;
