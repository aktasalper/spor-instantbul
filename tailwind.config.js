/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: "jit",
	darkMode: "class",
	content: ["./**/*.tsx"],
	plugins: [],
	theme: {
		spacing: {
			1: "4px",
			2: "8px",
			3: "16px",
			4: "24px",
			5: "32px"
		},
		borderRadius: {
			s: "7px",
			m: "10px",
			l: "15px"
		},
		fontSize: {
			base: "18px",
			sub: "16px"
		},
		fontWeight: {
			300: "300",
			400: "400",
			700: "700"
		},

		colors: {
			white: "#f8f8f8",
			black: "#111111",
			primary: {
				100: "#ebecff",
				200: "#d3d5fe",
				300: "#a7acfd",
				400: "#7b82fc",
				500: "#4f59fb",
				600: "#333cde",
				700: "#262da7",
				800: "#191e6f",
				900: "#0d0f38"
			},
			red: {
				100: "#ffe7e7",
				200: "#ffc9c9",
				300: "#ff9494",
				400: "#ff5e5e",
				500: "#ff2828",
				600: "#e20c0c",
				700: "#aa0909",
				800: "#710606",
				900: "#390303"
			},
			green: {
				100: "#e8f4e6",
				200: "#cce7c7",
				300: "#99d090",
				400: "#66b858",
				500: "#34a120",
				600: "#178404",
				700: "#116303",
				800: "#0c4202",
				900: "#062101"
			},
			yellow: {
				100: "#fef4e8",
				200: "#fde6cb",
				300: "#facd97",
				400: "#f8b462",
				500: "#f59c2e",
				600: "#d97f12",
				700: "#a35f0d",
				800: "#a35f0d",
				900: "#362004"
			},
			neutral: {
				100: "#f8f8f8",
				200: "#efefef",
				300: "#dfdfdf",
				400: "#cecece",
				500: "#bebebe",
				600: "#a2a2a2",
				700: "#797979",
				800: "#515151",
				900: "#282828"
			}
		},
		extend: { lineHeight: { "150p": "150%" }, content: { empty: "" } }
	}
};
