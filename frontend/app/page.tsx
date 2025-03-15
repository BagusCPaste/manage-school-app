import { Suspense } from "react";
import Link from "next/link";
import StatsDisplay from "../components/stats";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
			<div className="container mx-auto p-6">
				<div className="text-center mt-10">
					<h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
						Selamat Datang di School App
					</h1>
					<p className="text-lg text-gray-600 mb-8">
						Kelola data siswa, kelas, dan guru dengan mudah dan efisien.
					</p>
				</div>

				{/* Suspense untuk Menangani Data Fetching */}
				<Suspense fallback={<p className="text-center">Memuat data statistik...</p>}>
					<StatsDisplay />
				</Suspense>

				{/* Tautan Cepat */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<Link
						href="/siswa"
						className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 transition-all text-center"
					>
						<h3 className="text-xl font-semibold">Manage Siswa</h3>
						<p className="mt-2">Kelola data siswa</p>
					</Link>
					<Link
						href="/kelas"
						className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:bg-green-700 transition-all text-center"
					>
						<h3 className="text-xl font-semibold">Manage Kelas</h3>
						<p className="mt-2">Kelola data kelas</p>
					</Link>
					<Link
						href="/guru"
						className="bg-purple-600 text-white p-6 rounded-lg shadow-md hover:bg-purple-700 transition-all text-center"
					>
						<h3 className="text-xl font-semibold">Manage Guru</h3>
						<p className="mt-2">Kelola data guru</p>
					</Link>
					<Link
						href="/list"
						className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:bg-teal-700 transition-all text-center"
					>
						<h3 className="text-xl font-semibold">Lihat Semua Data</h3>
						<p className="mt-2">Tampilkan semua data</p>
					</Link>
				</div>
			</div>
		</div>
	);
}
