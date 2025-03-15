"use client";

import { useState, FormEvent } from "react";

interface Kelas {
	id: number;
	name: string;
}

export default function KelasTable({ initialKelases }: { initialKelases: Kelas[] }) {
	const [kelases, setKelases] = useState<Kelas[]>(initialKelases);
	const [nama, setNama] = useState<string>("");
	const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);

	const handleAddOrUpdateKelas = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const method = editingKelas ? "PUT" : "POST";
			const url = editingKelas
				? `http://localhost:5000/api/kelas/${editingKelas.id}`
				: "http://localhost:5000/api/kelas";
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: nama }),
			});
			if (res.ok) {
				const updatedKelas = await res.json();
				if (editingKelas) {
					setKelases(kelases.map((k) => (k.id === editingKelas.id ? updatedKelas : k)));
				} else {
					setKelases([...kelases, updatedKelas]);
				}
				setNama("");
				setEditingKelas(null);
			} else {
				alert(editingKelas ? "Gagal memperbarui kelas." : "Gagal menambahkan kelas.");
			}
		} catch (error) {
			console.error(error);
			alert("Error saat memproses data.");
		}
	};

	const handleEdit = (kelas: Kelas) => {
		setEditingKelas(kelas);
		setNama(kelas.name);
	};

	const handleDelete = async (id: number) => {
		if (confirm("Apakah Anda yakin ingin menghapus kelas ini?")) {
			try {
				const res = await fetch(`http://localhost:5000/api/kelas/${id}`, {
					method: "DELETE",
				});
				if (res.ok) {
					setKelases(kelases.filter((k) => k.id !== id));
				} else {
					alert("Gagal menghapus kelas.");
				}
			} catch (error) {
				console.error(error);
				alert("Error saat menghapus kelas.");
			}
		}
	};

	return (
		<>
			{/* Form Section */}
			<form
				onSubmit={handleAddOrUpdateKelas}
				className="mb-6 bg-white p-4 rounded-lg shadow-md"
			>
				<div className="grid grid-cols-1 gap-4">
					<div>
						<label className="block text-gray-700 mb-1">Nama Kelas</label>
						<input
							type="text"
							placeholder="Masukkan nama kelas (misal: A)"
							value={nama}
							onChange={(e) => setNama(e.target.value)}
							className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
						/>
					</div>
				</div>
				<button
					type="submit"
					className="mt-4 w-full md:w-auto px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm"
				>
					{editingKelas ? "Perbarui Kelas" : "Tambah Kelas"}
				</button>
				{editingKelas && (
					<button
						type="button"
						onClick={() => {
							setEditingKelas(null);
							setNama("");
						}}
						className="mt-4 ml-2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-sm"
					>
						Batal
					</button>
				)}
			</form>

			{/* Tabel Kelas */}
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<table className="min-w-full">
					<thead className="bg-blue-600 text-white">
						<tr>
							<th className="p-4 text-left">ID</th>
							<th className="p-4 text-left">Nama</th>
							<th className="p-4 text-left">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{kelases.length > 0 ? (
							kelases.map((k) => (
								<tr
									key={k.id}
									className="border-b hover:bg-gray-50 transition-colors"
								>
									<td className="p-4">{k.id}</td>
									<td className="p-4">{k.name}</td>
									<td className="p-4 flex gap-2">
										<button
											onClick={() => handleEdit(k)}
											className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
										>
											Edit
										</button>
										<button
											onClick={() => handleDelete(k.id)}
											className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
										>
											Hapus
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={3} className="p-4 text-center text-gray-500">
									Tidak ada data kelas.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</>
	);
}
