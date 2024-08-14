import { useEffect } from "react";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useSignOutAccount } from "@/library/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/library/types";
import { Button } from "../ui/button";
import Loader from "./Loader";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { user, isLoading } = useUserContext();
  const { toast } = useToast();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isSuccess) {
      toast({ description: "Log out sucsessfull" });
      navigate("/sign-in");
    }
  }, [isSuccess]);

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-9">
        <Link className="flex gap-3 items-center" to="/">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>

        {isLoading ? (
          <div className="flex-center relative w-full h-full">
            <Loader />
          </div>
        ) : (
          <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
            <img
              src={
                user.imageUrl
                  ? user.imageUrl
                  : "assets/icons/profile-placeholder"
              }
              className="h-14 w-14 rounded-full object-cover"
              alt="profile-piture"
            />

            <div className="flex flex-col">
              <p className="body-bold">{user.name}</p>
              <p className="small-regular text-light-3">@{user.username}</p>
            </div>
          </Link>
        )}

        <ul className="flex flex-col gap-3">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-purple-500"
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt="nav image"
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>

        <Button
          variant="ghost"
          className="shad-logout-button group"
          onClick={() => signOut()}
        >
          <img
            className="group-hover:invert-white"
            src="/assets/icons/logout.svg"
            alt="logout"
          />
          <p className="small-medium lg:base-medium ">Log out</p>
        </Button>
      </div>
    </nav>
  );
};

export default LeftSideBar;
