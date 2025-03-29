"use client"

import { useContext } from "react";
import { useEffect, useState } from "react";
import { createContext } from "react";

const MountContext = createContext(null);

export default function MountProvider({ children }) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, []); // only runs once

	return (
		<MountContext.Provider value={{ mounted }}>
			{children}
		</MountContext.Provider>
	);
}

export const useMount = () => {
	return useContext(MountContext)
}