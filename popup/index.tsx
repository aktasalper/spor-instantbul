import { useStorage } from "@plasmohq/storage/hook";
import { sendToContentScript } from "@plasmohq/messaging";

import { Alert } from "~components/Alert";

import { useCountdown } from "./countdown/useCountdown";
import { storageKey } from "~constant";
import { LightningIcon } from "~components/icons/LightningIcon";
import { ReservationPreferences } from "./ReservationPreferences/ReservationPreferences";

import "../CORE.css";
import "./index.css";

function IndexPopup() {
	const timeRemaining = useCountdown();
	const [automationState] = useStorage(storageKey.automation);

	return (
		<div>
			<Alert>
				<h5>Bir sonraki rezervasyona kalan süre</h5>
				<span id='countdown'>{timeRemaining}</span>
			</Alert>

			<div className='column container'>
				<section className='column hidden'>
					<div className='column'>
						<h4>Otomasyon</h4>
						<div className='row automation'>
							<span className='form-hint'>
								Aşağıdaki tercihlerinizi göz önünde bulundurarak, mevcut <strong>en son</strong> rezervasyonu sepetinize
								ekler.
							</span>
							<button
								type='button'
								disabled={automationState != null}
								onClick={() => sendToContentScript({ name: "automate" })}>
								<LightningIcon />
								Başlat
							</button>
						</div>
					</div>
					<ReservationPreferences />
				</section>
				{/* <button id='options' type='button'>
					Ayarlar
				</button> */}
			</div>
		</div>
	);
}

export default IndexPopup;
