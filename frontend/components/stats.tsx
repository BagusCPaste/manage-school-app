"use client";

import { useEffect, useState } from "react";

interface Stats {
	totalSiswas: number;
	totalKelases: number;
	totalGurus: number;
}

export default function StatsDisplay() {
	const [stats, setStats] = useState<Stats | null>(null);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const res = await fetch("http://localhost:5000/api/stats", {
					cache: "no-store",
				});
				if (!res.ok) throw new Error("Failed to fetch stats");
				const data = await res.json();
				setStats(data);
			} catch (error) {
				console.error("Error fetching stats:", error);
			}
		};
		fetchStats();
	}, []);

	if (!stats) {
		return <div className="text-center text-gray-500">Memuat data statistik...</div>;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
			<div className="bg-white p-6 rounded-lg shadow-md text-center">
				<h2 className="text-2xl font-semibold text-gray-800 mb-2">{stats.totalSiswas}</h2>
				<p className="text-gray-600">Total Siswa</p>
			</div>
			<div className="bg-white p-6 rounded-lg shadow-md text-center">
				<h2 className="text-2xl font-semibold text-gray-800 mb-2">{stats.totalKelases}</h2>
				<p className="text-gray-600">Total Kelas</p>
			</div>
			<div className="bg-white p-6 rounded-lg shadow-md text-center">
				<h2 className="text-2xl font-semibold text-gray-800 mb-2">{stats.totalGurus}</h2>
				<p className="text-gray-600">Total Guru</p>
			</div>
		</div>
	);
}
