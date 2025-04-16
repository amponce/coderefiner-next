import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { redirect } from "next/navigation";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }
  return user;
}

export async function requireTeamAccess(teamId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }

  const { prisma } = await import("@/app/lib/prisma");
  const teamMember = await prisma.teamMember.findFirst({
    where: {
      team_id: teamId,
      user_id: user.id,
    },
  });

  if (!teamMember) {
    redirect("/dashboard");
  }

  return teamMember;
}

export async function requireProjectAccess(projectId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }

  const { prisma } = await import("@/app/lib/prisma");
  const projectMember = await prisma.projectMember.findFirst({
    where: {
      project_id: projectId,
      user_id: user.id,
    },
  });

  if (!projectMember) {
    redirect("/dashboard");
  }

  return projectMember;
} 