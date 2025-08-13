import type { IUser } from "../model/user";

const USER_KEY = "local-user";

export const saveUserFromRepo = (user: IUser) => {
  const value = JSON.stringify(user);
  localStorage.setItem(USER_KEY, value);
  return user;
}

export const getUserFromRepo = () => {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) as IUser : null
}