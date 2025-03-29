"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import util from "util";

// const supabase = await createClient();

// TODO: ui update

export async function fetchAll() {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("notes")
		.select("*")
		.order("created_at", { ascending: true });

	if (error) {
		return { success: false, message: error.message };
	}

	const notes = data.map(
		// destructuring each object then storing only the rest
		({ user_id, ...rest }) => rest,
	);

	revalidatePath("/");

	return { success: true, data: notes };
}

export async function create(formData) {
	const defaultContent = {
		type: "doc",
		content: [
			{
				type: "paragraph",
				content: [
					{ type: "text", text: "Type here to get started..." },
				],
			},
		],
	};

	const note = {
		title: formData.get("title"),
		content: defaultContent,
	};

	if (!note.title)
		return {
			success: false,
			message: "title must be valid",
		};

	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("user is not logged in!");
	}

	const { data, error } = await supabase
		.from("notes")
		.insert({
			...note,
			user_id: user.id,
		})
		.select(); // to get the inserted note

	if (error) {
		return { success: false, message: error.message };
	}

	const { user_id, ...newEntry } = data[0];

	revalidatePath("/");

	return { success: true, data: newEntry };
}

export async function update(note) {
	if (!note.id || !note.content)
		return {
			success: false,
			message: "either id or content is not valid",
		};

	// sent json because of image attr showing as an anonymous function
	const content = JSON.parse(note.content)

	const entry = {...note, content}

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { data, error } = await supabase
		.from("notes")
		.update(entry)
		.match({
			id: note.id,
			user_id: user.id,
		})
		.select();

	if (error) {
		return { success: false, message: error.message };
	}

	const { user_id, ...updatedEntry } = data[0];

	revalidatePath("/");

	return { success: true, data: updatedEntry, message: 'Updated successfully!' };
}

export async function remove(note) {
	if (!note.id) return { success: false, message: "id must be valid" };

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const { data, error } = await supabase
		.from("notes")
		.delete()
		.match({
			id: note.id,
			user_id: user.id,
		})
		.select();

	if (error) {
		return { success: false, message: error.message };
	}

	const { user_id, ...deletedEntry } = data[0];

	revalidatePath("/");

	return { success: true, data: deletedEntry };
}

// this returns plain objects since nextjs can send only plain objects from server components so NextResponse.json() only will work for api route.js
