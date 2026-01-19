"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveBMILog(weight: number, height: number, bmi: number) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("You must be logged in to save data");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.bMILog.create({
    data: {
      userId: user.id,
      weight,
      height,
      bmi,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/history");
}
