import type { PropsWithChildren } from "react";
import { InfoIcon } from "./icons/InfoIcon";

interface NotificationProps extends PropsWithChildren {
	type: "info";
}

function Icon({ type }: Pick<NotificationProps, "type">) {
	switch (type) {
		case "info":
		default:
			return <InfoIcon />;
	}
}

export function Notification({ type, children }: NotificationProps) {
	return (
		<article
			className={[
				"flex flex-row gap-2 p-2 rounded-s border-[2px] border-solid",
				type === "info" ? "bg-primary-300 border-primary-500" : undefined
			].join(" ")}>
			<Icon type={type} />
			<div className='flex flex-col gap-2 text-neutral-900'>{children}</div>
		</article>
	);
}
