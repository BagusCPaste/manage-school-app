"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("siswa");
	const router = useRouter();

	const handleRegister = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const res = await fetch("http://localhost:5000/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password, role }),
			});
			const data = await res.json();
			if (res.ok) {
				// Simpan token ke localStorage (jika backend mengembalikan token)
				localStorage.setItem("token", data.token || "123456"); // Asumsikan token dikembalikan
				alert("Registrasi berhasil! Silakan login.");
				router.push("/login");
				router.refresh(); // Memaksa re-render
			} else {
				alert(data.message || "Registrasi gagal.");
			}
		} catch (error) {
			console.error(error);
			alert("Terjadi error pada koneksi server.");
		}
	};

	return (
		<div className="bg-white p-6 rounded shadow-md w-80">
			<h1 className="text-xl font-bold mb-4 text-center">Register</h1>
			<form onSubmit={handleRegister} className="flex flex-col">
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className="mb-3 p-2 border border-gray-300 rounded"
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="mb-3 p-2 border border-gray-300 rounded"
					required
				/>
				<select
					value={role}
					onChange={(e) => setRole(e.target.value)}
					className="mb-3 p-2 border border-gray-300 rounded"
					required
				>
					<option value="siswa">Siswa</option>
					<option value="guru">Guru</option>
				</select>
				<button
					type="submit"
					className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
				>
					Register
				</button>
			</form>
		</div>
	);
}
