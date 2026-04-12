import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/home";
import { RoomPage } from "../pages/room";
import { AddRoomPage } from "../pages/add-room";
import { QuickStartPage } from "../pages/quick-start";
import { useUser } from "../entities/user";
import { ROUTES } from "../shared/config/routes";

export const AuthGuard = ({ children }: React.PropsWithChildren) => {
  const { user } = useUser();

  if (user === undefined) {
    return null;
  }

  return user?.displayName
    ? <>{children}</>
    : <Navigate to={ROUTES.quickStart} replace />;
};

export const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={ROUTES.quickStart} element={<QuickStartPage />} />
        <Route
          path={ROUTES.room.base}
          element={
            <AuthGuard>
              <RoomPage />
            </AuthGuard>
          }
        />
        <Route
          path="/add-room/:roomHash"
          element={
            <AuthGuard>
              <AddRoomPage />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.home}
          element={
            <AuthGuard>
              <HomePage />
            </AuthGuard>
          }
        />
      </Routes>
    </HashRouter>
  );
};