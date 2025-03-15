
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const res = await fetch("http://localhost:5000/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});
			const data = await res.json();
			if (res.ok) {
				
				localStorage.setItem("token", data.token); 
				alert("Login berhasil!");
				router.push("/"); 
				window.dispatchEvent(new Event("storage"));
				router.refresh();
			} else {
				alert(data.message || "Login gagal.");
			}
		} catch (error) {
			console.error(error);
			alert("Terjadi error pada koneksi server.");
		}
	};

	return (
		<div className="bg-white p-6 rounded shadow-md w-80">
			<h1 className="text-xl font-bold mb-4 text-center">Login</h1>
			<form onSubmit={handleLogin} className="flex flex-col">
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
				<button
					type="submit"
					className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
				>
					Login
				</button>
				<p className="mt-4 text-center">
						Belum punya akun?{" "}
						<a href="/register" className="text-blue-500 hover:underline">
							Register
						</a>
					</p>
			</form>
		</div>
	);
}
