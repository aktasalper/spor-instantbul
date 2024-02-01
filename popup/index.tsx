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
import { ReservationPreferences } from "./ReservationPreferences/ReservationPreferences";
import { SessionPreferences } from "./SessionPreferences/SessionPreferences";

import { LightningIcon } from "~components/icons/LightningIcon";
import { TuningIcon } from "~components/icons/TuningIcon";

import { initialReservationPreferences, storageKey } from "~constant";

function IndexPopup() {
	const [prefs] = useStorage(storageKey.preferences, (v) => v ?? initialReservationPreferences); // Init with default data to make it ready to use any time
	console.log("🚀 ~ IndexPopup ~ prefs:", prefs);

	const [automationState] = useStorage<AutomationState>(storageKey.automation);
	const [currentPage, setCurrentPage] = useState<AutomationPage | "">("");
	const canAutomate = isAutomationPage(currentPage);
	const currentAutomation = canAutomate ? automationState?.[currentPage] : null;

	const timeRemaining = useCountdown();

	useEffect(() => {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			var activeTab = tabs[0];
			setCurrentPage(getPage(activeTab.url) as any);
		});

		// remove();
	}, []);

	return (
		<div className='bg-primary-900 flex flex-col justify-between gap-2 p-2 min-w-[520px] min-h-[200px]'>
			<Notification type='info'>
				<h5>Bir sonraki rezervasyona kalan süre</h5>
				<span id='countdown'>{timeRemaining}</span>
			</Notification>

			{canAutomate && (
				<Column className='rounded-s border-2 border-dashed border-primary-600 p-2 gap-3 text-white'>
					<Column>
						<h4>Otomasyon</h4>
						<span className='text-sub'>
							Aşağıdaki tercihlerinizi göz önünde bulundurarak, mevcut <strong>en son</strong> seçenek üzerinden
							ilerler.
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
