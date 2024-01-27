import type { ComponentPropsWithoutRef } from "react";
import "../style.css";

export const Button = (props: ComponentPropsWithoutRef<"button">) => (
	<button
		{...props}
		className='inline-flex justify-center items-center py-2 px-3 gap-2 bg-primary-500 text-white text-sub font-700 leading-[130%] rounded-s border-none cursor-pointer transition-colors hover:bg-primary-700 focus:bg-primary-800 disabled:text-neutral-700 disabled:bg-neutral-400 disabled:cursor-not-allowed'
	/>
);
