// frontend/app/guru/page.tsx
import { Suspense } from "react";
import GuruTable from "./GuruTable";

async function fetchGurus() {
	const res = await fetch("http://localhost:5000/api/guru", {
		cache: "no-store",
	});
	if (!res.ok) throw new Error("Failed to fetch gurus");
	return res.json();
}

export default async function GuruPage() {
	const initialGurus = await fetchGurus();

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
			<div className="max-w-5xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Guru</h1>
				<Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
					<GuruTable initialGurus={initialGurus} />
				</Suspense>
			</div>
		</div>
	);
}
