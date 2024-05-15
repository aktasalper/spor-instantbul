import "../style.css";

import { useEffect, useState } from "react";

import { useStorage } from "@plasmohq/storage/hook";
import { sendToContentScript } from "@plasmohq/messaging";

import { useCountdown } from "./countdown/useCountdown";
import { getPage } from "~utils/getPage";
import { isAutomationPage } from "~utils/isAutomationPage";

import { Button } from "~components/Button";
import { Notification } from "~components/Notification";
import { Row, Column } from "~components/Flex";
import { NewUIWarning } from "./NewUIWarning";
import { ReservationPreferences } from "./ReservationPreferences/ReservationPreferences";
import { SessionPreferences } from "./SessionPreferences/SessionPreferences";

import { LightningIcon } from "~components/icons/LightningIcon";
import { TuningIcon } from "~components/icons/TuningIcon";

import { initialReservationPreferences, storageKey } from "~constant";

function IndexPopup() {
	const [automationState] = useStorage<AutomationState>(storageKey.automation);
	const [currentPage, setCurrentPage] = useState("");
	const canAutomate = isAutomationPage(currentPage);
	const currentAutomation = canAutomate ? automationState?.[currentPage] : null;

	const timeRemaining = useCountdown();

	useStorage(storageKey.preferences, (v) => v ?? initialReservationPreferences); // Init with default data to make it ready to use any time

	useEffect(() => {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			const activeTab = tabs[0];
			setCurrentPage(getPage(activeTab.url));
		});
	}, []);

	return (
		<div className='bg-primary-900 flex flex-col justify-between gap-2 p-2 min-w-[520px]'>
			<Notification type='info'>
				<h6 id='countdown'>{timeRemaining}</h6>
				<p>Sıradaki rezervasyon slotunun açılmasına kalan süre</p>
			</Notification>

			{currentPage === "anasayfa" && <NewUIWarning />}

			{canAutomate && (
				<Column className='rounded-s border-2 border-dashed border-primary-600 p-2 gap-3 text-white'>
					<Column>
						<h4>Otomasyon</h4>
						<span className='text-sub'>
							Aşağıdaki tercihlerinizi göz önünde bulundurarak, alınabilecek <strong>en son</strong> rezervasyon slotunu
							otomatik olarak seçer.
						</span>
					</Column>
					{currentPage === "satiskiralik" && <ReservationPreferences />}
					{currentPage === "uyeseanssecim" && <SessionPreferences />}

					<Button
						type='button'
						disabled={currentAutomation != null}
						onClick={() => sendToContentScript({ name: "automate" })}>
						<LightningIcon />
						Başlat
					</Button>
				</Column>
			)}
			<Row className='justify-end'>
				<Button onClick={() => chrome.runtime.openOptionsPage()}>
					<TuningIcon />
					Ayarlar
				</Button>
			</Row>
		</div>
	);
}

export default IndexPopup;
