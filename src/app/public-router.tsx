import { HashRouter, Route, Routes } from "react-router-dom";
import { RoomListPage } from "../pages/room-list";
import { useUser } from "../entities/user";
import { RegisterPage } from "../pages/register";

export const RegisterWrapper = ({ children }: React.PropsWithChildren) => {
  const { user } = useUser();
  return user ? children : <RegisterPage />;
};

export const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RegisterWrapper>
              <RoomListPage />
            </RegisterWrapper>
          }
        />
      </Routes>
    </HashRouter>
  );
};