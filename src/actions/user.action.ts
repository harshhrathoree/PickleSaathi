"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return;

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) return existingUser;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
        location: "Ahmedabad", // Default location for PickleSaathi
        skillLevel: "BEGINNER", // Default skill level
      },
    });

    return dbUser;
  } catch (error) {
    console.log("Error in syncUser", error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          gamesCreated: true,
          gameParticipants: true,
        },
      },
    },
  });
}

export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await getUserByClerkId(clerkId);

  if (!user) throw new Error("User not found");

  return user.id;
}

// export async function getNearbyPlayers() {
//   try {
//     const userId = await getDbUserId();

//     if (!userId) return [];

//     const currentUser = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { location: true },
//     });

//     if (!currentUser) return [];

//     // Find players in the same location excluding ourselves
//     const nearbyPlayers = await prisma.user.findMany({
//       where: {
//         AND: [
//           { NOT: { id: userId } },
//           { location: currentUser.location },
//         ],
//       },
//       select: {
//         id: true,
//         name: true,
//         username: true,
//         image: true,
//         skillLevel: true,
//         location: true,
//         _count: {
//           select: {
//             followers: true,
//             gamesCreated: true,
//           },
//         },
//       },
//       take: 6,
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     return nearbyPlayers;
//   } catch (error) {
//     console.log("Error fetching nearby players", error);
//     return [];
//   }
// }

// export async function connectWithPlayer(targetUserId: string) {
//   try {
//     const userId = await getDbUserId();

//     if (!userId) return { success: false, error: "User not authenticated" };

//     if (userId === targetUserId) {
//       return { success: false, error: "You cannot connect with yourself" };
//     }

//     const existingConnection = await prisma.follows.findUnique({
//       where: {
//         followerId_followingId: {
//           followerId: userId,
//           followingId: targetUserId,
//         },
//       },
//     });

//     if (existingConnection) {
//       // Disconnect
//       await prisma.follows.delete({
//         where: {
//           followerId_followingId: {
//             followerId: userId,
//             followingId: targetUserId,
//           },
//         },
//       });
//     } else {
//       // Connect
//       await prisma.$transaction([
//         prisma.follows.create({
//           data: {
//             followerId: userId,
//             followingId: targetUserId,
//           },
//         }),

//         prisma.notification.create({
//           data: {
//             type: "PLAYER_CONNECTION",
//             userId: targetUserId, // user being connected with
//             creatorId: userId, // user initiating connection
//           },
//         }),
//       ]);
//     }

//     revalidatePath("/");
//     return { success: true };
//   } catch (error) {
//     console.log("Error in connectWithPlayer", error);
//     return { success: false, error: "Error connecting with player" };
//   }
// }

// export async function updateUserProfile(profileData: {
//   name?: string;
//   bio?: string;
//   skillLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "PROFESSIONAL";
//   location?: string;
// }) {
//   try {
//     const userId = await getDbUserId();

//     if (!userId) return { success: false, error: "User not authenticated" };

//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: profileData,
//     });

//     revalidatePath("/profile");
//     return { success: true, user: updatedUser };
//   } catch (error) {
//     console.log("Error updating user profile", error);
//     return { success: false, error: "Error updating profile" };
//   }
// }

// export async function getUserStats(userId: string) {
//   try {
//     const stats = await prisma.user.findUnique({
//       where: { id: userId },
//       select: {
//         _count: {
//           select: {
//             gamesCreated: true,
//             gameParticipants: true,
//             followers: true,
//             following: true,
//           },
//         },
//       },
//     });

//     return stats?._count || {
//       gamesCreated: 0,
//       gameParticipants: 0,
//       followers: 0,
//       following: 0,
//     };
//   } catch (error) {
//     console.log("Error fetching user stats", error);
//     return {
//       gamesCreated: 0,
//       gameParticipants: 0,
//       followers: 0,
//       following: 0,
//     };
//   }
// }