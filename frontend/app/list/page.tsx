
import { Suspense } from "react";
import DataTable from "./DataTable";

interface Siswa {
	id: number;
	name: string;
	kelas: string;
}

interface Kelas {
	id: number;
	name: string;
}

interface Guru {
	id: number;
	name: string;
	kelas: string;
}

async function fetchAllData(): Promise<{
	siswas: Siswa[];
	kelases: Kelas[];
	gurus: Guru[];
}> {
	const res = await fetch("http://localhost:5000/api/list", {
		cache: "no-store", 
	});
	if (!res.ok) throw new Error("Failed to fetch data");
	return res.json();
}

export default async function AllPage() {
	const data = await fetchAllData();

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
			<div className="max-w-5xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-800 mb-6">Data Lengkap</h1>
				<Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
					<DataTable initialData={data} />
				</Suspense>
			</div>
		</div>
	);
}
