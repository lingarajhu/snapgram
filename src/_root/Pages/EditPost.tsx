import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/library/react-query/queriesAndMutation";
import { useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();

  const { data: post, isPending } = useGetPostById(id || "");
  if (isPending)
    return (
      <div className="flex flex-1 justify-center mt-5">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl w-full flex-start gap-3 justify-start">
          <img src="/assets/icons/edit.svg" width={36} height={36} alt="add" />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>
        <PostForm action="Update" post={post} />
      </div>
    </div>
  );
};

export default EditPost;
