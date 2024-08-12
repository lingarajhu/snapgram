import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchedPostProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.Document[];
};

const SearchResults = ({
  isSearchFetching,
  searchedPosts,
}: SearchedPostProps) => {
  if (isSearchFetching)
    return (
      <div className="flex flex-1 justify-center w-full">
        <Loader />
      </div>
    );

  if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  }
  return <p className="text-light-4 mt-10 text-center w-full">SearchResults</p>;
};

export default SearchResults;
