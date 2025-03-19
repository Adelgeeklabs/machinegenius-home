"use client";
import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  memo,
  useMemo,
  useRef,
} from "react";
import styles from "./SideNav.module.css";
import logo_image from "../../../public/assets/logo.svg";
import logo_white_image from "../../../public/assets/logo white.svg";
import logo_text_image from "../../../public/assets/logo text.svg";
import Image from "next/image";
import Link from "next/link";
import CustomSelectInput from "../CustomSelectInput/CustomSelectInput";
import { useRouter, usePathname } from "next/navigation";
import $ from "jquery";
import { globalContext } from "@/app/_context/store";
import debounce from "debounce";
import { truncateText } from "@/app/_utils/text";
import { useSocket } from "@/app/_context/SocketProvider";
import useClickOutside from "@/app/_hooks/useClickOutside";
import { getConditionalLinks } from "@/app/_utils/navigationConfig";

const rolsIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 20" fill="none">
    <path
      d="M20.5001 9.28571H11.2144V0H9.7858V9.28571H0.500084V10.7143H9.7858V20H11.2144V10.7143H20.5001V9.28571Z"
      fill="#FFFFFB"
    />
    <path
      d="M6.92865 20H1.21437C1.0926 20 0.972851 19.9689 0.866493 19.9096C0.760135 19.8503 0.6707 19.7648 0.606682 19.6612C0.542664 19.5577 0.506189 19.4394 0.500721 19.3178C0.495253 19.1961 0.520974 19.0751 0.57544 18.9662L3.43258 13.2519C3.49852 13.1412 3.59207 13.0496 3.70407 12.9859C3.81607 12.9223 3.94269 12.8888 4.07151 12.8888C4.20034 12.8888 4.32695 12.9223 4.43896 12.9859C4.55096 13.0496 4.64451 13.1412 4.71044 13.2519L7.56758 18.9662C7.62205 19.0751 7.64777 19.1961 7.6423 19.3178C7.63684 19.4394 7.60036 19.5577 7.53634 19.6612C7.47232 19.7648 7.38289 19.8503 7.27653 19.9096C7.17017 19.9689 7.05042 20 6.92865 20ZM2.37023 18.5714H5.7728L4.07151 15.1688L2.37023 18.5714Z"
      fill="#FFFFFB"
    />
    <path
      d="M19.0715 7.14286H14.7858C14.4071 7.14242 14.0439 6.99177 13.7761 6.72396C13.5083 6.45614 13.3577 6.09303 13.3572 5.71429V1.42857C13.3577 1.04982 13.5083 0.686714 13.7761 0.418899C14.0439 0.151084 14.4071 0.00043481 14.7858 0H19.0715C19.4503 0.00043481 19.8134 0.151084 20.0812 0.418899C20.349 0.686714 20.4996 1.04982 20.5001 1.42857V5.71429C20.4996 6.09303 20.349 6.45614 20.0812 6.72396C19.8134 6.99177 19.4503 7.14242 19.0715 7.14286ZM14.7858 1.42857V5.71429H19.0722L19.0715 1.42857H14.7858Z"
      fill="#FFFFFB"
    />
    <path
      d="M4.07151 7.14286C3.36515 7.14286 2.67465 6.9334 2.08733 6.54096C1.50002 6.14853 1.04226 5.59075 0.771944 4.93816C0.501631 4.28556 0.430905 3.56747 0.568709 2.87468C0.706514 2.18189 1.04666 1.54552 1.54613 1.04605C2.04561 0.546576 2.68197 0.20643 3.37476 0.0686256C4.06755 -0.0691788 4.78565 0.00154743 5.43824 0.27186C6.09083 0.542173 6.64861 0.999932 7.04105 1.58725C7.43348 2.17457 7.64294 2.86507 7.64294 3.57143C7.64183 4.51829 7.26519 5.42605 6.59566 6.09558C5.92613 6.76511 5.01837 7.14174 4.07151 7.14286ZM4.07151 1.42857C3.6477 1.42857 3.2334 1.55425 2.88101 1.78971C2.52861 2.02517 2.25396 2.35984 2.09177 2.75139C1.92958 3.14295 1.88715 3.57381 1.96983 3.98948C2.05251 4.40515 2.2566 4.78698 2.55629 5.08666C2.85597 5.38634 3.23779 5.59043 3.65346 5.67311C4.06914 5.7558 4.49999 5.71336 4.89155 5.55117C5.28311 5.38898 5.61777 5.11433 5.85323 4.76194C6.08869 4.40955 6.21437 3.99525 6.21437 3.57143C6.21375 3.0033 5.98778 2.45862 5.58605 2.05689C5.18433 1.65516 4.63964 1.4292 4.07151 1.42857Z"
      fill="#FFFFFB"
    />
    <path d="M4 15L6.16506 18.75H1.83494L4 15Z" fill="#FFFFFB" />
    <path
      d="M6.5 3.5C6.5 4.88071 5.38071 6 4 6C2.61929 6 1.5 4.88071 1.5 3.5C1.5 2.11929 2.61929 1 4 1C5.38071 1 6.5 2.11929 6.5 3.5Z"
      fill="#FFFFFB"
    />
    <path d="M14.5 1H19.5V6H14.5V1Z" fill="#FFFFFB" />
    <path
      d="M13.9894 17.2489C13.3369 16.9004 13.3369 16.0996 13.9894 15.7511L18.8793 13.1397C19.5817 12.7646 20.5 13.1889 20.5 13.8886V19.1114C20.5 19.8111 19.5817 20.2354 18.8793 19.8603L13.9894 17.2489Z"
      fill="#FFFFFB"
    />
  </svg>
);

const rols = [
  "Content Creator",
  "Video Editing",
  "Social Media",
  "Administrative",
  "Customer Service",
  "Creative",
  "HR",
  "Accounting",
  "Newsletter",
  "Out Reach",
  "SEO",
  "OP",
];

const signOutIcon = (
  <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    className="w-[24px] h-[24px]"
    viewBox="0 0 110.395 122.88"
    enableBackground="new 0 0 110.395 122.88"
    xmlSpace="preserve"
  >
    <g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M93.359,17.16L75.68,9.377L75.99,0h34.404v61.439v61.44H75.99l-0.311-6.835 l17.68-10.946V17.16L93.359,17.16z M82.029,79.239v-34.54H47.004V13.631L0,61.937l47.004,48.373v-31.07H82.029L82.029,79.239z"
      />
    </g>
  </svg>
);

const SideNav = ({
  sideNavLinks,
  isSideNavOpen,
  setIsSideNavOpen,
  setCurrentPage,
}: {
  sideNavLinks: {
    name?: string;
    path?: string;
    icon?: any;
    subLinks?: { name: string; path: string }[];
  }[];
  isSideNavOpen: boolean;
  setIsSideNavOpen: any;
  setCurrentPage: any;
}) => {
  const router = useRouter();
  const { authState, handleSignOut } = useContext(globalContext);
  const pathname = usePathname(); // example: /content-creator/dashboard
  const [isBusy, setIsBusy] = useState<any>(false);
  const { socket, onlineUsers, setOnlineUsers, allUnreadMessages } =
    useSocket();
  const [isHoverDisabled, setIsHoverDisabled] = useState(false);
  const sideNavRef = useRef<HTMLDivElement>(null);

  // current role

  // Memoize the result of selectedRoleTitleInit
  const SelectedRoleTitle = useMemo(() => {
    const internalToDisplay = (role: string) => {
      return role
        .split("-")
        .map((word: string) =>
          word === "hr"
            ? "HR"
            : word === "seo"
              ? "SEO"
              : word === "op"
                ? "OP"
                : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
    };

    if (typeof window !== "undefined") {
      const selectedRoleInitValue = sessionStorage.getItem("selected-role");
      return selectedRoleInitValue
        ? internalToDisplay(selectedRoleInitValue)
        : internalToDisplay(authState.decodedToken?.department[0] || "");
    } else {
      return internalToDisplay(authState.decodedToken?.department[0] || "");
    }
  }, [authState.decodedToken?.department]);

  const [SelectedRole, setSelectedRole] = useState<string | number>("");

  // Add effect to set initial role in localStorage
  useEffect(() => {
    if (
      authState.decodedToken?.department?.[0] &&
      !sessionStorage.getItem("selected-role")
    ) {
      const initialRole = authState.decodedToken.department[0]
        .split("-")
        .map((word: string) =>
          word === "hr"
            ? "HR"
            : word === "seo"
              ? "SEO"
              : word === "op"
                ? "OP"
                : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
      setSelectedRole(initialRole);
      sessionStorage.setItem("selected-role", initialRole);
    }
  }, [authState.decodedToken?.department]);

  // function that get role value from select option by send it as a prop
  const getRole = useCallback((value: string | number) => {
    setSelectedRole(value);
  }, []);

  const filteredRoles = useMemo(() => {
    const displayToInternal = (role: string) => {
      return role.toLowerCase().replace(/\s+/g, "-");
    };

    return authState.decodedToken?.department.includes("ceo")
      ? rols
      : rols.filter((role) =>
          authState.decodedToken?.department.includes(displayToInternal(role))
        );
  }, [authState.decodedToken?.department]);

  // function that get current
  const handleCurrentPageTitle = useCallback(
    (name: any) => {
      setCurrentPage(name);
    },
    [setCurrentPage]
  );

  const applyBusy = () => {
    if (socket) {
      socket.emit("employeeBusy", true);
      setOnlineUsers((prev: any) => {
        const newOnlineUsers = prev.map((u: any) => {
          if (u._id == authState.decodedToken?._id) {
            u.isBusy = true;
          }
          return u;
        });
        return newOnlineUsers;
      });
      console.log("busy");
    }
  };
  const applyNotBusy = () => {
    if (socket) {
      socket.emit("employeeBusy", false);
      setOnlineUsers((prev: any) => {
        const newOnlineUsers = prev.map((u: any) => {
          if (u._id == authState.decodedToken?._id) {
            u.isBusy = false;
          }
          return u;
        });
        return newOnlineUsers;
      });
      console.log("not busy");
    }
  };

  useEffect(() => {
    if (isBusy) {
      console.log("yes");

      applyBusy();
    } else if (!isBusy) {
      applyNotBusy();
    }
  }, [isBusy]);

  useEffect(() => {
    if (
      onlineUsers?.find((u: any) => u._id == authState.decodedToken?._id)
        ?.isBusy
    ) {
      // console.log("true");
      setIsBusy(true);
    }
  }, [onlineUsers]);

  const handleToggleSubMenu = useCallback((e: any) => {
    // console.log($(e.target).parents(`.${styles.has_sub_menu}`));
    $(`.${styles.has_sub_menu}`)
      .not($(e.target).parents(`.${styles.has_sub_menu}`))
      .removeClass(`${styles.open}`);
    $(e.target)
      .parents(`.${styles.has_sub_menu}`)
      .toggleClass(`${styles.open}`);
  }, []);

  useEffect(() => {
    if (SelectedRole && rols.includes(SelectedRole as string)) {
      sessionStorage.setItem("selected-role", SelectedRole.toString());
      const module = (role: string) => {
        return role.toLowerCase().replace(/\s+/g, "-");
      };
      const route =
        getConditionalLinks(module(SelectedRole as string), "user")[1]?.path! ||
        getConditionalLinks(module(SelectedRole as string), "user")[1]
          ?.subLinks[0]?.path ||
        `/${module(SelectedRole as string)}/dashboard`;

      router.push(route);
      // if (SelectedRole === "Content Creation" || SelectedRole === "ceo") {
      //   router.push("/content-creator/dashboard");
      // } else if (SelectedRole === "Video Editing") {
      //   router.push("/video-editor/dashboard");
      // } else if (SelectedRole === "Social Media") {
      //   router.push("/social-media/dashboard");
      // } else if (SelectedRole === "Administrative") {
      //   router.push("/administrative/dashboard");
      // } else if (SelectedRole === "Customer Service") {
      //   router.push("/customer-service/dashboard");
      // } else if (SelectedRole === "Creative") {
      //   router.push("/creative/dashboard");
      // } else if (SelectedRole === "HR") {
      //   router.push("/hr/dashboard");
      // } else if (SelectedRole === "Accounting") {
      //   router.push("/accounting/dashboard");
      // } else if (SelectedRole === "Newsletter") {
      //   router.push("/newsletter/dashboard");
      // } else if (SelectedRole === "Out Reach") {
      //   router.push("/outreach/dashboard");
      // } else if (SelectedRole === "SEO") {
      //   router.push("/seo/dashboard");
      // } else if (SelectedRole === "OP") {
      //   router.push("/op/dashboard");
      // }
    }
  }, [SelectedRole]);

  useEffect(() => {
    const savedPreferences = localStorage.getItem("userPreferences");
    if (savedPreferences) {
      const { disableHoverInteraction } = JSON.parse(savedPreferences);
      setIsHoverDisabled(disableHoverInteraction);
    }
  }, []);

  // Create debounced functions using useCallback
  const handleMouseEnter = useCallback(
    debounce(() => {
      if (!isHoverDisabled) {
        setIsSideNavOpen(true);
      }
    }, 100),
    [isHoverDisabled]
  );

  const handleMouseLeave = useCallback(
    debounce(() => {
      if (!isHoverDisabled) {
        setIsSideNavOpen(false);
      }
    }, 100),
    [isHoverDisabled]
  );

  const handleClick = () => {
    if (isHoverDisabled && !isSideNavOpen) {
      setIsSideNavOpen(true);
    }
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  useEffect(() => {
    return () => {
      handleMouseEnter.clear();
      handleMouseLeave.clear();
    };
  }, [handleMouseEnter, handleMouseLeave]);

  useClickOutside(
    sideNavRef,
    () => {
      if (isHoverDisabled && isSideNavOpen) {
        setIsSideNavOpen(false);
      }
    },
    isHoverDisabled
  );

  return (
    <div
      ref={sideNavRef}
      className={`${styles.side_Nav} ${isSideNavOpen ? "" : styles.close}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div>
        <div
          className={styles.user_info + " flex items-center justify-between"}
        >
          <div
            className={`${styles.avatar_logo} flex items-center gap-[0.6vw]`}
          >
            <div
              className={styles.avatar + " cursor-pointer " + styles.active}
              onClick={handleProfile}
            ></div>
            <div className="flex flex-col">
              <h6
                onClick={handleProfile}
                className="cursor-pointer"
                title={
                  authState.decodedToken?.firstName
                    ? authState.decodedToken?.firstName?.split(" ")[0] +
                        " " +
                        authState.decodedToken?.lastName?.split(" ")[0] || ""
                    : authState.decodedToken?.email?.split("geek")[0]
                }
              >
                {authState.decodedToken?.firstName
                  ? truncateText(
                      authState.decodedToken?.firstName?.split(" "),
                      14
                    )
                  : truncateText(
                      authState.decodedToken?.email?.split("geek")[0],
                      14
                    )}
              </h6>
              <p>{SelectedRoleTitle}</p>
              {isSideNavOpen && (
                <div
                  className={`items-center gap-[--6px] text-[--13px] font-semibold ${isSideNavOpen ? "visible" : "invisible"} flex delay-75 cursor-pointer`}
                  onClick={() => setIsBusy((prev: Boolean) => !prev)}
                >
                  <label
                    htmlFor="busy"
                    className={` w-[--11px] h-[--11px] rounded-full ${isBusy ? "bg-orange-600 animate-pulse" : "bg-gray-300"} border-[1px] border-white cursor-pointer`}
                  ></label>
                  <span
                    className={`text-[--13px] font-semibold ${isBusy ? "text-orange-600 animate-pulse" : "text-gray-400"} cursor-pointer`}
                  >
                    Busy
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className={styles.logo}>
            <Image src={logo_image} alt="logo" />
            <Image src={logo_white_image} alt="logo" />
          </div>
        </div>

        <ul className={styles.side_nav_links + " space-y-[0.5vw]"}>
          <li>
            <Link
              href={sideNavLinks[0]?.path ? sideNavLinks[0]?.path : ""}
              onClick={() => handleCurrentPageTitle(sideNavLinks[0].name)}
            >
              {sideNavLinks[0].icon}
              <p>{sideNavLinks[0].name}</p>
            </Link>
          </li>
        </ul>

        <div className={styles.line}></div>

        <CustomSelectInput
          options={filteredRoles}
          icon={rolsIcon}
          theme="dark"
          whenSideNavClosed={!isSideNavOpen}
          getValue={getRole}
          label={SelectedRoleTitle}
        />

        <div className={styles.line}></div>
        <ul
          className={
            styles.side_nav_links +
            " space-y-[0.4vw] overflow-y-auto max-h-[55vh]"
          }
        >
          {sideNavLinks?.slice(1).map((ele, index) => (
            <React.Fragment key={ele.name}>
              <li
                key={ele.name}
                className={ele.subLinks ? styles.has_sub_menu : ""}
                onClick={
                  ele.subLinks ? (e) => handleToggleSubMenu(e) : undefined
                }
              >
                <Link
                  href={ele.path ? ele.path : ""}
                  onClick={() =>
                    handleCurrentPageTitle((prev: any) =>
                      ele.path ? ele.name : prev
                    )
                  }
                >
                  {ele.icon}
                  <p>{ele.name}</p>
                  {ele.subLinks && (
                    <svg
                      className={styles.toggleIcon}
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="9"
                      viewBox="0 0 18 9"
                      fill="none"
                    >
                      <path
                        d="M0.900542 9H17.101C17.265 8.99966 17.4258 8.96945 17.566 8.91262C17.7062 8.85579 17.8206 8.7745 17.8968 8.67749C17.973 8.58049 18.0081 8.47144 17.9984 8.36209C17.9887 8.25274 17.9345 8.14723 17.8417 8.05692L9.74149 0.242983C9.40578 -0.0809944 8.59756 -0.0809944 8.26095 0.242983L0.160721 8.05692C0.0669606 8.14705 0.0119774 8.25261 0.00174508 8.36214C-0.00848727 8.47167 0.0264226 8.58098 0.102682 8.67819C0.178941 8.7754 0.293633 8.8568 0.434296 8.91353C0.57496 8.97027 0.736215 9.00017 0.900542 9Z"
                        fill="#2A2B2A"
                      />
                    </svg>
                  )}
                </Link>

                <ul className={styles.sub_menu_links}>
                  {ele.subLinks
                    ? ele.subLinks.map((ele) => (
                        <li>
                          <Link
                            href={ele.path}
                            onClick={() => handleCurrentPageTitle(ele.name)}
                          >
                            {ele.name}
                          </Link>
                        </li>
                      ))
                    : null}
                </ul>
              </li>
              {/* {index === sideNavLinks.length - 2 && (
                <li
                  key="CandidatesTasks"
                  // className={ele.subLinks ? styles.has_sub_menu : ""}
                  onClick={(e) => handleToggleSubMenu(e)}
                >
                  <Link
                    href={`/${
                      sideNavLinks[0].path?.split("/")[1]
                    }/candidates-tasks`}
                    onClick={() =>
                      handleCurrentPageTitle((prev: any) => "Candidates Tasks")
                    }
                  >
                    <svg
                      fill="#000000"
                      className="w-[--24px] h-[--24px]"
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 470.767 470.767"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <g>
                          {" "}
                          <path d="M362.965,21.384H289.62L286.638,7.99C285.614,3.323,281.467,0,276.685,0h-82.618c-4.782,0-8.913,3.323-9.953,7.99 l-2.967,13.394h-73.36c-26.835,0-48.654,21.827-48.654,48.662v352.06c0,26.835,21.819,48.662,48.654,48.662h255.179 c26.835,0,48.67-21.827,48.67-48.662V70.046C411.635,43.211,389.8,21.384,362.965,21.384z M379.831,422.105 c0,9.295-7.563,16.858-16.866,16.858H107.786c-9.287,0-16.85-7.563-16.85-16.858V70.046c0-9.295,7.563-16.857,16.85-16.857h66.294 l-1.692,7.609c-0.684,3.02,0.062,6.188,1.988,8.596c1.94,2.415,4.876,3.82,7.965,3.82h106.082c3.091,0,6.026-1.405,7.951-3.82 c1.942-2.415,2.687-5.575,2.004-8.596l-1.692-7.609h66.279c9.303,0,16.866,7.563,16.866,16.857V422.105z"></path>{" "}
                          <path d="M170.835,188.426h43.249l-10.279-7.019c-14.506-9.899-18.232-29.693-8.325-44.197c9.893-14.489,29.693-18.239,44.197-8.324 l1.694,1.157v-12.136c0-7.866-6.383-14.248-14.242-14.248h-56.294c-7.857,0-14.24,6.383-14.24,14.248v56.271 C156.595,182.045,162.978,188.426,170.835,188.426z"></path>{" "}
                          <path d="M303.256,110.313l-49.85,47.194l-22.704-15.49c-7.221-4.962-17.13-3.083-22.099,4.162 c-4.954,7.251-3.09,17.144,4.178,22.098l33.28,22.727c2.718,1.864,5.839,2.772,8.961,2.772c3.96,0,7.888-1.474,10.933-4.356 l59.167-56.014c6.382-6.033,6.645-16.104,0.62-22.479C319.686,104.552,309.637,104.28,303.256,110.313z"></path>{" "}
                          <path d="M170.835,297.669H214.1l-10.295-7.027c-14.506-9.901-18.232-29.693-8.325-44.197c9.893-14.498,29.693-18.248,44.197-8.325 l1.694,1.158v-12.136c0-7.865-6.383-14.248-14.242-14.248h-56.294c-7.857,0-14.24,6.383-14.24,14.248v56.279 C156.595,291.286,162.978,297.669,170.835,297.669z"></path>{" "}
                          <path d="M303.256,219.555l-49.85,47.186l-22.704-15.49c-7.221-4.97-17.13-3.098-22.099,4.162 c-4.954,7.253-3.09,17.144,4.178,22.099l33.28,22.727c2.718,1.864,5.839,2.772,8.961,2.772c3.96,0,7.888-1.476,10.933-4.356 l59.167-56.007c6.382-6.033,6.645-16.096,0.62-22.479C319.686,213.793,309.637,213.529,303.256,219.555z"></path>{" "}
                          <path d="M227.129,322.135h-56.294c-7.857,0-14.24,6.383-14.24,14.248v56.271c0,7.865,6.383,14.248,14.24,14.248h56.294 c7.859,0,14.242-6.383,14.242-14.248v-56.271C241.371,328.518,234.988,322.135,227.129,322.135z"></path>{" "}
                        </g>{" "}
                      </g>
                    </svg>
                    <p>Candidates Tasks</p>
                  </Link>
                </li>
              )} */}

              {index === sideNavLinks.length - 2 &&
                (authState.decodedToken?.department?.some(
                  (dept: string) => dept === "hr" || dept === "ceo"
                ) ||
                  authState.decodedToken?.type === "headManager" ||
                  authState.decodedToken?.type === "manager") && (
                  <li key="resignation-management">
                    <Link
                      href={`/resignation-management`}
                      onClick={() =>
                        handleCurrentPageTitle(
                          (prev: any) => "Resignation Management"
                        )
                      }
                    >
                      <div className="relative">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                          />
                        </svg>
                      </div>
                      <p>Resignation Management</p>
                    </Link>
                  </li>
                )}

              {index === sideNavLinks.length - 2 && (
                <li
                  key="resignation"
                  // className={ele.subLinks ? styles.has_sub_menu : ""}
                >
                  <Link
                    href={`/resignation`}
                    onClick={() =>
                      handleCurrentPageTitle(
                        (prev: any) => "Resignation Request"
                      )
                    }
                  >
                    <div className="relative">
                      <svg
                        fill="#000000"
                        viewBox="0 0 1024 1024"
                        className="w-[24px] h-[24px]"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M442.458 506.633l526.285 319.386c9.669 5.868 22.265 2.786 28.133-6.883s2.786-22.265-6.883-28.133L463.708 471.617c-9.669-5.868-22.265-2.786-28.133 6.883s-2.786 22.265 6.883 28.133z"></path>
                          <path d="M471.605 496.4c69.645-88.617 219.439-102.62 347.816-28.496 132.967 76.763 194.927 220.077 144.852 325.443-4.855 10.216-.509 22.433 9.706 27.288s22.433.509 27.288-9.706c60.149-126.562-11.322-291.875-161.366-378.497-144.745-83.575-317.1-67.463-400.501 38.659-6.989 8.893-5.446 21.768 3.447 28.757s21.768 5.446 28.757-3.447z"></path>
                          <path d="M684.302 659.986L486.25 992.53c-5.788 9.718-2.602 22.288 7.116 28.075s22.288 2.602 28.075-7.116l198.052-332.544c5.788-9.718 2.602-22.288-7.116-28.075s-22.288-2.602-28.075 7.116zm159.905-278.013l-27.699 47.974c-5.656 9.795-2.3 22.321 7.496 27.976s22.321 2.3 27.976-7.496l27.699-47.974c5.656-9.795 2.3-22.321-7.496-27.976s-22.321-2.3-27.976 7.496zm-518.698-143.64c0-46.166-37.423-83.589-83.589-83.589s-83.589 37.423-83.589 83.589 37.423 83.589 83.589 83.589 83.589-37.423 83.589-83.589zm40.96 0c0 68.788-55.761 124.549-124.549 124.549s-124.549-55.761-124.549-124.549c0-68.788 55.761-124.549 124.549-124.549s124.549 55.761 124.549 124.549zM221.44 20.48h40.96V51.2h-40.96V20.48zM262.4 51.2c0 27.307-40.96 27.307-40.96 0V20.48c0-27.307 40.96-27.307 40.96 0V51.2zm-40.96 381.44h40.96v30.72h-40.96v-30.72zm40.96 30.72c0 27.307-40.96 27.307-40.96 0v-30.72c0-27.307 40.96-27.307 40.96 0v30.72zM70.853 99.817l28.963-28.963 21.729 21.729-28.963 28.963-21.729-21.729zm50.693-7.234c19.309 19.309-9.654 48.272-28.963 28.963L70.854 99.817c-19.309-19.309 9.654-48.272 28.963-28.963l21.729 21.729zm240.748 298.674l28.963-28.963 21.729 21.729-28.963 28.963-21.729-21.729zm50.693-7.234c19.309 19.309-9.654 48.272-28.963 28.963l-21.729-21.729c-19.309-19.309 9.654-48.272 28.963-28.963l21.729 21.729zM20.48 262.4v-40.96H51.2v40.96H20.48zm30.72-40.96c27.307 0 27.307 40.96 0 40.96H20.48c-27.307 0-27.307-40.96 0-40.96H51.2zm412.16 0c27.307 0 27.307 40.96 0 40.96h-30.72c-27.307 0-27.307-40.96 0-40.96h30.72zM92.583 362.294c19.309-19.309 48.272 9.654 28.963 28.963l-21.729 21.729c-19.309 19.309-48.272-9.654-28.963-28.963l21.729-21.729zm291.44-291.441c19.309-19.309 48.272 9.654 28.963 28.963l-21.729 21.729c-19.309 19.309-48.272-9.654-28.963-28.963l21.729-21.729zm50.693-7.234c19.309 19.309-9.654 48.272-28.963 28.963l-21.729-21.729c-19.309-19.309 9.654-48.272 28.963-28.963l21.729 21.729zM20.48 262.4v-40.96H51.2v40.96H20.48zm30.72-40.96c27.307 0 27.307 40.96 0 40.96H20.48c-27.307 0-27.307-40.96 0-40.96H51.2zm412.16 0c27.307 0 27.307 40.96 0 40.96h-30.72c-27.307 0-27.307-40.96 0-40.96h30.72zM92.583 362.294c19.309-19.309 48.272 9.654 28.963 28.963l-21.729 21.729c-19.309 19.309-48.272-9.654-28.963-28.963l21.729-21.729zm291.44-291.441c19.309-19.309 48.272 9.654 28.963 28.963l-21.729 21.729c-19.309 19.309-48.272-9.654-28.963-28.963l21.729-21.729z"></path>
                        </g>
                      </svg>
                    </div>
                    <p>Resignation Request</p>
                  </Link>
                </li>
              )}

              {/* {index === sideNavLinks.length - 2 && (
                <li
                  key="Employees Hierarchy"
                  // className={ele.subLinks ? styles.has_sub_menu : ""}
                >
                  <Link
                    href={`/${sideNavLinks[0]?.path?.split("/")[1]}/employees-hierarchy`}
                    onClick={() =>
                      handleCurrentPageTitle(
                        (prev: any) => "Employees Hierarchy"
                      )
                    }
                  >
                    <div className="relative">
                      <svg
                        fill="#000000"
                        viewBox="0 0 16 16"
                        id="hierarchy-16px"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[--24px] h-[--24px]"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            id="Path_183"
                            data-name="Path 183"
                            d="M-15.833,12.1A2,2,0,0,0-15.5,11,2,2,0,0,0-17,9.071V8.5a.5.5,0,0,0-.5-.5h-4V7H-20a1.5,1.5,0,0,0,1.5-1.5,2.5,2.5,0,0,0-1.833-2.4A2,2,0,0,0-20,2a2,2,0,0,0-2-2,2,2,0,0,0-2,2,2,2,0,0,0,.333,1.1A2.5,2.5,0,0,0-25.5,5.5,1.5,1.5,0,0,0-24,7h1.5V8h-4a.5.5,0,0,0-.5.5v.571A2,2,0,0,0-28.5,11a2,2,0,0,0,.333,1.1A2.5,2.5,0,0,0-30,14.5,1.5,1.5,0,0,0-28.5,16h4A1.5,1.5,0,0,0-23,14.5a2.5,2.5,0,0,0-1.833-2.4A2,2,0,0,0-24.5,11,2,2,0,0,0-26,9.071V9h8v.071A2,2,0,0,0-19.5,11a2,2,0,0,0,.333,1.1A2.5,2.5,0,0,0-21,14.5,1.5,1.5,0,0,0-19.5,16h4A1.5,1.5,0,0,0-14,14.5,2.5,2.5,0,0,0-15.833,12.1ZM-22,1a1,1,0,0,1,1,1,1,1,0,0,1-1,1,1,1,0,0,1-1-1A1,1,0,0,1-22,1Zm-2.5,4.5A1.5,1.5,0,0,1-23,4h2a1.5,1.5,0,0,1,1.5,1.5A.5.5,0,0,1-20,6h-4A.5.5,0,0,1-24.5,5.5Zm.5,9a.5.5,0,0,1-.5.5h-4a.5.5,0,0,1-.5-.5A1.5,1.5,0,0,1-27.5,13h2A1.5,1.5,0,0,1-24,14.5.5.5,0,0,1-24.5,15ZM-25.5,11a1,1,0,0,1-1,1,1,1,0,0,1-1-1,1,1,0,0,1-1-1A1,1,0,0,1-25.5,11Zm8-1a1,1,0,0,1,1,1,1,1,0,0,1-1,1,1,1,0,0,1-1-1A1,1,0,0,1-17.5,10Zm2,5h-4a.5.5,0,0,1-.5-.5A1.5,1.5,0,0,1-18.5,13h2A1.5,1.5,0,0,1-15,14.5.5.5,0,0,1-15.5,15Z"
                            transform="translate(30)"
                          ></path>{" "}
                        </g>
                      </svg>
                    </div>
                    <p>Employees Hierarchy</p>
                  </Link>
                </li>
              )} */}

              {index === sideNavLinks.length - 2 && (
                <li
                  key="Complaints"
                  // className={ele.subLinks ? styles.has_sub_menu : ""}
                >
                  <Link
                    href={`/${sideNavLinks[0]?.path?.split("/")[1]}/complaints`}
                    onClick={() =>
                      handleCurrentPageTitle((prev: any) => "Complaints")
                    }
                  >
                    <div className="relative">
                      <svg
                        fill="#000000"
                        width="256px"
                        height="256px"
                        viewBox="-2 0 19 19"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[--24px] h-[--24px]"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M14.032 5.286v7.276a1.112 1.112 0 0 1-1.108 1.108H8.75l-1.02 1.635a.273.273 0 0 1-.503 0l-1.02-1.635h-4.13a1.112 1.112 0 0 1-1.109-1.108V5.286a1.112 1.112 0 0 1 1.108-1.108h10.848a1.112 1.112 0 0 1 1.108 1.108zM8.206 11.34a.706.706 0 1 0-.706.705.706.706 0 0 0 .706-.705zm-1.26-1.83a.554.554 0 1 0 1.108 0V6.275a.554.554 0 1 0-1.108 0z"></path>
                        </g>
                      </svg>
                    </div>
                    <p>Complaints</p>
                  </Link>
                </li>
              )}

              {index === sideNavLinks.length - 2 &&
                (authState.decodedToken?.department?.some(
                  (dept: string) => dept === "hr" || dept === "ceo"
                ) ||
                  authState.decodedToken?.type === "headManager" ||
                  authState.decodedToken?.type === "manager") && (
                  <li key="Vacations RM">
                    <Link
                      href={`/vacations`}
                      onClick={() =>
                        handleCurrentPageTitle((prev: any) => "Vacations RM")
                      }
                    >
                      <div className="relative">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                          />
                        </svg>
                      </div>
                      <p>Vacations RM</p>
                    </Link>
                  </li>
                )}

              {index === sideNavLinks.length - 2 && (
                <li
                  key="Vacation"
                  // className={ele.subLinks ? styles.has_sub_menu : ""}
                >
                  <Link
                    href={`/${sideNavLinks[0]?.path?.split("/")[1]}/vacation-request`}
                    onClick={() =>
                      handleCurrentPageTitle((prev: any) => "Vacation Request")
                    }
                  >
                    <div className="relative">
                      <svg
                        fill="#000000"
                        viewBox="0 0 1024 1024"
                        className="w-[24px] h-[24px]"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M442.458 506.633l526.285 319.386c9.669 5.868 22.265 2.786 28.133-6.883s2.786-22.265-6.883-28.133L463.708 471.617c-9.669-5.868-22.265-2.786-28.133 6.883s-2.786 22.265 6.883 28.133z"></path>
                          <path d="M471.605 496.4c69.645-88.617 219.439-102.62 347.816-28.496 132.967 76.763 194.927 220.077 144.852 325.443-4.855 10.216-.509 22.433 9.706 27.288s22.433.509 27.288-9.706c60.149-126.562-11.322-291.875-161.366-378.497-144.745-83.575-317.1-67.463-400.501 38.659-6.989 8.893-5.446 21.768 3.447 28.757s21.768 5.446 28.757-3.447z"></path>
                          <path d="M684.302 659.986L486.25 992.53c-5.788 9.718-2.602 22.288 7.116 28.075s22.288 2.602 28.075-7.116l198.052-332.544c5.788-9.718 2.602-22.288-7.116-28.075s-22.288-2.602-28.075 7.116zm159.905-278.013l-27.699 47.974c-5.656 9.795-2.3 22.321 7.496 27.976s22.321 2.3 27.976-7.496l27.699-47.974c5.656-9.795 2.3-22.321-7.496-27.976s-22.321-2.3-27.976 7.496zm-518.698-143.64c0-46.166-37.423-83.589-83.589-83.589s-83.589 37.423-83.589 83.589 37.423 83.589 83.589 83.589 83.589-37.423 83.589-83.589zm40.96 0c0 68.788-55.761 124.549-124.549 124.549s-124.549-55.761-124.549-124.549c0-68.788 55.761-124.549 124.549-124.549s124.549 55.761 124.549 124.549zM221.44 20.48h40.96V51.2h-40.96V20.48zM262.4 51.2c0 27.307-40.96 27.307-40.96 0V20.48c0-27.307 40.96-27.307 40.96 0V51.2zm-40.96 381.44h40.96v30.72h-40.96v-30.72zm40.96 30.72c0 27.307-40.96 27.307-40.96 0v-30.72c0-27.307 40.96-27.307 40.96 0v30.72zM70.853 99.817l28.963-28.963 21.729 21.729-28.963 28.963-21.729-21.729zm50.693-7.234c19.309 19.309-9.654 48.272-28.963 28.963L70.854 99.817c-19.309-19.309 9.654-48.272 28.963-28.963l21.729 21.729zm240.748 298.674l28.963-28.963 21.729 21.729-28.963 28.963-21.729-21.729zm50.693-7.234c19.309 19.309-9.654 48.272-28.963 28.963l-21.729-21.729c-19.309-19.309 9.654-48.272 28.963-28.963l21.729 21.729zM20.48 262.4v-40.96H51.2v40.96H20.48zm30.72-40.96c27.307 0 27.307 40.96 0 40.96H20.48c-27.307 0-27.307-40.96 0-40.96H51.2zm412.16 0c27.307 0 27.307 40.96 0 40.96h-30.72c-27.307 0-27.307-40.96 0-40.96h30.72zM92.583 362.294c19.309-19.309 48.272 9.654 28.963 28.963l-21.729 21.729c-19.309 19.309-48.272-9.654-28.963-28.963l21.729-21.729zm291.44-291.441c19.309-19.309 48.272 9.654 28.963 28.963l-21.729 21.729c-19.309 19.309-48.272-9.654-28.963-28.963l21.729-21.729z"></path>
                        </g>
                      </svg>
                    </div>
                    <p>Vacation Request</p>
                  </Link>
                </li>
              )}

              {index === sideNavLinks.length - 2 && (
                <li
                  key="Chat"
                  // className={ele.subLinks ? styles.has_sub_menu : ""}
                >
                  <Link
                    href={`/${sideNavLinks[0]?.path?.split("/")[1]}/chat`}
                    onClick={() =>
                      handleCurrentPageTitle((prev: any) => "Chat")
                    }
                  >
                    <div className="relative">
                      <svg
                        fill="#000000"
                        version="1.1"
                        id="Capa_1"
                        viewBox="0 0 60.019 60.019"
                        className="w-[24px] h-[24px]"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <g>
                            {" "}
                            <path d="M59.888,47.514l-3.839-11.518c2.056-3.615,3.14-7.716,3.14-11.893c0-13.286-10.809-24.095-24.095 c-24.095c-8.242,0-15.824,4.223-20.219,11.007c3.089-1.291,6.477-2.007,10.029-2.007C39.294,9.01,51,20.716,51,35.104c0,3.996-0.905,7.783-2.518,11.172l10.263,2.701c0.085,0.022,0.17,0.033,0.255,0.033c0.006,0,0.014-0.001,0.02,0c0.553,0,1-0.448,1-1C60.019,47.829,59.972,47.66,59.888,47.514z"></path>{" "}
                            <path d="M24.905,11.01C11.619,11.01,0.81,21.819,0.81,35.104c0,4.176,1.084,8.277,3.14,11.893L0.051,58.693c-0.116,0.349-0.032,0.732,0.219,1C0.462,59.898,0.727,60.01,1,60.01c0.085,0,0.17-0.011,0.255-0.033l12.788-3.365c3.35,1.694,7.097,2.587,10.862,2.587C38.191,59.199,49,48.39,49,35.104S38.191,11.01,24.905,11.01z M41.246,26.799c-0.152,0.083-0.317,0.123-0.479,0.123c-0.354,0-0.696-0.188-0.878-0.519c-2.795-5.097-8.115-8.679-13.883-9.349c-0.549-0.063-0.941-0.56-0.878-1.108c0.063-0.548,0.558-0.942,1.108-0.878c6.401,0.743,12.304,4.718,15.406,10.373C41.908,25.926,41.73,26.534,41.246,26.799z"></path>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                      {allUnreadMessages?.totalUnseenMessages ? (
                        <div className="absolute -top-[--5px] left-[--10px] bg-red-600 rounded-full z-50 text-white text-[10px] min-w-[16px] min-h-[16px] p-[--2px]  flex items-center justify-center">
                          {allUnreadMessages?.totalUnseenMessages}
                        </div>
                      ) : null}
                    </div>
                    <p>Chat</p>
                  </Link>
                </li>
              )}

              {index === sideNavLinks.length - 2 && (
                <li
                  key="faq"
                  // className={ele.subLinks ? styles.has_sub_menu : ""}
                >
                  <Link
                    href={pathname?.includes("/hr") ? `/hr/faq` : `/faq`}
                    onClick={() => handleCurrentPageTitle((prev: any) => "FAQ")}
                  >
                    <div className="relative">
                      <svg
                        className="w-[28px] h-[28px]"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.2516 6.87651C14.0444 6.75402 14.8568 6.84761 15.5999 7.14788C16.3432 7.44821 16.9902 7.94457 17.4673 8.58519C17.9446 9.22605 18.2327 9.98569 18.2968 10.7804C18.3609 11.5751 18.1983 12.3706 17.8286 13.0782C17.4592 13.7856 16.8982 14.3762 16.2107 14.7872C16.0284 14.8961 15.8303 14.9983 15.6708 15.0806C15.625 15.1043 15.5824 15.1263 15.5442 15.1463C15.349 15.2489 15.2222 15.3239 15.1283 15.3977C15.0435 15.4642 15.007 15.5137 14.986 15.5549C14.9658 15.5948 14.9331 15.68 14.9331 15.856V17.1095C14.9331 17.4409 14.6644 17.7095 14.3331 17.7095H13.5331C13.2017 17.7095 12.9331 17.4409 12.9331 17.1095V15.856C12.9331 15.4142 13.0194 15.0103 13.203 14.6489C13.386 14.2887 13.6383 14.0247 13.8932 13.8246C14.1388 13.6317 14.4023 13.487 14.6141 13.3758C14.6794 13.3415 14.7392 13.3106 14.795 13.2818C14.9406 13.2066 15.0606 13.1445 15.1844 13.0705C15.5592 12.8465 15.8598 12.5278 16.0559 12.1523C16.2519 11.777 16.3369 11.3581 16.3033 10.9412C16.2696 10.5242 16.1183 10.1222 15.8633 9.77982C15.6081 9.43718 15.2584 9.16698 14.8506 9.00221C14.4427 8.83738 13.9947 8.78543 13.557 8.85306C13.1193 8.92069 12.7119 9.10473 12.3791 9.38198C12.2046 9.52735 12.0544 9.69522 11.9317 9.87962C11.7482 10.1555 11.4141 10.3322 11.0997 10.2275L10.3407 9.97467C10.0263 9.86996 9.8527 9.5276 10.0006 9.23107C10.2652 8.7007 10.6389 8.22871 11.0989 7.84542C11.7135 7.33335 12.4587 6.99902 13.2516 6.87651Z"
                          fill="#000000"
                        />
                        <path
                          d="M13.1111 19.8763C13.1111 19.6002 13.335 19.3763 13.6111 19.3763H14.2587C14.5348 19.3763 14.7587 19.6002 14.7587 19.8763V20.5239C14.7587 20.8 14.5348 21.0239 14.2587 21.0239H13.6111C13.335 21.0239 13.1111 20.8 13.1111 20.5239V19.8763Z"
                          fill="#000000"
                        />
                        <path
                          clip-rule="evenodd"
                          d="M14 1C6.8203 1 1 6.8203 1 14C1 21.1797 6.8203 27 14 27C21.1797 27 27 21.1797 27 14C27 6.8203 21.1797 1 14 1ZM3 14C3 7.92487 7.92487 3 14 3C20.0751 3 25 7.92487 25 14C25 20.0751 20.0751 25 14 25C7.92487 25 3 20.0751 3 14Z"
                          fill="#000000"
                          fill-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <p>FAQ</p>
                  </Link>
                </li>
              )}

              {index === sideNavLinks.length - 2 && (
                <li key="SignOut">
                  <Link
                    href={"/"}
                    onClick={() => {
                      if (socket) {
                        socket.disconnect();
                        setOnlineUsers([]);
                        [
                          "disconnect",
                          "connect",
                          "reconnect_attempt",
                          "reconnect",
                          "reconnect_error",
                          "BroadCastMessage",
                          "message",
                          "NotifyOneUser",
                          "onlineUsers",
                          "disconnectedUser",
                          "connectedUser",
                        ].forEach((event) => {
                          socket.off(event);
                        });
                      }
                      handleSignOut("");
                    }}
                  >
                    {signOutIcon}
                    <p>Signout</p>
                  </Link>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
      <div className={styles.logo_toggle_side_nav}>
        <Image src={logo_text_image} alt="logo" />
        {/* <button onClick={() => setIsSideNavOpen(!isSideNavOpen)}>
                    <svg viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M-0.000110561 1.39996C-0.000110629 0.626759 0.62665 -1.71737e-06 1.39985 -1.78496e-06C2.17304 -1.85256e-06 2.7998 0.626759 2.7998 1.39996L2.7998 23.7993C2.7998 24.5724 2.17304 25.1992 1.39985 25.1992C0.626652 25.1992 -0.000108535 24.5724 -0.000108603 23.7993L-0.000110561 1.39996Z" fill="#FFFFFB" />
                        <path d="M16.3893 4.60971C16.936 5.1564 16.936 6.04285 16.3893 6.58953L11.7794 11.1995L26.5991 11.1994C27.3722 11.1994 27.999 11.8262 27.999 12.5994C27.999 13.3726 27.3722 13.9994 26.5991 13.9994L11.7794 13.9994L16.3893 18.6093C16.936 19.156 16.936 20.0424 16.3893 20.5891C15.8426 21.1358 14.9562 21.1358 14.4095 20.5891L7.40972 13.5893C6.86304 13.0426 6.86304 12.1562 7.40972 11.6095L14.4095 4.60971C14.9562 4.06303 15.8426 4.06303 16.3893 4.60971Z" fill="#FFFFFB" />
                    </svg>
                </button> */}
      </div>
    </div>
  );
};

export default memo(SideNav);
