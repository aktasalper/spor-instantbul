import type { PropsWithChildren } from "react";

import { WarningIcon } from "./icons/WarningIcon";
import { InfoIcon } from "./icons/InfoIcon";

type NotificationType = "info" | "warning";

interface NotificationProps extends PropsWithChildren {
	type: NotificationType;
}

function Icon({ type }: { type: NotificationType }) {
	switch (type) {
		case "warning":
			return <WarningIcon />;
		case "info":
		default:
			return <InfoIcon />;
	}
}

function getColorClasses(type: NotificationType) {
	switch (type) {
		case "warning":
			return "bg-yellow-300 border-yellow-500";
		case "info":
			return "bg-primary-300 border-primary-500";
		default:
			return undefined;
	}
}

export function Notification({ type, children }: NotificationProps) {
	return (
		<article
			className={["flex flex-row gap-2 p-2 rounded-s border-[2px] border-solid", getColorClasses(type)].join(" ")}>
			<Icon type={type} />
			<div className='flex flex-col gap-2 text-neutral-900'>{children}</div>
		</article>
	);
}
