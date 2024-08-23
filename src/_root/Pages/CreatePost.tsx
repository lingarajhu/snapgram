import PostForm from "@/components/forms/PostForm";
import { useUserContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const CreatePost = () => {
  const { user } = useUserContext();

  useEffect(() => {
    if (!user) {
      <Navigate to={"/sign-in"} />;
    }
  }, [user]);

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl w-full flex-start gap-3 justify-start">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>
        <PostForm action="Create" />
      </div>
    </div>
  );
};

export default CreatePost;
