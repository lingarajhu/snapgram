import { Models } from "appwrite";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

type TopCreatorsProps = {
  users: Models.Document[];
};

const TopCreators = ({ users }: TopCreatorsProps) => {
  return (
    <div className="top_creators-grid mt-8">
      {users &&
        users?.map((user: Models.Document, index: number) => (
          <div className="user-card" key={`user-${index}`}>
            <Link
              className="flex flex-col gap-2 items-center"
              to={`/profile/${user.$id}`}
            >
              <img
                src={user?.imageId ? user?.imageId : user?.imageUrl}
                alt="user-Image"
                className="w-14 h-14 rounded-full"
              />
              <h3 className="font-bold text-2xl">{user?.name}</h3>
            </Link>
            <p className="text-light-4">@{user?.username}</p>
            <Button className="shad-button_primary whitespace-nowrap">
              Follow
            </Button>
          </div>
        ))}
    </div>
  );
};

export default TopCreators;
