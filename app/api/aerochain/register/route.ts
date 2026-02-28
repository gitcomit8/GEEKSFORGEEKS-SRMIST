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

async function getAuthedUser(request: Request) {
	const authHeader = request.headers.get("authorization");
	const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
	if (!token) return null;

	const supabase = await createAdminClient();
	const { data, error } = await supabase.auth.getUser(token);
	if (error || !data.user) return null;
	return data.user;
}

// GET — fetch the current user's aerochain registration
export async function GET(request: Request) {
	const origin = request.headers.get("origin");
	const cors = getCorsHeaders(origin);

	const user = await getAuthedUser(request);
	if (!user) {
		return NextResponse.json(
			{ error: "Unauthorized" },
			{ status: 401, headers: cors },
		);
	}

	try {
		const supabase = await createAdminClient();
		const { data, error } = await supabase
			.from("aerochain_registrations")
			.select("*")
			.or(`user_id.eq.${user.id},lead_email.eq.${user.email}`)
			.limit(1);

		if (error) {
			console.error("Error fetching aerochain registration:", error);
			return NextResponse.json(
				{ error: "Failed to fetch registration" },
				{ status: 500, headers: cors },
			);
		}

		if (!data || data.length === 0) {
			return NextResponse.json({ registration: null }, { headers: cors });
		}

		const r = data[0];
		return NextResponse.json(
			{
				registration: {
					id: r.id,
					teamName: r.team_name,
					leadName: r.lead_name,
					leadEmail: r.lead_email,
					leadSemester: r.lead_semester,
					leadRegNo: r.lead_reg_no,
					leadPhone: r.lead_phone,
					leadSection: r.lead_section,
					leadDepartment: r.lead_department,
					leadAltEmail: r.lead_alt_email,
					members: r.members,
					submittedAt: r.created_at,
				},
			},
			{ headers: cors },
		);
	} catch (err) {
		console.error("Unexpected error in GET /register:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500, headers: cors },
		);
	}
}

// POST — create or update the user's aerochain registration
export async function POST(request: Request) {
	const origin = request.headers.get("origin");
	const cors = getCorsHeaders(origin);

	const user = await getAuthedUser(request);
	if (!user) {
		return NextResponse.json(
			{ error: "Unauthorized" },
			{ status: 401, headers: cors },
		);
	}

	try {
		const body = await request.json();
		const { formData, existingId } = body;

		if (!formData) {
			return NextResponse.json(
				{ error: "formData is required" },
				{ status: 400, headers: cors },
			);
		}

		const supabase = await createAdminClient();

		const payload = {
			user_id: user.id,
			team_name: formData.teamName,
			track: "AI",
			lead_name: formData.leadName,
			lead_email: formData.leadEmail,
			lead_semester: formData.leadSemester,
			lead_reg_no: formData.leadRegNo,
			lead_phone: formData.leadPhone,
			lead_section: formData.leadSection,
			lead_department: formData.leadDepartment,
			lead_alt_email: formData.leadAltEmail,
			members: formData.members,
			team_size: (formData.members?.length ?? 0) + 1,
			updated_at: new Date().toISOString(),
		};

		let result;

		if (existingId) {
			result = await supabase
				.from("aerochain_registrations")
				.update(payload)
				.eq("id", existingId)
				.select();
		} else {
			// Check for existing record by email to avoid duplicates
			const { data: existing } = await supabase
				.from("aerochain_registrations")
				.select("id")
				.eq("lead_email", formData.leadEmail)
				.limit(1);

			if (existing && existing.length > 0) {
				result = await supabase
					.from("aerochain_registrations")
					.update(payload)
					.eq("id", existing[0].id)
					.select();
			} else {
				result = await supabase
					.from("aerochain_registrations")
					.upsert(payload, { onConflict: "user_id" })
					.select();
			}
		}

		if (result.error) {
			console.error("Error saving aerochain registration:", result.error);
			return NextResponse.json(
				{ error: "Failed to save registration" },
				{ status: 500, headers: cors },
			);
		}

		return NextResponse.json(
			{ success: true, data: result.data?.[0] },
			{ headers: cors },
		);
	} catch (err) {
		console.error("Unexpected error in POST /register:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500, headers: cors },
		);
	}
}
