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
  } else {
    // Check if Clerk details have changed and update DB if necessary
    const hasAvatarChanged = user.avatarUrl !== clerkUser.imageUrl;
    const hasNameChanged = user.name !== `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
    const hasUsernameChanged = clerkUser.username && user.username !== clerkUser.username;
    
    if (hasAvatarChanged || hasNameChanged || hasUsernameChanged) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          avatarUrl: clerkUser.imageUrl,
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || user.name,
          username: clerkUser.username || user.username,
        },
      });
    }
  }

  return user;
}
