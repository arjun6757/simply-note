"use client";
import { useNotes } from "@/zustand/notes";
import { DeleteIcon } from "./icons/Icons";
import { fetchAll, remove } from "@/app/actions/notes";
import { createClient } from "@/utils/supabase/client";

export default function Notes() {
	const { notes, actions, focusingNote } = useNotes();
	const { saveNote, focusNote, unfocusNote, deleteNote, updateNotes } =
		actions;

	const formattedDate = ({ day, month, year }) => {
		const date = new Date(year, month, day).toLocaleString("en-IN", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});

		return date;
	};

	const handleDelete = async (note) => {
		const supabase = createClient();
		// TODO: need to use a timeout here for multiple clicks on delete or something and an alert component from shadcn
		if (focusingNote?.id === note.id) {
			unfocusNote();
			deleteNote(note.id); // for instant update

			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (user) {
				const response = await remove(note);
				if (!response.success) {
					console.error(response.message);
					updateNotes([...notes, note]);
				}
			}
		} else {
			deleteNote(note.id);

			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (user) {
				const response = await remove(note);

				if (!response.success) {
					console.error(response.message);
					updateNotes([...notes, note]);
				}
			}
		}
	};

	return (
		<ul className="flex flex-col h-full overflow-y-auto gap-2 p-2 scroll-smooth scrollbar-thin">
			{notes.length === 0 ? (
				<p className="w-full h-full flex justify-center items-center">
					It&apos;s empty here!
				</p>
			) : (
				notes.map((note) => (
					<li key={note.id} className="w-full">
						<div
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									if (focusingNote?.id === note.id) {
										unfocusNote();
									} else {
										focusNote(note);
									}
								}
							}}
							onClick={() => {
								if (focusingNote?.id === note.id) {
									unfocusNote();
								} else {
									focusNote(note);
								}
							}}
							className={`${focusingNote?.id === note.id ? "bg-[#f0f0f0f0] sm:bg-gray-50 dark:bg-[#171717]" : null} focus-visible:outline-offset-4 focus-visible:outline-outline cursor-default w-full border rounded-md px-2 py-1 overflow-hidden shadow-xs`}
						>
							<p className="truncate text-text">{note.title}</p>
							<div className="flex justify-between items-center">
								<span className="truncate text-xs text-gray-500 dark:text-neutral-400">
									{formattedDate({
										day: note.created_at
											.split("-")[2]
											.split("T")[0],
										// it returns 1 based indexing but needs 0 based so -1
										month:
											note.created_at.split("-")[1] - 1,
										year: note.created_at.split("-")[0],
									})}
								</span>
								<button
									onClick={async (e) => {
										e.preventDefault();
										e.stopPropagation();
										await handleDelete(note);
									}}
									className="p-1.5 rounded-full hover:bg-[#f0f0f0] hover:dark:bg-[#272727] cursor-pointer group focus-visible:outline-gray-500"
								>
									<DeleteIcon className="w-3 h-3 text-red-500 group-hover:text-red-600" />
								</button>
							</div>
						</div>
					</li>
				))
			)}
		</ul>
	);
}
