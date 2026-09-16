import { auth } from "@/lib/auth";
import { PAUSE_ACTION_MESSAGE_FR } from "@/lib/pause-notice";
import { isPlatformOnHold } from "@/lib/platform-status";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const { GET, POST: authPost } = toNextJsHandler(auth.handler);

export { GET };

// Sign-up is also disabled at the Better Auth config level
// (emailAndPassword.disableSignUp / socialProviders.*.disableSignUp), but we
// still short-circuit here so the sign-up endpoint returns a clear 403
// without ever reaching Better Auth's internals, and without touching the
// database, while the platform is on hold.
export async function POST(request: NextRequest) {
    if (isPlatformOnHold() && request.nextUrl.pathname.endsWith("/sign-up/email")) {
        return NextResponse.json(
            { error: PAUSE_ACTION_MESSAGE_FR },
            { status: 403 }
        );
    }

    return authPost(request);
}