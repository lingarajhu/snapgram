import BottomBar from "@/components/shared/BottomBar";
import LeftSideBar from "@/components/shared/LeftSideBar";
import TopBar from "@/components/shared/TopBar";
import RightSideBar from "@/components/shared/RightSideBar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <TopBar />
      <LeftSideBar />

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      <RightSideBar />
      <BottomBar />
    </div>
  );
};

export default RootLayout;
