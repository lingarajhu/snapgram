import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserProfile } from "@/library/react-query/queriesAndMutation";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { data: currentUser } = useGetUserProfile(id || "");
  const navigate = useNavigate();
  const [showPosts, setShowPosts] = useState<boolean>(true);

  useEffect(() => {
    // console.log(user?.imageUrl);
  }, [user?.imageUrl]);

  if (!currentUser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="w-44 h-full flex lg:items-start items-center lg:justify-start justify-center">
          <img
            src={currentUser?.imageUrl}
            alt="profile-picture"
            className="md:w-32 md:h-32 w-20 h-20 rounded-full object-cover object-top"
          />
        </div>
        <div className="flex flex-col gap-3 w-full">
          <div className="flex sm:flex-row lg:items-start lg:justify-start items-center justify-center flex-col sm:gap-24 gap-4">
            <h2 className="h3-bold md:h2-bold text-left">
              {currentUser?.name}
            </h2>
            {/* for large screen edit profile button */}
            {!(user.id !== currentUser?.$id) && (
              <Link
                className="lg:block hidden"
                to={`/update-profile/${currentUser?.$id}`}
              >
                <Button className="shad-button_dark_4 flex flex-row gap-1 ">
                  <img
                    src="/assets/icons/editV2.svg"
                    alt="edit"
                    width={20}
                    height={20}
                  />
                  Edit Profile
                </Button>
              </Link>
            )}
          </div>
          <h3 className="text-light-3 text-center lg:text-start">
            @{currentUser?.username}
          </h3>
          <div className="flex flex-row md:gap-6 gap-5 lg:items-start lg:justify-start justify-center items-center">
            <span className="flex md:flex-row md:gap-2 flex-col items-center justify-center">
              <span className="text-primary-600">
                {currentUser?.posts.length}
              </span>{" "}
              Posts
            </span>
            <span className="flex md:flex-row md:gap-2 flex-col items-center justify-center">
              <span className="text-primary-600">
                {Math.floor(Math.random() * 100 + 10)}k
              </span>{" "}
              Followers
            </span>
            <span className="flex md:flex-row md:gap-2 flex-col items-center justify-center">
              <span className="text-primary-600">
                {Math.floor(Math.random() * 100 + 10)}
              </span>{" "}
              Following
            </span>
          </div>
          <p className="max-w-lg text-justify">{currentUser?.bio}</p>
          {!(user.id === currentUser?.$id) && (
            <div className="flex flex-row md:gap-8 gap-6 items-center justify-center lg:items-start lg:justify-start w-full">
              <Button className="shad-button_primary">Follow</Button>
              <Button className="shad-button_dark_4">Message</Button>
            </div>
          )}
          {/* for medium screen edit profile button */}
          <Link
            className={`lg:hidden flex justify-center ${
              user.id !== currentUser?.$id && "hidden"
            }`}
            to={`/update-profile/${currentUser?.$id}`}
          >
            <Button className="shad-button_dark_4 flex flex-row gap-1 ">
              <img
                src="/assets/icons/editV2.svg"
                alt="edit"
                width={20}
                height={20}
              />
              Edit Profile
            </Button>
          </Link>
          <div className="flex-between max-w-5xl px-1 w-full mt-10 mb-2">
            <div className="flex justify-center items-center">
              <Button
                onClick={() => setShowPosts(true)}
                className={`h-10 bg-dark-4 px-4 text-light-1 flex gap-2 rounded-r-none ${
                  !showPosts && "bg-dark-3"
                }`}
              >
                Posts
              </Button>
              <Button
                onClick={() => setShowPosts(false)}
                className={`h-10 bg-dark-4 px-4 text-light-1 flex gap-2 rounded-l-none ${
                  showPosts && "bg-dark-3"
                }`}
              >
                Saved
              </Button>
            </div>
            <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
              <p className="small-medium md:base-medium text-light-2">All</p>
              <img
                src="/assets/icons/filter.svg"
                alt="filter"
                width={20}
                height={20}
              />
            </div>
          </div>
          {showPosts ? (
            <>
              {currentUser?.posts.length === 0 ? (
                <div className="max-w-5xl h-80 rounded-lg bg-dark-3 flex items-center justify-center flex-col">
                  <img
                    src="/assets/icons/posts.svg"
                    alt="posts"
                    className="md:w-20 md:h-20 w-14 h-14"
                  />
                  <p className="h3-bold md:h2-bold text-light-3">
                    No posts yet
                  </p>
                  <p
                    onClick={() => navigate("/create-post")}
                    className="text-primary-500 cursor-pointer hover:underline"
                  >
                    Create Post?...
                  </p>
                </div>
              ) : (
                <ul className="grid-container">
                  {currentUser?.posts?.map((post: Models.Document) => {
                    return (
                      <li className="relative min-w-64 h-64" key={post?.$id}>
                        <Link
                          to={`/post/${post.$id}`}
                          className="grid-post_link"
                        >
                          <img
                            src={post.imageUrl}
                            alt="post"
                            className="h-full w-full object-cover"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          ) : (
            <>
              <ul className="grid-container">
                <>
                  {currentUser?.save.length === 0 ? (
                    <div className="lg:w-[740px] lg:h-[500px] w-[257px] h-72 rounded-lg bg-dark-2 flex items-center justify-center flex-col">
                      <img
                        src="/assets/icons/posts.svg"
                        alt="posts"
                        className="md:w-20 md:h-20 w-14 h-14"
                      />
                      <p className="h3-bold md:h2-bold text-light-3">
                        No Saved posts yet
                      </p>
                    </div>
                  ) : (
                    currentUser?.save.map(
                      (item: Models.Document, index: number) => (
                        <li
                          className="relative min-w-64 h-64"
                          key={`saved-${index}`}
                        >
                          <div className="grid-post_link">
                            <img
                              src={item?.post?.imageUrl}
                              alt="saved_post"
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                        </li>
                      )
                    )
                  )}
                </>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
