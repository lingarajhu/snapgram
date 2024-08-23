import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/library/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import MenuBar from "./MenuBar";

const TopBar = () => {
  const navigate = useNavigate();
  const [menuModel, setMenuModel] = useState<boolean>(false);
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { user } = useUserContext();
  const { toast } = useToast();

  useEffect(() => {
    if (isSuccess) {
      toast({ description: "Log out sucsessfull" });
      navigate("/sign-in");
    }
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link className="flex gap-3 items-center" to="/">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>

        <div className="flex gap-1">
          <Link to={`/profile/${user.id}`} className="flex-center gap-2 -mr-1">
            <img
              src={
                user.imageUrl
                  ? user.imageUrl
                  : "/assets/icons/profile-placeholder.svg"
              }
              alt="profile picture"
              className="h-8 w-8 rounded-full"
            />
          </Link>
          <Button
            variant="ghost"
            className="shad-button_ghost -mr-3"
            onClick={() => setMenuModel((menuModel) => !menuModel)}
          >
            {!menuModel ? (
              <img src="/assets/icons/menu.svg" alt="menu-bar" />
            ) : (
              <img src="/assets/icons/close.svg" alt="menu-bar" />
            )}
          </Button>
          {menuModel && (
            <MenuBar
              signOut={signOut}
              setMenuModel={setMenuModel}
              menuModel={menuModel}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default TopBar;
