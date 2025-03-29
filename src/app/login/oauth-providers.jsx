"use client";

import { GithubIcon, GoogleIcon } from "@/components/icons/Icons";
import { Button } from "@/components/ui/button";
import { handleOAuth } from "./actions";

const createProvider = (name, displayName, JSXIconElement) => ({
	name,
	displayName,
	icon: <JSXIconElement className="text-gray-700 w-4 h-4" />,
});

export function OAuthButtons() {
	const google = createProvider("google", "Google", GoogleIcon);
	const github = createProvider("github", "Github", GithubIcon);
	const providers = [google, github];

	return (
		<div className="grid grid-cols-2 gap-2">
			{providers.map((provider, pid) => (
				<button
					onClick={async () => await handleOAuth(provider.name)}
					key={pid}
					className="outline-offset-2 focus:outline-2 focus:dark:outline-gray-500 flex gap-2 justify-center items-center cursor-pointer text-xs bg-white hover:bg-gray-50 text-black h-9 px-4 py-2 has-[>svg]:px-3 rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 border border-[#ddd]"
				>
					{provider.icon}
					{provider.displayName}
				</button>
			))}
		</div>
	);
}
