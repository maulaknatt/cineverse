import { prisma } from "@/lib/prisma";

interface AwardXpResult {
  xp: number;
  level: number;
  xpGained: number;
  leveledUp: boolean;
}

/**
 * Awards XP to a user and handles automatic leveling up (100 XP per level).
 * 
 * @param userId - The local database User ID (not Clerk ID)
 * @param amount - Amount of XP to award
 */
export async function awardXp(userId: string, amount: number): Promise<AwardXpResult | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, xp: true },
    });

    if (!user) return null;

    let newXp = user.xp + amount;
    let newLevel = user.level;
    const xpPerLevel = 100;
    let leveledUp = false;

    while (newXp >= xpPerLevel) {
      newXp -= xpPerLevel;
      newLevel += 1;
      leveledUp = true;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXp,
        level: newLevel,
      },
    });

    // If leveled up, trigger a notification
    if (leveledUp) {
      await prisma.notification.create({
        data: {
          userId,
          type: "ACHIEVEMENT_UNLOCKED",
          data: {
            title: `Leveled Up to Level ${newLevel}!`,
            description: `Congratulations! You reached level ${newLevel}. Keep watching and reviewing!`,
          },
        },
      });
    }

    return {
      xp: updatedUser.xp,
      level: updatedUser.level,
      xpGained: amount,
      leveledUp,
    };
  } catch (error) {
    console.error("Failed to award XP:", error);
    return null;
  }
}
