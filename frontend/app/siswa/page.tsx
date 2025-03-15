import { Suspense } from "react";
import SiswaTable from "./SiswaTable";

async function fetchSiswas() {
	const res = await fetch("http://localhost:5000/api/siswa", {
		cache: "no-store", 
	});
	if (!res.ok) throw new Error("Failed to fetch siswas");
	return res.json();
}

export default async function SiswaPage() {
	const initialSiswas = await fetchSiswas();

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
			<div className="max-w-5xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Siswa</h1>
				<Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
					<SiswaTable initialSiswas={initialSiswas} />
				</Suspense>
			</div>
		</div>
	);
}

