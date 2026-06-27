import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./db";

const SESSION_COOKIE_NAME = "hackos_session";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, originalHash] = storedHash.split(":");
  if (!salt || !originalHash) return false;
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === originalHash;
}

export async function setSessionCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: userId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  return sessionCookie?.value || null;
}

export async function getSessionUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  try {
    const user = await prisma.organizer.findUnique({
      where: { id: userId },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch session user:", error);
    return null;
  }
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

const TEAM_SESSION_COOKIE_NAME = "hackos_team_session";

export async function setTeamSessionCookie(teamId: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: TEAM_SESSION_COOKIE_NAME,
    value: teamId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function getSessionTeamId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(TEAM_SESSION_COOKIE_NAME);
  return sessionCookie?.value || null;
}

export async function getSessionTeam() {
  const teamIdOrMemberId = await getSessionTeamId();
  if (!teamIdOrMemberId) return null;

  try {
    // 1. Check if session ID belongs to a Team (Team Lead)
    const team = await prisma.team.findUnique({
      where: { id: teamIdOrMemberId },
      include: {
        hackathon: true,
        members: true,
      },
    });

    if (team) {
      return {
        ...team,
        isLead: true,
        user: { fullName: team.teamLeadName, email: team.email, avatarUrl: team.avatarUrl },
      };
    }

    // 2. Check if session ID belongs to a TeamMember
    const member = await prisma.teamMember.findUnique({
      where: { id: teamIdOrMemberId },
      include: {
        team: {
          include: {
            hackathon: true,
            members: true,
          },
        },
      },
    });

    if (member) {
      return {
        ...member.team,
        isLead: false,
        user: { fullName: member.fullName, email: member.email, avatarUrl: member.avatarUrl },
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch session team/member:", error);
    return null;
  }
}

export async function clearTeamSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TEAM_SESSION_COOKIE_NAME);
}

const JUDGE_SESSION_COOKIE_NAME = "hackos_judge_session";

export async function setJudgeSessionCookie(judgeId: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: JUDGE_SESSION_COOKIE_NAME,
    value: judgeId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function getSessionJudgeId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(JUDGE_SESSION_COOKIE_NAME);
  return sessionCookie?.value || null;
}

export async function getSessionJudge() {
  const judgeId = await getSessionJudgeId();
  if (!judgeId) return null;

  try {
    const judge = await prisma.judge.findUnique({
      where: { id: judgeId },
      include: {
        hackathon: {
          select: { id: true, title: true },
        },
      },
    });
    return judge;
  } catch (error) {
    console.error("Failed to fetch session judge:", error);
    return null;
  }
}

export async function clearJudgeSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(JUDGE_SESSION_COOKIE_NAME);
}


