"use client";

import { useState, FormEvent } from "react";

interface Guru {
	id: number;
	name: string;
	kelas: string;
}

export default function GuruTable({ initialGurus }: { initialGurus: Guru[] }) {
	const [gurus, setGurus] = useState<Guru[]>(initialGurus);
	const [filterNama, setFilterNama] = useState<string>("");
	const [filterKelas, setFilterKelas] = useState<string>("");
	const [nama, setNama] = useState<string>("");
	const [kelas, setKelas] = useState<string>("");
	const [editingGuru, setEditingGuru] = useState<Guru | null>(null);

	const filteredGurus = gurus.filter(
		(g) =>
			g.name.toLowerCase().includes(filterNama.toLowerCase()) &&
			g.kelas.toLowerCase().includes(filterKelas.toLowerCase()),
	);

	const handleAddOrUpdateGuru = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const method = editingGuru ? "PUT" : "POST";
			const url = editingGuru
				? `http://localhost:5000/api/guru/${editingGuru.id}`
				: "http://localhost:5000/api/guru";
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: nama, kelas }),
			});
			if (res.ok) {
				const updatedGuru = await res.json();
				if (editingGuru) {
					setGurus(gurus.map((g) => (g.id === editingGuru.id ? updatedGuru : g)));
				} else {
					setGurus([...gurus, updatedGuru]);
				}
				setNama("");
				setKelas("");
				setEditingGuru(null);
			} else {
				alert(editingGuru ? "Gagal memperbarui guru." : "Gagal menambahkan guru.");
			}
		} catch (error) {
			console.error(error);
			alert("Error saat memproses data.");
		}
	};

	const handleEdit = (guru: Guru) => {
		setEditingGuru(guru);
		setNama(guru.name);
		setKelas(guru.kelas);
	};

	const handleDelete = async (id: number) => {
		if (confirm("Apakah Anda yakin ingin menghapus guru ini?")) {
			try {
				const res = await fetch(`http://localhost:5000/api/guru/${id}`, {
					method: "DELETE",
				});
				if (res.ok) {
					setGurus(gurus.filter((g) => g.id !== id));
				} else {
					alert("Gagal menghapus guru.");
				}
			} catch (error) {
				console.error(error);
				alert("Error saat menghapus guru.");
			}
		}
	};

	return (
		<>
			{/* Filter Section */}
			<div className="mb-6 bg-white p-4 rounded-lg shadow-md">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-gray-700 mb-1">Filter Nama</label>
						<input
							type="text"
							placeholder="Cari berdasarkan nama"
							value={filterNama}
							onChange={(e) => setFilterNama(e.target.value)}
							className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
					</div>
					<div>
						<label className="block text-gray-700 mb-1">Filter Kelas</label>
						<input
							type="text"
							placeholder="Cari berdasarkan kelas"
							value={filterKelas}
							onChange={(e) => setFilterKelas(e.target.value)}
							className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
					</div>
				</div>
			</div>

			{/* Form Section */}
			<form
				onSubmit={handleAddOrUpdateGuru}
				className="mb-6 bg-white p-4 rounded-lg shadow-md"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-gray-700 mb-1">Nama Guru</label>
						<input
							type="text"
							placeholder="Masukkan nama guru"
							value={nama}
							onChange={(e) => setNama(e.target.value)}
							className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
						/>
					</div>
					<div>
						<label className="block text-gray-700 mb-1">Kelas</label>
						<input
							type="text"
							placeholder="Masukkan kelas (misal: A)"
							value={kelas}
							onChange={(e) => setKelas(e.target.value)}
							className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
						/>
					</div>
				</div>
				<button
					type="submit"
					className="mt-4 w-full md:w-auto px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm"
				>
					{editingGuru ? "Perbarui Guru" : "Tambah Guru"}
				</button>
				{editingGuru && (
					<button
						type="button"
						onClick={() => {
							setEditingGuru(null);
							setNama("");
							setKelas("");
						}}
						className="mt-4 ml-2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-sm"
					>
						Batal
					</button>
				)}
			</form>

			{/* Tabel Guru */}
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<table className="min-w-full">
					<thead className="bg-blue-600 text-white">
						<tr>
							<th className="p-4 text-left">ID</th>
							<th className="p-4 text-left">Nama</th>
							<th className="p-4 text-left">Kelas</th>
							<th className="p-4 text-left">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{filteredGurus.length > 0 ? (
							filteredGurus.map((g) => (
								<tr
									key={g.id}
									className="border-b hover:bg-gray-50 transition-colors"
								>
									<td className="p-4">{g.id}</td>
									<td className="p-4">{g.name}</td>
									<td className="p-4">{g.kelas}</td>
									<td className="p-4 flex gap-2">
										<button
											onClick={() => handleEdit(g)}
											className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
										>
											Edit
										</button>
										<button
											onClick={() => handleDelete(g.id)}
											className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
										>
											Hapus
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={4} className="p-4 text-center text-gray-500">
									Tidak ada data guru.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</>
	);
}
