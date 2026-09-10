//#region node_modules/.nitro/vite/services/ssr/assets/file-DwLCodyO.js
var MAX_PROOF_BYTES = 18e4;
async function readProofFile(file) {
	if (file.size > MAX_PROOF_BYTES) return { name: file.name };
	const dataUrl = await new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Gagal membaca berkas"));
		reader.readAsDataURL(file);
	});
	return {
		name: file.name,
		dataUrl
	};
}
//#endregion
export { readProofFile as t };
