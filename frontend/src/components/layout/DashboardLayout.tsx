import {
  FiUsers,
  FiMapPin,
  FiClipboard,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";

import {
  logout,
  getUserName
} from "../../utils/auth";

import {
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

type Props = {
  children: React.ReactNode;

  role: string;
};

export default function DashboardLayout({
  children,
  role,
}: Props) {

  const [mobileMenuOpen,
    setMobileMenuOpen] =
    useState(false);

  const userName =
    getUserName();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const pathname =
    location.pathname;

  // -----------------------------------
  // Navigation Items
  // -----------------------------------

  const navItems = [

    {
      label: "Clients",
      icon: <FiUsers />,
      path: "/clients",
    },

    {
      label: "Sites",
      icon: <FiMapPin />,
      path: "/sites",
    },

    {
      label: "Work Types",
      icon: <FiClipboard />,
      path: "/work-types",
    },
  ];

  if (role === "admin") {

    navItems.push({
      label: "Users",
      icon: <FiUsers />,
      path: "/users",
    });
  }

  // -----------------------------------
  // Logout
  // -----------------------------------

  const handleLogout = () => {

    logout();

    navigate("/", {
      replace: true,
    });
  };

  return (

    <div className="min-h-screen bg-[#F7F7F5] md:flex">

      {/* MOBILE HEADER */}
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-[#E8E5DF]
          bg-white
          px-5
          py-4
          md:hidden
        "
      >

        <div className="flex items-center gap-3">

          <img
            src="/logo.png"
            alt="logo"
            className="w-10"
          />

          <h1
            className="
              font-adam
              text-sm
              tracking-[0.3em]
              text-[#1E1E1E]
            "
          >
            ARCHIMYTH
          </h1>

        </div>

        <button

          onClick={() =>
            setMobileMenuOpen(
              !mobileMenuOpen
            )
          }

          className="
            rounded-xl
            border
            border-[#E8E5DF]
            bg-white
            p-2
            text-xl
          "
        >

          <FiMenu />

        </button>

      </div>

      {/* MOBILE SIDEBAR */}
      {mobileMenuOpen && (

        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/40
            md:hidden
          "
        >

          <aside
            className="
              h-full
              w-[280px]
              bg-white
              px-6
              py-8
              shadow-2xl
            "
          >

            {/* Logo */}
            <div className="mb-10 flex flex-col items-center">

              <img
                src="/logo.png"
                alt="logo"
                className="mb-4 w-24"
              />

              <h1
                className="
                  font-adam
                  text-sm
                  tracking-[0.4em]
                  text-[#1E1E1E]
                "
              >
                ARCHIMYTH
              </h1>

            </div>

            {/* Navigation */}
            <nav className="space-y-3">

              {navItems.map((item) => {

                const active =
                  pathname.startsWith(
                    item.path
                  );

                return (

                  <button
                    key={item.path}

                    onClick={() => {

                      navigate(item.path);

                      setMobileMenuOpen(false);
                    }}

                    className={`
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-2xl
                      px-4
                      py-3
                      text-sm
                      transition-all
                      duration-300

                      ${
                        active
                          ? `
                            bg-[#D9C7A6]
                            text-[#1E1E1E]
                          `
                          : `
                            text-gray-500
                            hover:bg-[#F5F1EA]
                          `
                      }
                    `}
                  >

                    <span className="text-lg">
                      {item.icon}
                    </span>

                    <span>
                      {item.label}
                    </span>

                  </button>
                );
              })}

            </nav>

            {/* Logout */}
            <button

              onClick={handleLogout}

              className="
                mt-10
                flex
                w-full
                items-center
                gap-3
                rounded-2xl
                px-4
                py-3
                text-sm
                text-gray-500
                transition-all
                duration-300
                hover:bg-red-50
                hover:text-red-500
              "
            >

              <FiLogOut />

              Logout

            </button>

          </aside>

        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside
        className="
          hidden
          md:flex
          w-[260px]
          flex-col
          border-r
          border-[#E8E5DF]
          bg-white
          px-6
          py-8
        "
      >

        {/* Logo */}
        <div className="mb-12 flex flex-col items-center">

          <img
            src="/logo.png"
            alt="logo"
            className="mb-4 w-24"
          />

          <h1
            className="
              font-adam
              text-sm
              tracking-[0.4em]
              text-[#1E1E1E]
            "
          >
            ARCHIMYTH
          </h1>

        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-3">

          {navItems.map((item) => {

            const active =
              pathname.startsWith(
                item.path
              );

            return (

              <button
                key={item.path}

                onClick={() =>
                  navigate(item.path)
                }

                className={`
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-2xl
                  px-4
                  py-3
                  text-sm
                  transition-all
                  duration-300

                  ${
                    active
                      ? `
                        bg-[#D9C7A6]
                        text-[#1E1E1E]
                        shadow-sm
                      `
                      : `
                        text-gray-500
                        hover:bg-[#F5F1EA]
                      `
                  }
                `}
              >

                <span className="text-lg">
                  {item.icon}
                </span>

                <span>
                  {item.label}
                </span>

              </button>
            );
          })}

        </nav>

        {/* Logout */}
        <button

          onClick={handleLogout}

          className="
            mt-8
            flex
            items-center
            gap-3
            rounded-2xl
            px-4
            py-3
            text-sm
            text-gray-500
            transition-all
            duration-300
            hover:bg-red-50
            hover:text-red-500
          "
        >

          <FiLogOut />

          Logout

        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8">

        {/* Topbar */}
        <div
          className="
            mb-8
            flex
            flex-col
            gap-5
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <div>

            <p className="text-sm text-gray-500">
              Welcome back,
            </p>

            <h1
              className="
                mt-1
                text-3xl
                font-semibold
                text-[#1E1E1E]
                md:text-4xl
              "
            >
              {userName || "User"}
            </h1>

          </div>

          <div
            className="
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-[#E8E5DF]
              bg-white
              px-5
              py-3
              shadow-sm
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-[#D9C7A6]
                text-lg
                font-semibold
                text-[#1E1E1E]
              "
            >
              {userName?.charAt(0)}
            </div>

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-[#1E1E1E]
                "
              >
                {userName || "User"}
              </p>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wider
                  text-gray-500
                "
              >
                {role}
              </p>

            </div>

          </div>

        </div>

        {/* Page Content */}
        {children}

      </main>

    </div>
  );
}
