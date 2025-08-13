import type { IUser } from "../model/user";

const USER_KEY = "local-user";

export const saveUser = (user: IUser) => {
  const value = JSON.stringify(user);
  localStorage.setItem(USER_KEY, value);
  return user;
}

export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) as IUser : null
}