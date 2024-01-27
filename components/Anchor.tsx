import type { ComponentPropsWithoutRef } from "react";

export const Anchor = (props: ComponentPropsWithoutRef<"a">) => (
	<a {...props} className='text-base text-primary-500 font-700 underline leading-150p' />
);
