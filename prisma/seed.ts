import { PrismaClient } from "@prisma/client";
import { createEzrenRoRTemplate } from "./seeds"
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "arielzarate@gmail.com";
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      firstName: "Ariel",
      lastName: "Zarate",
      email: "arielzarate@gmail.com",
      encryptedPassword: await bcrypt.hash("pathfinder", 10),
    },
  });
  await createEzrenRoRTemplate(prisma);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});