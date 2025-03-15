
import { Suspense } from "react";
import KelasTable from "./KelasTable";

async function fetchKelases() {
	const res = await fetch("http://localhost:5000/api/kelas", {
		cache: "no-store", 
	});
	if (!res.ok) throw new Error("Failed to fetch kelas");
	return res.json();
}

export default async function KelasPage() {
	const initialKelases = await fetchKelases();

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
			<div className="max-w-5xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Kelas</h1>
				<Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
					<KelasTable initialKelases={initialKelases} />
				</Suspense>
			</div>
		</div>
	);
}
