import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useGetUsers } from "@/library/react-query/queriesAndMutation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const AllUsers = () => {
  const { data: users, fetchNextPage, hasNextPage } = useGetUsers();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  if (!users) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="user-container">
      <div className="flex flex-start gap-4">
        <img src="/assets/icons/people.svg" alt="people" />
        <h3 className="h3-bold md:h2-bold w-full">All Users</h3>
      </div>
      <div className="w-full overflow-scroll custom-scrollbar">
        {users?.pages &&
          users?.pages.map((user, index) => {
            return <UserCard users={user?.documents} key={`users-${index}`} />;
          })}
        {hasNextPage && (
          <div ref={ref} className="mt-8 flex-center">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
