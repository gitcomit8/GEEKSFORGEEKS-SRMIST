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
		const { email } = await request.json();

		if (!email) {
			return NextResponse.json(
				{ error: "Email is required" },
				{ status: 400, headers: cors },
			);
		}

		const supabase = await createClient();
		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: { shouldCreateUser: true },
		});

		if (error) {
			console.error("OTP send error:", error);
			return NextResponse.json(
				{ error: "Failed to send OTP. Please try again." },
				{ status: 500, headers: cors },
			);
		}

		return NextResponse.json({ success: true }, { headers: cors });
	} catch (err) {
		console.error("Unexpected error in send-otp:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500, headers: cors },
		);
	}
}
