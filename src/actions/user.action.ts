// app/actions/user.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return;

    // Check if user exists by email instead of clerkId
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });

    if (existingUser) {
      // Update the user with clerkId if it doesn't exist
      if (!existingUser.clerkId) {
        const updatedUser = await prisma.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            clerkId: userId,
          },
        });
        return updatedUser;
      }
      return existingUser;
    }

    // Create new user with clerkId
    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
        location: "Ahmedabad",
        skillLevel: "BEGINNER",
        phone: "",
        bio: "",
        playingStyle: "",
        rating: 0,
        totalReviews: 0,
      },
    });

    return dbUser;
  } catch (error) {
    console.log("Error in syncUser", error);
  }
}

export async function updateUserProfile(data: {
  name?: string;
  phone?: string;
  bio?: string;
  skillLevel?: string;
  playingStyle?: string;
  location?: string;
}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const updatedUser = await prisma.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phone && { phone: data.phone }),
        ...(data.bio && { bio: data.bio }),
        ...(data.skillLevel && { skillLevel: data.skillLevel }),
        ...(data.playingStyle && { playingStyle: data.playingStyle }),
        ...(data.location && { location: data.location }),
      },
    });

    revalidatePath("/profile");
    return updatedUser;
  } catch (error) {
    console.log("Error in updateUserProfile", error);
    throw error;
  }
}

export async function getUserProfile() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      include: {
        photos: {
          orderBy: {
            createdAt: "desc",
          },
          take: 4,
        },
        bookings: {
          include: {
            venue: true,
          },
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.log("Error in getUserProfile", error);
    return null;
  }
}

export async function addUserPhoto(imageUrl: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) throw new Error("User not found");

    const photo = await prisma.userPhoto.create({
      data: {
        imageUrl,
        userId: user.id,
      },
    });

    revalidatePath("/profile");
    return photo;
  } catch (error) {
    console.log("Error in addUserPhoto", error);
    throw error;
  }
}

export async function deleteUserPhoto(photoId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) throw new Error("User not found");

    const photo = await prisma.userPhoto.findFirst({
      where: {
        id: photoId,
        userId: user.id,
      },
    });

    if (!photo) throw new Error("Photo not found");

    await prisma.userPhoto.delete({
      where: {
        id: photoId,
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.log("Error in deleteUserPhoto", error);
    throw error;
  }
}

export async function updateUserRating(rating: number, review: string, reviewerId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) throw new Error("User not found");

    const existingRating = await prisma.userRating.findFirst({
      where: {
        userId: user.id,
        reviewerId,
      },
    });

    if (existingRating) {
      await prisma.userRating.update({
        where: {
          id: existingRating.id,
        },
        data: {
          rating,
          review,
        },
      });
    } else {
      await prisma.userRating.create({
        data: {
          rating,
          review,
          userId: user.id,
          reviewerId,
        },
      });
    }

    const ratings = await prisma.userRating.findMany({
      where: {
        userId: user.id,
      },
    });

    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        rating: averageRating,
        totalReviews: ratings.length,
      },
    });

    revalidatePath("/profile");
    return { success: true, averageRating, totalReviews: ratings.length };
  } catch (error) {
    console.log("Error in updateUserRating", error);
    throw error;
  }
}

export async function getUserRatings() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) return null;

    const ratings = await prisma.userRating.findMany({
      where: {
        userId: user.id,
      },
      include: {
        reviewer: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return ratings;
  } catch (error) {
    console.log("Error in getUserRatings", error);
    return null;
  }
}