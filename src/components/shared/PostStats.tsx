import { checkIsLiked } from "@/lib/utils";
import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/library/react-query/queriesAndMutation";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likeList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState<string[]>(likeList);

  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost, isPending: isLikingPost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingPost } =
    useDeleteSavedPost();
  const { data: currentUser } = useGetCurrentUser();

  const savePostRecord = currentUser?.save?.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    setIsSaved(!!savePostRecord);
  }, [currentUser]);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    let newLikes = [...likes];

    const hasLiked = newLikes.includes(userId);

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
      setLikes(newLikes);
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);
    likePost({ postId: post.$id, likesArray: newLikes });
  };

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savePostRecord) {
      setIsSaved(false);
      deleteSavedPost(savePostRecord.$id);
    } else {
      savePost({ postId: post.$id, userId });
      setIsSaved(true);
    }
  };

  return (
    <div className="flex items-center justify-between z-20">
      <div className="flex gap-2 mr-5">
        {isLikingPost ? (
          <Loader />
        ) : (
          <img
            src={
              checkIsLiked(likes, userId)
                ? "/assets/icons/liked.svg"
                : "/assets/icons/like.svg"
            }
            alt="like symbole"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={handleLikePost}
          />
        )}
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2">
        {isSavingPost || isDeletingPost ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="like symbole"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={handleSavePost}
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
