import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { computeBadges } from "@/lib/badges";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json([], { status: 401 });

  const progressions = await prisma.progressions.findMany({
    where: { userId: user.id },
  });

  const badges = computeBadges(progressions);
  return NextResponse.json(badges);
}
