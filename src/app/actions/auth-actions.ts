"use server";

import { prisma } from "../../lib/db";
import { hashPassword, verifyPassword, setSessionCookie, clearSessionCookie } from "../../lib/auth";
import { redirect } from "next/navigation";

export async function signUpAction(prevState: any, formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const designation = formData.get("designation") as string;
  const phone = (formData.get("phone") as string) || null;
  const organizationName = formData.get("organizationName") as string;
  const website = (formData.get("website") as string) || null;
  const password = formData.get("password") as string;

  if (!fullName || !email || !designation || !organizationName || !password) {
    return { success: false, error: "Missing required fields." };
  }

  try {
    const existing = await prisma.organizer.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: false, error: "Email is already registered." };
    }

    const passwordHash = hashPassword(password);

    const organizer = await prisma.organizer.create({
      data: {
        fullName,
        email,
        designation,
        phone,
        organizationName,
        website,
        passwordHash,
      },
    });

    await setSessionCookie(organizer.id);
  } catch (err: any) {
    // If it's a redirect error, rethrow it so Next.js handles the redirect correctly
    if (err.digest && err.digest.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("SignUp error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  redirect("/organizer/dashboard");
}

export async function signInAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Please enter your email and password." };
  }

  try {
    const organizer = await prisma.organizer.findUnique({
      where: { email },
    });

    if (!organizer) {
      return { success: false, error: "Invalid email or password." };
    }

    const isValid = verifyPassword(password, organizer.passwordHash);
    if (!isValid) {
      return { success: false, error: "Invalid email or password." };
    }

    await setSessionCookie(organizer.id);
  } catch (err: any) {
    // If it's a redirect error, rethrow it so Next.js handles the redirect correctly
    if (err.digest && err.digest.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("SignIn error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  redirect("/organizer/dashboard");
}

export async function logOutAction() {
  await clearSessionCookie();
  redirect("/sign-in");
}
