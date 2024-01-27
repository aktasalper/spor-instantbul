import "../style.css";

import { useStorage } from "@plasmohq/storage/hook";
import { sendToContentScript } from "@plasmohq/messaging";

import { useCountdown } from "./countdown/useCountdown";

import { Button } from "~components/Button";
import { LightningIcon } from "~components/icons/LightningIcon";
import { Notification } from "~components/Notification";
import { Row, Column } from "~components/Flex";

import { ReservationPreferences } from "./ReservationPreferences/ReservationPreferences";

import { storageKey } from "~constant";

function IndexPopup() {
	const timeRemaining = useCountdown();
	const [automationState] = useStorage(storageKey.automation);

	return (
		<div className='bg-primary-900 flex flex-col gap-2 p-2 min-w-[520px] min-h-[200px]'>
			<Notification type='info'>
				<h5>Bir sonraki rezervasyona kalan süre</h5>
				<span id='countdown'>{timeRemaining}</span>
			</Notification>

			<Column className='rounded-s border-2 border-dashed border-primary-600 p-2 gap-3 text-white'>
				<Column>
					<h4>Otomasyon</h4>
					<Row className='items-center'>
						<span className='text-sub'>
							Aşağıdaki tercihlerinizi göz önünde bulundurarak, mevcut <strong>en son</strong> rezervasyonu sepetinize
							ekler.
						</span>
						<Button
							type='button'
							disabled={automationState != null}
							onClick={() => sendToContentScript({ name: "automate" })}>
							<LightningIcon />
							Başlat
						</Button>
					</Row>
				</Column>
				<ReservationPreferences />
			</Column>
		</div>
	);
}

export default IndexPopup;
