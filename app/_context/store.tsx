"use client";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import debounce from "debounce";
import useSessionStorage from "../_hooks/useSessionStorage";
import { warningIconLg } from "@/app/_utils/svgIcons";
// import { downloadSessionStorage } from "../_utils/downloadStorage";
import { getConditionalLinks } from "../_utils/navigationConfig";

export const publicPaths = [
  "/",
  "/signin",
  "/modules",
  "/pricing",
  "/pricing/plan",
  "/signup",
  "/about-us",
  "/contact-us",
  "/blog",
  "/privacy-security",
  "/disclaimer",
  "/careers",
  "/interview-schedule",
];

const userPaths = [
  "/profile",
  "/survey",
  "/faq",
  "/events-tasks",
  "/vacations",
  "/resignation",
  "/complaints",
  "/resignation-management",
  "/vacation-request",
];

// ===== 00. Start Authentication =====
export type AuthStateType = {
  token: string;
  decodedToken: any;
};
// ===== 00. End Authentication =====

// ===== 01. Start Global Brands =====
interface IBrand {
  _id: string;
  brandName: string;
  description: string;
  acquisitionDate: number;
  niche: string;
  scrapingApis: string[];
  isDeleted: boolean;
  __v: number;
}

interface GlobalBrands {
  brandId: string;
  brandName: string;
}
// ===== 01. End Global Brands =====

interface ContextState {
  // ===== 00. Start Authentication =====
  authState: AuthStateType;
  setAuthState: (authState: AuthStateType) => void;
  signOut: () => void;
  handleSignOut: (message?: string) => void;
  // ===== 00. End Authentication =====
  // ===== 01. Start Global Brands =====
  globalBrands: GlobalBrands[];
  setGlobalBrands: (brands: GlobalBrands[]) => void;
  globalBrandsWithoutParent: GlobalBrands[];
  setGlobalBrandsWithoutParent: (brands: GlobalBrands[]) => void;
  brandMap: { [key: string]: string };
  brandIdMap: { [key: string]: string };
  brandOptions: string[];
  selectedBrandId: string;
  setSelectedBrandId: (brandId: string) => void;
  getBrandsPlatform: (platform: string) => void;
  getAllBrands: () => void;
  getBrandsWithoutParent: () => void;
  // ===== 01. End Global Brands =====
}

const initialContextState: ContextState = {
  // ===== 00. Start Authentication =====
  authState: {
    token: "" as string,
    decodedToken: null as any,
  },
  setAuthState: (authState: AuthStateType) => {},
  signOut: () => {},
  handleSignOut: (message?: string) => {},
  // ===== 00. End Authentication =====
  // ===== 01. Start Global Brands =====
  globalBrands: [],
  setGlobalBrands: (brands: GlobalBrands[]) => {},
  globalBrandsWithoutParent: [],
  setGlobalBrandsWithoutParent: (brands: GlobalBrands[]) => {},
  brandMap: {},
  brandIdMap: {},
  brandOptions: [],
  selectedBrandId: "",
  setSelectedBrandId: (brandId: string) => {},
  getBrandsPlatform: (platform: string) => {},
  getAllBrands: () => {},
  getBrandsWithoutParent: () => {},
  // ===== 01. End Global Brands =====
};

// 1- create context, export it
export const globalContext = createContext<ContextState>(initialContextState);

// 2- provide context, export it
export default function GlobalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const path = usePathname();

  // ===== 00. Start Authentication =====
  const handleSetRouteToDirect = useCallback((role: string) => {
    switch (role) {
      case "content-creation":
        return "/content-creator/dashboard";
      case "video-editing":
        return "/video-editor/dashboard";
      case "social-media":
        return "/social-media/dashboard";
      case "administrative":
        return "/administrative/dashboard";
      case "customer-service":
        return "/customer-service/dashboard";
      case "creative":
        return "/creative/dashboard";
      case "hr":
        return "/hr/dashboard";
      case "accounting":
        return "/accounting/dashboard";
      case "news-letter":
        return "/newsletter/dashboard";
      case "Out Reach":
        return "/outreach/dashboard";
      case "SEO":
        return "/seo/dashboard";
      case "OP":
        return "/op/dashboard";
      default:
        return "/";
    }
  }, []);

  function tokenInit() {
    if (typeof window !== "undefined") {
      const tokenInitValue = localStorage.getItem("token");
      return tokenInitValue ? tokenInitValue : "";
    } else {
      return "";
    }
  }

  function decodedTokenInit() {
    if (typeof window !== "undefined") {
      const decodedTokenInitValue = localStorage.getItem("decodedToken");
      return decodedTokenInitValue ? JSON.parse(decodedTokenInitValue) : null;
    } else {
      return null;
    }
  }

  const [authState, setAuthState] = useState<AuthStateType>(() => ({
    token: tokenInit(),
    decodedToken: decodedTokenInit(),
  }));

  const checkIfUserOnCorrespondingRoute = useCallback(() => {
    const isPublicPath = publicPaths.some(
      (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
    );
    const isUserPath = userPaths.some(
      (userPath) => path === userPath || path.startsWith(`${userPath}/`)
    );
    if (isPublicPath || isUserPath) return;
    const decodedToken = authState.decodedToken;
    if (!decodedToken) {
      router.push("/");
      return;
    }
    if (decodedToken?.department.includes("ceo")) {
      return;
    }
    const departments = decodedToken?.department;
    // Get all allowed route paths for the user's departments
    const allowedRoutePaths = departments.map((role: string) => {
      const route = handleSetRouteToDirect(role);
      return route?.split("/")[1]; // Extract the path segment
    });
    // Check if the current path includes any of the allowed paths
    const isValidPath = allowedRoutePaths.some((routePath: string) =>
      path.includes(routePath)
    );
    if (!isValidPath) {
      if (departments.length > 0) {
        // Redirect to the first department's dashboard or implement a different logic as needed
        const redirectRoute = handleSetRouteToDirect(departments[0]);
        const route =
          getConditionalLinks(authState.decodedToken?.department[0], "user")[1]
            ?.path! ||
          getConditionalLinks(authState.decodedToken?.department[0], "user")[1]
            ?.subLinks[0]?.path ||
          `/${authState.decodedToken?.department[0]}/dashboard`;
        router.push(route);
        console.log(
          "~~~---***Invalid path***---~~~",
          path,
          "Redirecting to:",
          redirectRoute
        );
      } else {
        // Handle case where no departments are assigned
        router.push("/");
        console.log(
          "~~~---***No department assigned***---~~~ Redirecting to home"
        );
      }
    } else {
      console.log("~~~---Valid path---~~~");
    }
  }, [path, authState.decodedToken, router]);

  async function signOut() {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/authentication/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window !== "undefined"
              ? localStorage.getItem("token")
              : authState.token
          }`,
        },
      }
    );
  }

  const updateAuthState = useCallback((newAuthState: AuthStateType) => {
    setAuthState(newAuthState);
  }, []);

  const handleSignOut = useCallback(
    (message = "Session expired, Please sign in again.") => {
      // if (
      //   path === "/video-editor/create/converted-script" ||
      //   path === "/video-editor/create/choose-footage"
      // ) {
      //   downloadSessionStorage("videoBackup");
      // }
      debouncedCheckAuth.clear(); // Clear any pending auth checks
      signOut();
      localStorage.removeItem("token");
      localStorage.removeItem("decodedToken");
      const timeoutId1 = setTimeout(() => {
        updateAuthState({
          token: "",
          decodedToken: null,
        });
      }, 0);
      if (message !== "") {
        document.body.classList.add("body-prevent-scroll"); // Disable scrolling
        toast.custom(
          (t) => (
            <div className="session-expired-toast-overlay">
              <div className="session-expired-toast">
                <div className="flex flex-col gap-[--sy-22px] bg-orange-50 border-l-[--4px] border-orange-500 px-[--18px] py-[--16px] rounded-[--4px] shadow-lg min-w-[400px]">
                  <div className="flex items-center gap-[--10px]">
                    <div>{warningIconLg}</div>
                    <p className="text-orange-800 font-semibold text-[--17px]">
                      {message}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      className="bg-gray-400 text-white px-[--12px] py-[--6px] rounded-[--4px] hover:bg-gray-500 transition-colors"
                      onClick={() => {
                        toast.remove();
                        // Re-enable scrolling when toast is dismissed
                        document.body.classList.remove("body-prevent-scroll");
                      }}
                    >
                      Close
                    </button>
                    <button
                      className="bg-orange-500 text-white px-[--12px] py-[--6px] rounded-[--4px] hover:bg-orange-600 transition-colors"
                      onClick={() => {
                        toast.remove();
                        // Re-enable scrolling when toast is dismissed
                        document.body.classList.remove("body-prevent-scroll");
                        // Navigate to signin
                        router.push("/signin");
                      }}
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ),
          {
            duration: Infinity,
          }
        );
      }
      const timeoutId2 = setTimeout(() => {
        router.push("/");
      }, 1);
      // Return cleanup function
      return () => {
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
        toast.remove();
        document.body.classList.remove("body-prevent-scroll"); // Re-enable scrolling when toast is dismissed
        debouncedCheckAuth.clear(); // Clear any pending auth checks
      };
    },
    [router, path]
  );

  async function checkAuth() {
    toast("Checking authentication...");
    const authToken = authState.token || localStorage.getItem("token");
    if (!authToken) {
      handleSignOut("No token found, Please sign in again.");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/authentication/check-auth`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 401) {
        handleSignOut();
        return;
      }
      const data = await res.json();
      if (data.result) {
        toast.success("Session is valid");
      } else if (data.message && data.message.name === "TokenExpiredError") {
        // handleSignOut();
        return;
      } else if (data.message === "USER_TOKEN_IS_INVALID") {
        // handleSignOut();
        return;
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  }

  const debouncedCheckAuth = useMemo(
    () => debounce(checkAuth, 1000),
    [checkAuth]
  );

  useEffect(() => {
    const isPublicPath = publicPaths.some(
      (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
    );
    if (isPublicPath && !authState.token) return;
    if (authState.token) {
      // console.log("Token found - performing auth check");
      debouncedCheckAuth();
    } else {
      // console.log(
      //   "It's Not Public Path and No Token, Please sign in again."
      // );
      router.push("/");
    }
    return () => {
      debouncedCheckAuth.clear();
    };
  }, [authState.token]);

  useEffect(() => {
    const isPublicPath = publicPaths.some(
      (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
    );
    const isUserPath = userPaths.some(
      (userPath) => path === userPath || path.startsWith(`${userPath}/`)
    );
    if (isPublicPath || isUserPath) return;
    console.log("---currentPath:", path);
    checkIfUserOnCorrespondingRoute();
  }, [path, checkIfUserOnCorrespondingRoute]);
  // ===== 00. End Authentication =====

  // ===== 01. Start Global Brands =====
  const [globalBrands, setGlobalBrands] = useSessionStorage<
    { brandId: string; brandName: string }[]
  >("MG-globalBrands", []);
  const [globalBrandsWithoutParent, setGlobalBrandsWithoutParent] =
    useSessionStorage<{ brandId: string; brandName: string }[]>(
      "MG-globalBrandsWithoutParent",
      []
    );

  // Lookup for brandId by brandName
  const brandMap = useMemo(
    () =>
      globalBrands.reduce((map: { [key: string]: string }, brand) => {
        map[brand.brandName] = brand.brandId;
        return map;
      }, {}),
    [globalBrands]
  );

  // Lookup for brandName by brandId
  const brandIdMap = useMemo(
    () =>
      globalBrands.reduce((map: { [key: string]: string }, brand) => {
        map[brand.brandId] = brand.brandName;
        return map;
      }, {}),
    [globalBrands]
  );

  const brandOptions = useMemo(() => {
    return globalBrands.map((brand) => brand.brandName) || [];
  }, [globalBrands]);

  async function getBrandsWithoutParent() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/brand/get-singular-brands`,
        {
          headers: {
            Authorization: `Bearer ${
              typeof window !== "undefined"
                ? localStorage.getItem("token")
                : authState.token
            }`,
          },
        }
      );
      if (res.status === 401) {
        handleSignOut();
        return;
      }
      const json = await res.json();
      const brandsArray: IBrand[] = json.data;
      if (brandsArray && brandsArray.length > 0) {
        const brands: GlobalBrands[] = brandsArray.map((ele) => {
          return {
            brandId: ele._id,
            brandName: ele.brandName,
          };
        });
        setGlobalBrandsWithoutParent(brands);
      } else {
        // toast.error("Something went wrong!");
      }
    } catch (error) {
      // toast.error("Something went wrong!");
      console.error("Error getBrandsWithoutParent:", error);
    }
  }

  async function getAllBrands() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/brand/brands-full-list?limit=9999`,
        {
          headers: {
            Authorization: `Bearer ${
              typeof window !== "undefined"
                ? localStorage.getItem("token")
                : authState.token
            }`,
          },
        }
      );
      if (res.status === 401) {
        handleSignOut();
        return;
      }
      const json = await res.json();
      const brandsArray: IBrand[] = json.data;
      if (brandsArray && brandsArray.length > 0) {
        const brands: GlobalBrands[] = brandsArray.map((ele) => {
          return {
            brandId: ele._id,
            brandName: ele.brandName,
          };
        });
        setGlobalBrands(brands);
      } else {
        // toast.error("Something went wrong!");
      }
    } catch (error) {
      // toast.error("Something went wrong!");
      console.error("Error getAllBrands:", error);
    }
  }

  async function getBrandsPlatform(
    platform: string
  ): Promise<string[] | undefined> {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/user/brand/filter-by-platform/${platform}`,
        {
          headers: {
            Authorization: `Bearer ${
              typeof window !== "undefined"
                ? localStorage.getItem("token")
                : authState.token
            }`,
          },
        }
      );
      if (res.status === 401) {
        handleSignOut();
        return;
      }
      const json = await res.json();
      const brandsArray: IBrand[] = json.data;
      if (brandsArray && brandsArray.length > 0) {
        return brandsArray.map((e) => e.brandName);
      } else {
        return [];
        // toast.error("Something went wrong!");
      }
    } catch (error) {
      // toast.error("Something went wrong!");
      console.error("Error getBrandsPlatform:", error);
    }
  }

  const [selectedBrandId, setSelectedBrandId] = useSessionStorage<string>(
    "MG-selectedBrandId",
    "",
    { isSerializable: false }
  );

  useEffect(() => {
    const isPublicPath = publicPaths.some(
      (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
    );
    if (isPublicPath) return;
    if (typeof window !== "undefined") {
      const globalBrands = sessionStorage.getItem("MG-globalBrands");
      const globalBrandsWithoutParent = sessionStorage.getItem(
        "MG-globalBrandsWithoutParent"
      );
      if (!globalBrands || JSON.parse(globalBrands).length === 0) {
        getAllBrands();
      }
      if (
        !globalBrandsWithoutParent ||
        JSON.parse(globalBrandsWithoutParent).length === 0
      ) {
        getBrandsWithoutParent();
      }
    }
  }, [path]);
  // ===== 01. End Global Brands =====

  // Create a context value object
  const contextValue: ContextState = {
    // ===== 00. Start Authentication =====
    authState,
    setAuthState,
    signOut,
    handleSignOut,
    // ===== 00. End Authentication =====
    // ===== 01. Start Global Brands =====
    globalBrands,
    setGlobalBrands,
    globalBrandsWithoutParent,
    setGlobalBrandsWithoutParent,
    brandMap,
    brandIdMap,
    brandOptions,
    selectedBrandId,
    setSelectedBrandId,
    getBrandsPlatform,
    getAllBrands,
    getBrandsWithoutParent,
    // ===== 01. End Global Brands =====
  };

  return (
    // to provide what i created
    <globalContext.Provider value={contextValue}>
      {children}
    </globalContext.Provider>
  );
}
