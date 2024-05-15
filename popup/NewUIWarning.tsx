import { Column } from "~components/Flex";
import { Button } from "~components/Button";
import { Notification } from "~components/Notification";

import { ArrowRight } from "~components/icons/ArrowRight";

export const NewUIWarning = () => (
	<Column className='rounded-s border-2 border-dashed border-yellow-600 p-2 gap-3 text-white'>
		<Notification type='warning'>
			<h5>Yeni Arayüz</h5>
			<p>
				<strong>Spor İstanbul</strong> web sitesi yeni arayüze geçiş yaptığı için anasayfada otomasyon henüz{" "}
				<em>desteklenmemektedir</em>.
			</p>
		</Notification>
		<p>
			Otomatik rezervasyon işlemi yapabileceğiniz sayfalar aşağıda listelenmiştir. Belirtilen sayfalarda eklenti
			penceresini açarak işleminizi gerçekleştirebilirsiniz:
		</p>
		<ul>
			<li className='flex flex-row items-center gap-2'>
				<ArrowRight />
				<Button
					onClick={() => {
						chrome.tabs.update(undefined, { url: "https://online.spor.istanbul/satiskiralik" });
						window.close();
					}}>
					Kiralama
				</Button>
			</li>
		</ul>
	</Column>
);
