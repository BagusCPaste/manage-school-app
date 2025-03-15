import "../app/globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
	title: "School App",
	description: "Aplikasi Pengelolaan Siswa, Kelas, dan Guru",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="id">
			<body>
				<Navbar />
				<main>{children}</main>
			</body>
		</html>
	);
}
