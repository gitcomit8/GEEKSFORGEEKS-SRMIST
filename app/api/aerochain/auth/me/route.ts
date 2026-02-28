import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";
import { getCorsHeaders, handlePreflight } from "@/lib/cors";

export async function OPTIONS(request: Request) {
	return (
		handlePreflight(request) ??
		new Response(null, {
			status: 204,
			headers: getCorsHeaders(request.headers.get("origin")),
		})
	);
}

export async function GET(request: Request) {
	const origin = request.headers.get("origin");
	const cors = getCorsHeaders(origin);

	const authHeader = request.headers.get("authorization");
	const token = authHeader?.startsWith("Bearer ")
		? authHeader.slice(7)
		: null;

	if (!token) {
		return NextResponse.json(
			{ error: "Missing authorization token" },
			{ status: 401, headers: cors },
		);
	}

	try {
		const supabase = await createAdminClient();
		const { data, error } = await supabase.auth.getUser(token);

		if (error || !data.user) {
			return NextResponse.json(
				{ error: "Invalid or expired token" },
				{ status: 401, headers: cors },
			);
		}

		return NextResponse.json(
			{
				user: {
					id: data.user.id,
					email: data.user.email,
				},
			},
			{ headers: cors },
		);
	} catch (err) {
		console.error("Unexpected error in auth/me:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500, headers: cors },
		);
	}
}
