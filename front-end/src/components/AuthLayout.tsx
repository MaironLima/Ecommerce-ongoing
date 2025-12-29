import { Outlet } from "react-router-dom";
import HeaderAuth from "./HeaderAuth";
import { ThemeProvider } from "./ThemeProvider";

function AuthLayout() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div>
        <HeaderAuth />
        <main>
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default AuthLayout;
