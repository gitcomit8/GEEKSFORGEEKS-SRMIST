import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
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

export async function POST(request: Request) {
	const origin = request.headers.get("origin");
	const cors = getCorsHeaders(origin);

	try {
		const { email, token } = await request.json();

		if (!email || !token) {
			return NextResponse.json(
				{ error: "Email and token are required" },
				{ status: 400, headers: cors },
			);
		}

		const supabase = await createClient();
		const { data, error } = await supabase.auth.verifyOtp({
			email,
			token,
			type: "email",
		});

		if (error || !data.session || !data.user) {
			return NextResponse.json(
				{ error: error?.message ?? "Invalid or expired OTP" },
				{ status: 401, headers: cors },
			);
		}

		return NextResponse.json(
			{
				access_token: data.session.access_token,
				refresh_token: data.session.refresh_token,
				user: {
					id: data.user.id,
					email: data.user.email,
				},
			},
			{ headers: cors },
		);
	} catch (err) {
		console.error("Unexpected error in verify-otp:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500, headers: cors },
		);
	}
}
