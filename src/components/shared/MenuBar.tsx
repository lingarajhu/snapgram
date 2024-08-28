import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

type MenuBarProps = {
  signOut: () => void;
  setMenuModel: React.Dispatch<React.SetStateAction<boolean>>;
  menuModel: boolean;
};

const MenuBar: React.FC<MenuBarProps> = ({
  signOut,
  setMenuModel,
  menuModel,
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    signOut();
  };

  const handleClickV2 = () => {
    navigate("/explore");
  };

  return (
    <div onClick={() => setMenuModel(!menuModel)} className="menu-container">
      <div className="flex flex-col gap-5 w-full">
        <div onClick={handleClickV2} className=" flex flex-row gap-3">
          <img src="/assets/icons/wallpaper.svg" alt="explore" />
          <span>Explore</span>
        </div>
        <div className=" flex flex-row gap-3">
          <img src="/assets/icons/notification.svg" alt="Notification" />
          <span>Notification</span>
        </div>
        <div className=" flex flex-row gap-3">
          <img src="/assets/icons/settings.svg" alt="settings" />
          <span>Settings</span>
        </div>
        <Button
          onClick={handleClick}
          className="bg-[#ff5a5a] hover:bg-[#f43030] w-full text-light-1 flex gap-2"
        >
          Logout
        </Button>
        <p className="text-sm -mt-3 text-center text-gray-400">
          © 2024{" "}
          <span className="text-primary-500/90">snapgram_by_lingraj</span>
        </p>
      </div>
    </div>
  );
};

export default MenuBar;
