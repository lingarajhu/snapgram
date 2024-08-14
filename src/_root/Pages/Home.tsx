import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/library/react-query/queriesAndMutation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetRecentPosts();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <div className="flex-between max-w-5xl w-full mb-7">
            <h3 className="h3-bold md:h2-bold w-full">Home Feed</h3>
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
          {!posts ? (
            <>
              <Loader />
            </>
          ) : (
            <>
              <ul className="flex flex-col flex-1 gap-9 w-full">
                {posts?.pages.map((post, index) => (
                  <PostCard posts={post!.documents} key={`post-${index}`} />
                ))}
              </ul>

              {hasNextPage && (
                <div ref={ref} className="mt-10">
                  <Loader />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
