export const BULAN_OPTIONS = [
	{ label: "Januari", value: "01" },
	{ label: "Februari", value: "02" },
	{ label: "Maret", value: "03" },
	{ label: "April", value: "04" },
	{ label: "Mei", value: "05" },
	{ label: "Juni", value: "06" },
	{ label: "Juli", value: "07" },
	{ label: "Agustus", value: "08" },
	{ label: "September", value: "09" },
	{ label: "Oktober", value: "10" },
	{ label: "November", value: "11" },
	{ label: "Desember", value: "12" },
];

export const TAHUN_OPTIONS = Array.from({ length: 5 }, (_, i) => {
	const year = new Date().getFullYear() - i;
	return { label: year.toString(), value: year.toString() };
});
