import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getOrCreateUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Find user by clerkId
  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  // If user does not exist in local DB, create them
  if (!user) {
    const email = clerkUser.emailAddresses[0]?.emailAddress || `${clerkUser.id}@noemail.com`;
    const username = clerkUser.username || email.split("@")[0] || `user_${Math.random().toString(36).slice(2, 7)}`;
    
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: email,
        username: username,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || username,
        avatarUrl: clerkUser.imageUrl,
      },
    });
  }

  return user;
}
