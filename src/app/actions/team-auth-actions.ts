"use server";

import { prisma } from "../../lib/db";
import { hashPassword, verifyPassword, setTeamSessionCookie, clearTeamSessionCookie } from "../../lib/auth";
import { redirect } from "next/navigation";
import crypto from "crypto";

function generateJoinCode(): string {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // e.g. 'A8D2F9'
}

export async function teamSignUpAction(prevState: any, formData: FormData) {
  const teamName = formData.get("teamName") as string;
  const teamLeadName = formData.get("teamLeadName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const hackathonId = formData.get("hackathonId") as string;

  if (!teamName || !teamLeadName || !email || !password || !hackathonId) {
    return { success: false, error: "Missing required fields." };
  }

  try {
    const existing = await prisma.team.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: false, error: "Email is already registered for a team." };
    }

    const passwordHash = hashPassword(password);

    // Generate unique joinCode
    let joinCode = generateJoinCode();
    let attempts = 0;
    while (attempts < 10) {
      const existingCode = await prisma.team.findUnique({
        where: { joinCode },
      });
      if (!existingCode) break;
      joinCode = generateJoinCode();
      attempts++;
    }

    const team = await prisma.team.create({
      data: {
        teamName,
        teamLeadName,
        email,
        passwordHash,
        joinCode,
        hackathonId,
      },
    });

    // Create system notification message in general channel
    await prisma.message.create({
      data: {
        content: `System added ${teamLeadName} (Team Lead) to the console.`,
        channelId: "general",
        senderName: "System",
        senderAvatar: "⚙️",
        senderRole: "System",
        teamId: team.id,
        hackathonId: hackathonId,
      },
    });

    await setTeamSessionCookie(team.id);
  } catch (err: any) {
    if (err.digest && err.digest.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("Team SignUp error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  redirect("/team/dashboard");
}

export async function teamSignInAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Please enter your email and password." };
  }

  try {
    // 1. Try to find in Team (Team Lead)
    const team = await prisma.team.findUnique({
      where: { email },
    });

    if (team) {
      const isValid = verifyPassword(password, team.passwordHash);
      if (isValid) {
        await setTeamSessionCookie(team.id);
        redirect("/team/dashboard");
      }
    }

    // 2. Try to find in TeamMember (Team Member)
    const member = await prisma.teamMember.findUnique({
      where: { email },
    });

    if (member) {
      const isValid = verifyPassword(password, member.passwordHash);
      if (isValid) {
        await setTeamSessionCookie(member.id);
        redirect("/team/dashboard");
      }
    }

    return { success: false, error: "Invalid email or password." };
  } catch (err: any) {
    if (err.digest && err.digest.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("Team SignIn error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function teamLogOutAction() {
  await clearTeamSessionCookie();
  redirect("/team/login");
}

export async function verifyJoinCodeAction(joinCode: string) {
  if (!joinCode) {
    return { success: false, error: "Please enter an invite code." };
  }

  try {
    const team = await prisma.team.findUnique({
      where: { joinCode: joinCode.toUpperCase().trim() },
      select: { id: true, teamName: true },
    });

    if (!team) {
      return { success: false, error: "Invalid invite code. Team not found." };
    }

    return { success: true, teamId: team.id, teamName: team.teamName };
  } catch (err) {
    console.error("verifyJoinCodeAction error:", err);
    return { success: false, error: "Failed to verify invite code." };
  }
}

export async function joinTeamAction(prevState: any, formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const teamId = formData.get("teamId") as string;

  if (!fullName || !email || !password || !teamId) {
    return { success: false, error: "Missing required fields." };
  }

  try {
    // Check if email already exists in TeamMember or Team tables
    const existingMember = await prisma.teamMember.findUnique({ where: { email } });
    const existingLead = await prisma.team.findUnique({ where: { email } });

    if (existingMember || existingLead) {
      return { success: false, error: "Email is already registered." };
    }

    const passwordHash = hashPassword(password);

    const member = await prisma.teamMember.create({
      data: {
        fullName,
        email,
        passwordHash,
        teamId,
      },
    });

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (team) {
      // Create system notification message in general channel
      await prisma.message.create({
        data: {
          content: `System added ${fullName} (Team Member) to the console.`,
          channelId: "general",
          senderName: "System",
          senderAvatar: "⚙️",
          senderRole: "System",
          teamId: teamId,
          hackathonId: team.hackathonId,
        },
      });
    }

    await setTeamSessionCookie(member.id);
  } catch (err: any) {
    if (err.digest && err.digest.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("joinTeamAction error:", err);
    return { success: false, error: "Failed to join team. Please try again." };
  }

  redirect("/team/dashboard");
}
