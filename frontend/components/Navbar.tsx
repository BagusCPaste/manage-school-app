
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi"; 

export default function Navbar() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const router = useRouter();

	
	useEffect(() => {
		const checkAuth = () => {
			const token = localStorage.getItem("token");
			setIsAuthenticated(!!token);
		};

		
		checkAuth();

		
		window.addEventListener("storage", checkAuth);
		
		const handleStorageChange = () => checkAuth();
		window.addEventListener("storage", handleStorageChange);

		
		return () => {
			window.removeEventListener("storage", checkAuth);
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	
	const handleLogout = () => {
		localStorage.removeItem("token"); 
		setIsAuthenticated(false); 
		router.push("/login"); 
	};

	return (
		<nav className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 shadow-md">
			<div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
				{/* Logo Sederhana */}
				<div className="flex items-center mb-4 md:mb-0">
					<span className="font-bold text-2xl mr-2">🏫</span>
					<span className="font-bold text-xl">School App</span>
				</div>
				{/* Menu Navigasi */}
				<ul className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
					<li>
						<Link href="/" className="hover:text-gray-200 transition">
							Home
						</Link>
					</li>
					{!isAuthenticated && (
						<>
							<li>
								<Link href="/login" className="hover:text-gray-200 transition">
									Login
								</Link>
							</li>
							<li>
								<Link href="/register" className="hover:text-gray-200 transition">
									Register
								</Link>
							</li>
						</>
					)}
					{isAuthenticated && (
						<>
							<li>
								<Link href="/siswa" className="hover:text-gray-200 transition">
									Manage Siswa
								</Link>
							</li>
							<li>
								<Link href="/kelas" className="hover:text-gray-200 transition">
									Manage Kelas
								</Link>
							</li>
							<li>
								<Link href="/guru" className="hover:text-gray-200 transition">
									Manage Guru
								</Link>
							</li>
							<li>
								<button
									onClick={handleLogout}
									className="flex items-center space-x-2 hover:text-gray-200 transition"
								>
									<FiLogOut className="w-5 h-5" />
									<span>Logout</span>
								</button>
							</li>
						</>
					)}
					<li>
						<Link href="/list" className="hover:text-gray-200 transition">
							All Data
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}
