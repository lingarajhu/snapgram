import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/library/react-query/queriesAndMutation";
import { Models } from "appwrite";

const Saved = () => {
  const { data, isLoading } = useGetCurrentUser();

  if (!data?.save || isLoading) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="saved-container">
      <div className="saved-inner-container">
        <img
          src="/assets/icons/saved.svg"
          alt="Saved post"
          className="md:mt-2 mt-1 md:w-7 md:h-7 w-6 h-6"
        />
        <h3 className="h3-bold md:h2-bold w-full">Saved Posts</h3>
      </div>
      <ul className="saved-grid">
        <>
          {data?.save.length === 0 ? (
            <div className="lg:w-[962px] lg:h-[500px] w-[265px] h-72 rounded-lg bg-dark-2 flex items-center justify-center flex-col">
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
            data?.save.map((item: Models.Document, index: number) => (
              <li
                className="relative md:min-w-80 md:h-80 min-w-64 h-72"
                key={`saved-${index}`}
              >
                <div className="grid-post_link">
                  <img
                    src={item?.post?.imageUrl}
                    alt="saved_post"
                    className="w-full h-full object-cover"
                  />
                </div>
              </li>
            ))
          )}
        </>
      </ul>
    </div>
  );
};

export default Saved;
