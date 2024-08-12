import { useGetTopCreators } from "@/library/react-query/queriesAndMutation";
import TopCreators from "./TopCreators";
import Loader from "./Loader";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const RightSideBar = () => {
  const [screenWidth, setScreenWidth] = useState(false);
  const { data: topCreators, isLoading } = useGetTopCreators();
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.screen.width >= 770) {
      setScreenWidth(true);
    }
  }, []);

  if (!topCreators || isLoading) {
    return (
      <div className="rightsidebar justify-center items-center">
        <Loader />
      </div>
    );
  }

  const inActive = pathname === "/";

  return (
    <div
      style={{ display: inActive && screenWidth ? "flex" : "none" }}
      className="rightsidebar"
    >
      <h2 className="h3-bold md:h3-bold text-left w-full">Top Creators</h2>
      <TopCreators users={topCreators?.documents} />
    </div>
  );
};

export default RightSideBar;
