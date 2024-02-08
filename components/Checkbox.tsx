import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";

interface Props extends ComponentPropsWithoutRef<"input"> {
	labelProps?: ComponentPropsWithoutRef<"label">;
}

const Checkmark = () => (
	<span className='checkmark relative h-[25px] w-[25px] mr-2 rounded-s border-2 border-solid border-neutral-900 bg-white transition-colors after:content-[""] after:absolute after:hidden after:top-[5px] after:left-[8px] after:w-[5px] after:h-[10px] after:border-solid after:border-white after:border-r-[2px] after:border-b-[2px] after:rotate-[45deg]' />
);

export function Checkbox({ labelProps, children, ...rest }: Props) {
	return (
		<label
			{...labelProps}
			className={["flex", "flex-row-reverse", "cursor-pointer", "w-max", labelProps?.className].join(" ")}>
			{children}
			<input
				{...rest}
				type='checkbox'
				className='absolute opacity-0 w-[0] h-[0] checked:font-700 disabled:text-neutral-700 disabled:bg-neutral-400 disabled:cursor-not-allowed'
			/>
			<Checkmark />
		</label>
	);
}
