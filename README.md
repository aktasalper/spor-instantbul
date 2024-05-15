# Sport Instantbul

TODO

## options.json

`options.json` dosyası, eklentinin pop-up ekranında listelenen otomasyon seçeneklerinin tanımlandığı yerdir. Bu dosyada, seçilen _branş_ seçeneğine bağlı **tesis** ve seçilen _tesis_ seçeneğine bağlı **salon** bilgileri tutuluyor.

### Tesis tanımları

Eğer kullanıcı **branş** olarak _Tenis_ seçtiyse,

- bu seçeneğin `<select>` tagındaki value karşılığı `59b7bd71-1aab-4751-8248-7af4a7790f8c`,
- `options.json` dosyada tanımlanma şekli ise:

```json
{
	"facility": {
		"59b7bd71-1aab-4751-8248-7af4a7790f8c": [
			{ "hidden": false, "name": "AVCILAR SPOR KOMPLEKSİ", "value": "5d4ef42f-e103-431e-94cb-ad5aa5201850" },
			{ "hidden": true, "name": "BOSTANCI SAHİL SPOR TESİSİ", "value": "bdef460a-c8b1-49de-9c5e-666d622b9458" }
		]
	}
}
```

- `"59b7bd71-1aab-4751-8248-7af4a7790f8c"` entry'sinde tanımlı **"AVCILAR SPOR KOMPLEKSİ"** gibi elementler ise _Tenis_ branşına ait **Tesis** seçenekleri.

### Salon Tanımları

**Tesis** tanımlarına benzer bir şekilde, **salon** bilgileri de bağlı olduğu tesis kodu ile tutuluyor.

Eğer kullanıcı **branş** olarak _Tenis_ seçtikten sonra, **tesis** olarak da _AVCILAR SPOR KOMPLEKSİ
AVCILAR SPOR KOMPLEKSİ_ seçtiyse,

- bu seçeneğin `<select>` tagındaki value karşılığı `5d4ef42f-e103-431e-94cb-ad5aa5201850`,
- `options.json` dosyada tanımlanma şekli ise:

```json
{
	"field:59b7bd71-1aab-4751-8248-7af4a7790f8c": {
		"5d4ef42f-e103-431e-94cb-ad5aa5201850": [
			{ "name": "AÇIK TENİS KORTU", "value": "f2cadde6-efe1-4a44-99d2-c26222a16231" },
			{ "name": "KAPALI TENİS KORTU 1", "value": "d503ef3d-dc63-44dc-8c45-1f2e5ba312e7" },
			{ "name": "KAPALI TENİS KORTU 2", "value": "39ab31e0-78ec-41ab-b866-c4040b357bd4" }
		]
	}
}
```

Buradaki key tanımı ise `field:<branch_value>` formatında, altındakiler ise tesisin _value_ değerine sahip. Yani **Tenis** branşında **AVCILAR SPOR KOMPLEKSİ
AVCILAR SPOR KOMPLEKSİ**'ne ait salon tanımları

```js
import options from "options.json";

const tennisFacilityDefinitions = options["field:59b7bd71-1aab-4751-8248-7af4a7790f8c"];
// Tenis branşı (59b7bd71-1aab-4751-8248-7af4a7790f8c) objesi

const avcilarFacilityFields = tennisFacilityDefinitions["5d4ef42f-e103-431e-94cb-ad5aa5201850"];
// Avcılar Tesisi'ne bağlı salonlar array'i

console.log(avcilarFacilityFields);
/*
[
    { "name": "AÇIK TENİS KORTU", "value": "f2cadde6-efe1-4a44-99d2-c26222a16231" },
    { "name": "KAPALI TENİS KORTU 1", "value": "d503ef3d-dc63-44dc-8c45-1f2e5ba312e7" },
    { "name": "KAPALI TENİS KORTU 2", "value": "39ab31e0-78ec-41ab-b866-c4040b357bd4" }
]
*/
```

şeklinde erişilebilir.
