"use client";

import { useState, FormEvent } from "react";

interface Siswa {
	id: number;
	name: string;
	kelas: string;
}

export default function SiswaTable({ initialSiswas }: { initialSiswas: Siswa[] }) {
	const [siswas, setSiswas] = useState<Siswa[]>(initialSiswas);
	const [nama, setNama] = useState<string>("");
	const [kelas, setKelas] = useState<string>("");
	const [filterKelas, setFilterKelas] = useState<string>("");
	const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);

	
	const filteredSiswas = siswas.filter((s) =>
		s.kelas.toLowerCase().includes(filterKelas.toLowerCase()),
	);

	const handleAddOrUpdateSiswa = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const method = editingSiswa ? "PUT" : "POST";
			const url = editingSiswa
				? `http://localhost:5000/api/siswa/${editingSiswa.id}`
				: "http://localhost:5000/api/siswa";
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: nama, kelas }),
			});
			if (res.ok) {
				const updatedSiswa = await res.json();
				if (editingSiswa) {
					setSiswas(siswas.map((s) => (s.id === editingSiswa.id ? updatedSiswa : s)));
				} else {
					setSiswas([...siswas, updatedSiswa]);
				}
				setNama("");
				setKelas("");
				setEditingSiswa(null);
			} else {
				alert(editingSiswa ? "Gagal memperbarui siswa." : "Gagal menambahkan siswa.");
			}
		} catch (error) {
			console.error(error);
			alert("Error saat memproses data.");
		}
	};

	const handleEdit = (siswa: Siswa) => {
		setEditingSiswa(siswa);
		setNama(siswa.name);
		setKelas(siswa.kelas);
	};

	const handleDelete = async (id: number) => {
		if (confirm("Apakah Anda yakin ingin menghapus siswa ini?")) {
			try {
				const res = await fetch(`http://localhost:5000/api/siswa/${id}`, {
					method: "DELETE",
				});
				if (res.ok) {
					setSiswas(siswas.filter((s) => s.id !== id));
				} else {
					alert("Gagal menghapus siswa.");
				}
			} catch (error) {
				console.error(error);
				alert("Error saat menghapus siswa.");
			}
		}
	};

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

			{/* Form Section */}
			<form
				onSubmit={handleAddOrUpdateSiswa}
				className="mb-6 bg-white p-4 rounded-lg shadow-md"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-gray-700 mb-1">Nama Siswa</label>
						<input
							type="text"
							placeholder="Masukkan nama siswa"
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
					{editingSiswa ? "Perbarui Siswa" : "Tambah Siswa"}
				</button>
				{editingSiswa && (
					<button
						type="button"
						onClick={() => {
							setEditingSiswa(null);
							setNama("");
							setKelas("");
						}}
						className="mt-4 ml-2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-sm"
					>
						Batal
					</button>
				)}
			</form>

			{/* Tabel Siswa */}
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
						{filteredSiswas.length > 0 ? (
							filteredSiswas.map((s) => (
								<tr
									key={s.id}
									className="border-b hover:bg-gray-50 transition-colors"
								>
									<td className="p-4">{s.id}</td>
									<td className="p-4">{s.name}</td>
									<td className="p-4">{s.kelas}</td>
									<td className="p-4 flex gap-2">
										<button
											onClick={() => handleEdit(s)}
											className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
										>
											Edit
										</button>
										<button
											onClick={() => handleDelete(s.id)}
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
									Tidak ada data siswa.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</>
	);
}
