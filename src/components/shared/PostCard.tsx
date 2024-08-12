import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
  posts: Models.Document[];
};

const PostCard = ({ posts }: PostCardProps) => {
  const { user } = useUserContext();

  if (!posts) return;

  return (
    <div className="post-card">
      <ul className="flex flex-col gap-6">
        {posts.map((post) => {
          return (
            <li
              key={`post-${post.$id}`}
              className="bg-dark-3/80 border border-dark-4 rounded-xl p-3 lg:p-6"
            >
              <div className="flex-between ">
                <div className="flex items-center gap-3">
                  <Link to={`/profile/${post.creator.$id}`}>
                    <img
                      src={post?.creator?.imageUrl}
                      alt="creator"
                      className="rounded-full w-11 lg:h-11"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <p className="base-medium lg:body-bold text-light-1">
                      {post?.creator?.name}
                    </p>
                    <div className="flex-center text-light-3 gap-3">
                      <p className="subtle-semibold lg:small-regular ">
                        {multiFormatDateString(post?.$createdAt)}
                      </p>
                      -
                      <p className="subtle-semibold lg:small-regular">
                        {post.location}
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/update-post/${post.$id}`}
                  className={`${user?.id !== post?.creator.$id && "hidden"}`}
                >
                  <img
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width={20}
                    height={20}
                  />
                </Link>
              </div>
              <Link to={`/posts/${post.$id}`}>
                <div className="small-medium lg:base-medium py-5">
                  <p>{post?.caption}</p>
                  <ul className="flex gap-1 mt-2">
                    {post?.tags.map((tag: string) => {
                      return (
                        <li className="text-light-3" key={tag}>
                          #{tag}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <img
                  src={
                    post?.imageUrl || "/assets/icons/profile-placeholder.svg"
                  }
                  className="post-card_img"
                  alt="post image"
                />
              </Link>
              <PostStats post={post} userId={user.id} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PostCard;
