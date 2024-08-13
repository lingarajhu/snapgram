import ProfileEditForm from "@/components/forms/ProfileEditForm";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";

const UpdateProfile = () => {
  const { user } = useUserContext();

  if (!user) {
    return (
      <div className="flex flex-1 justify-center items-center w-full">
        <Loader />
      </div>
    );
  }

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
