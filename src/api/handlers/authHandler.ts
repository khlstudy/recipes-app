import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";

import usersData from "../../data/users.json";

import { usersHandler } from "./usersHandler";

interface Account {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "admin" | "user";
}

let accounts: Account[] = usersData.accounts as Account[];

export const authHandler = {
  login(body: LoginRequest): AuthResponse {
    const account = accounts.find(
      (a) =>
        a.email.toLowerCase() === body.email.toLowerCase() &&
        a.password === body.password
    );
    if (!account) {
      throw {
        success: false,
        message: "Invalid email or password",
        code: "UNAUTHORIZED",
        statusCode: 401,
      };
    }
    const token = btoa(`${account.id}:${account.email}:${Date.now()}`);
    return {
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        token,
      },
      token,
    };
  },

  register(body: RegisterRequest): AuthResponse {
    const exists = accounts.some(
      (a) => a.email.toLowerCase() === body.email.toLowerCase()
    );
    if (exists) {
      throw {
        success: false,
        message: "Email already in use",
        code: "CONFLICT",
        statusCode: 409,
      };
    }
    const newAccount: Account = {
      id: `u${Date.now()}`,
      email: body.email,
      password: body.password,
      name: body.name,
      role: "user",
    };
    accounts = [...accounts, newAccount];
    usersHandler.createProfile(
      newAccount.id,
      newAccount.name,
      newAccount.email
    );
    const token = btoa(`${newAccount.id}:${newAccount.email}:${Date.now()}`);
    return {
      user: {
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        role: "user",
        token,
      },
      token,
    };
  },
};
