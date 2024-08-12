import { Link, useLocation } from "react-router-dom";
import { bottombarLinks } from "@/constants";

const BottomBar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;

        return (
          <Link
            to={link.route}
            key={link.label}
            className={`${
              isActive && "bg-purple-500 rounded-[15px]"
            } flex-center flex-col p-2 gap-1 transition`}
          >
            <img
              src={link.imgURL}
              alt="nav image"
              width={16}
              height={16}
              className={`${isActive && "invert-white"}`}
            />
            <p className="tiny-medium text-light-2">{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
};

export default BottomBar;
