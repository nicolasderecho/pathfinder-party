import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

interface CreateUserParams extends Pick<User, "email" | "firstName" | "lastName"> {
  password: string;
}

export async function createUser({password, ...userParams}: CreateUserParams) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      ...userParams,
      encryptedPassword: hashedPassword,
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: User["encryptedPassword"]
) {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    user.encryptedPassword
  );

  if (!isValid) {
    return null;
  }

  const { encryptedPassword: _password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}