"use client";

import { useState } from "react";

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

export default function DataTable({
	initialData,
}: {
	initialData: { siswas: Siswa[]; kelases: Kelas[]; gurus: Guru[] };
}) {
	const [data, setData] = useState(initialData);
	const [filterKelas, setFilterKelas] = useState<string>("");

	
	const filteredSiswas = filterKelas
		? data.siswas.filter((s) => s.kelas.toLowerCase().includes(filterKelas.toLowerCase()))
		: data.siswas;
	const filteredGurus = filterKelas
		? data.gurus.filter((g) => g.kelas.toLowerCase().includes(filterKelas.toLowerCase()))
		: data.gurus;

	return (
		<>
			{/* Filter Section */}
			<div className="mb-6 bg-white p-4 rounded-lg shadow-md">
				<div className="flex items-center gap-3">
					<input
						type="text"
						placeholder="Filter berdasarkan kelas (misal: A)"
						value={filterKelas}
						onChange={(e) => setFilterKelas(e.target.value)}
						className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
					/>
					<button
						onClick={() => {}} 
						className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
					>
						Filter
					</button>
				</div>
			</div>

			{/* Siswa Section */}
			<div className="mb-6 bg-white p-4 rounded-lg shadow-md">
				<h2 className="text-xl font-semibold text-gray-800 mb-3">Siswa</h2>
				{filteredSiswas.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="min-w-full">
							<thead className="bg-blue-600 text-white">
								<tr>
									<th className="p-3 text-left">ID</th>
									<th className="p-3 text-left">Nama</th>
									<th className="p-3 text-left">Kelas</th>
								</tr>
							</thead>
							<tbody>
								{filteredSiswas.map((s) => (
									<tr
										key={s.id}
										className="border-b hover:bg-gray-50 transition-colors"
									>
										<td className="p-3">{s.id}</td>
										<td className="p-3">{s.name}</td>
										<td className="p-3">{s.kelas}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<p className="text-gray-500">Tidak ada data siswa.</p>
				)}
			</div>

			{/* Kelas Section */}
			<div className="mb-6 bg-white p-4 rounded-lg shadow-md">
				<h2 className="text-xl font-semibold text-gray-800 mb-3">Kelas</h2>
				{data.kelases.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="min-w-full">
							<thead className="bg-blue-600 text-white">
								<tr>
									<th className="p-3 text-left">ID</th>
									<th className="p-3 text-left">Nama</th>
								</tr>
							</thead>
							<tbody>
								{data.kelases.map((k) => (
									<tr
										key={k.id}
										className="border-b hover:bg-gray-50 transition-colors"
									>
										<td className="p-3">{k.id}</td>
										<td className="p-3">{k.name}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<p className="text-gray-500">Tidak ada data kelas.</p>
				)}
			</div>

			{/* Guru Section */}
			<div className="bg-white p-4 rounded-lg shadow-md">
				<h2 className="text-xl font-semibold text-gray-800 mb-3">Guru</h2>
				{filteredGurus.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="min-w-full">
							<thead className="bg-blue-600 text-white">
								<tr>
									<th className="p-3 text-left">ID</th>
									<th className="p-3 text-left">Nama</th>
									<th className="p-3 text-left">Kelas</th>
								</tr>
							</thead>
							<tbody>
								{filteredGurus.map((g) => (
									<tr
										key={g.id}
										className="border-b hover:bg-gray-50 transition-colors"
									>
										<td className="p-3">{g.id}</td>
										<td className="p-3">{g.name}</td>
										<td className="p-3">{g.kelas}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<p className="text-gray-500">Tidak ada data guru.</p>
				)}
			</div>
		</>
	);
}
