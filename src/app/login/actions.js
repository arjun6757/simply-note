"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function handleEmailLogin(formData) {
	const supabase = await createClient();

	const data = {
		email: formData.get("email"),
		password: formData.get("password"),
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		console.error(error);
		return redirect("/login");
	}

	revalidatePath("/", "layout");
	return redirect("/");
}

export async function handleSignUp(formData) {
	const supabase = await createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get("email"),
		password: formData.get("password"),
		options: {
			data: {
				full_name: formData.get("username"),
			},
		},
	};

	const { error } = await supabase.auth.signUp(data);

	// auto confirmation is off so it will return a user if everything is okay which means it can't stay in /login so it will go to => /

	if (error) {
		return redirect("/login");
	}

	revalidatePath("/", "layout");

	// user needs to sign in before going to the app route
	return redirect("/login");
}

export async function handleSignOut() {
	const supabase = await createClient();

	await supabase.auth.signOut();

	// return redirect("/login");
	revalidatePath("/", "page");
	// i want to stay there even when the user is logged off
}

export async function handleOAuth(provider) {
	if (!provider) {
		// should return error but for now it's not needed
		redirect("/login");
	}

	const supabase = await createClient();


	// this needs change too
	const redirectURL = "http://localhost:3000/auth/callback";

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: provider,
		options: {
			redirectTo: redirectURL,
		},
	});

	if (error) {
		console.error(error.message);
		return redirect("/login");
	}

	return redirect(data.url);
}
