import type { ComponentPropsWithoutRef } from "react";

export const Row = (props: ComponentPropsWithoutRef<"div">) => (
	<div {...props} className={["flex flex-row gap-2", props.className].join(" ")} />
);
export const Column = (props: ComponentPropsWithoutRef<"div">) => (
	<div {...props} className={["flex flex-col gap-2", props.className].join(" ")} />
);

export const Flex = {
	Row,
	Column
};
