import type { PagePreferences } from "./default";

import "../style.css";

import { useStorage } from "@plasmohq/storage/hook";

import { Anchor } from "~components/Anchor";
import { Checkbox } from "~components/Checkbox";
import { Column } from "~components/Flex";

import { storageKey } from "~constant";
import { defaultPreferences } from "./default";

export default function OptionsPage() {
	const [pagePreferences, setPagePreferences] = useStorage<PagePreferences>(storageKey.pagePreferences, (v) => {
		return v ?? defaultPreferences;
	});

	return (
		<main className='p-3'>
			<Column className='gap-4'>
				<Column>
					<h1>Tercihler</h1>
					<p className='text-sub'>
						Bu sayfadan,{" "}
						<Anchor href='https://online.spor.istanbul/' target='_blank'>
							https://online.spor.istanbul/
						</Anchor>{" "}
						web sitesindeki kullanıcı deneyiminizi etkileyen içerikler hakkında tercihlerde bulunabilirsiniz.
					</p>
				</Column>

				<Column>
					<Checkbox
						checked={pagePreferences.anasayfa["hide-modal"]}
						onChange={(e) => setPagePreferences((prev) => ({ ...prev, anasayfa: { "hide-modal": e.target.checked } }))}>
						<p>
							<b>Anasayfa</b>'da açılan duyuru/reklam ekranını gizle
						</p>
					</Checkbox>

					<Checkbox
						checked={pagePreferences.satiskiralik["hide-warning"]}
						onChange={(e) =>
							setPagePreferences((prev) => ({ ...prev, satiskiralik: { "hide-warning": e.target.checked } }))
						}>
						<p>
							<b>Kiralama Hizmetleri</b> sayfasındaki bilgilendirmeyi gizle
						</p>
					</Checkbox>
				</Column>
			</Column>
		</main>
	);
}
