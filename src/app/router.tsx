import { HashRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/home";
import { RoomPage } from "../pages/room";
import { AddRoomPage } from "../pages/add-room";
import { useUser } from "../entities/user";
import { RegisterPage } from "../pages/register";
import { ROUTES } from "../shared/config/routes";

export const RegisterWrapper = ({ children }: React.PropsWithChildren) => {
  const { user } = useUser();
  return user ? children : <RegisterPage />;
};

export const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route
          path={ROUTES.room.base}
          element={
            <RegisterWrapper>
              <RoomPage />
            </RegisterWrapper>
          }
        />
        <Route
          path="/add-room/:roomHash"
          element={
            <RegisterWrapper>
              <AddRoomPage />
            </RegisterWrapper>
          }
        />
        <Route
          path={ROUTES.home}
          element={
            <RegisterWrapper>
              <HomePage />
            </RegisterWrapper>
          }
        />
      </Routes>
    </HashRouter>
  );
};