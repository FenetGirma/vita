import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, name, role, certification_id } = body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role || "user",
          certification_id: certification_id || null,
        },
      },
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ user: data.user }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
