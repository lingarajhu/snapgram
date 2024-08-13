import { Outlet, Navigate } from "react-router-dom";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import sideImageData from "../../public/assets/images/side-image.json";
import { useRef } from "react";

const AuthLayout = () => {
  const isAuthenticated = false;
  const animeRef = useRef<LottieRefCurrentProps>(null);
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          {/* <img
            src="/assets/images/side-img.svg"
            alt="side-image"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          /> */}
          <Lottie
            lottieRef={animeRef}
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
            animationData={sideImageData}
          />
        </>
      )}
    </>
  );
};

export default AuthLayout;
