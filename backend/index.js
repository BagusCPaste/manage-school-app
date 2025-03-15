// backend/index.js
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Konfigurasi koneksi ke Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Diperlukan untuk Neon
});

// --- Route Root ---
app.get("/", (req, res) => {
  res.send("Backend server is running with Neon PostgreSQL.");
});

// --- Fitur Autentikasi ---

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );
    if (user.rows.length > 0) {
      const token = "user_" + user.rows[0].id + "_token"; // Token sederhana
      return res.status(200).json({ token, user: user.rows[0] });
    }
    res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

app.post("/api/register", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Username, password, dan role wajib diisi." });
  }
  if (role !== "siswa" && role !== "guru") {
    return res.status(400).json({ message: "Role tidak valid. Hanya 'siswa' atau 'guru' yang diperbolehkan." });
  }

  try {
    const checkUser = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "Username sudah terdaftar." });
    }

    const newUser = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *",
      [username, password, role]
    );
    const token = "user_" + newUser.rows[0].id + "_token"; // Token sederhana
    res.status(201).json({ message: "Register berhasil", user: newUser.rows[0], token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// Logout
app.post("/api/logout", (req, res) => {
  res.status(200).json({ message: "Logout successful" });
});

// --- Fitur Manage Siswa (CRUD) ---

// GET semua siswa
app.get("/api/siswa", async (req, res) => {
  const kelas = req.query.kelas;
  try {
    let query = "SELECT * FROM siswas";
    const result = await pool.query(query);
    let siswas = result.rows.map((s) => ({
      id: s.id,
      name: s.name,
      kelas: s.kelas_name,
    }));
    if (kelas) {
      siswas = siswas.filter((s) => s.kelas === kelas);
    }
    res.status(200).json(siswas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// GET detail siswa berdasarkan id
app.get("/api/siswa/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM siswas WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Siswa not found" });
    const siswa = result.rows[0];
    res.status(200).json({
      id: siswa.id,
      name: siswa.name,
      kelas: siswa.kelas_name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// CREATE: Tambah siswa baru
app.post("/api/siswa", async (req, res) => {
  const { name, kelas } = req.body;
  try {
    const kelasCheck = await pool.query(
      "SELECT id, name FROM kelases WHERE name = $1",
      [kelas]
    );
    if (kelasCheck.rows.length === 0)
      return res.status(400).json({ message: "Kelas tidak ditemukan" });

    const newSiswa = await pool.query(
      "INSERT INTO siswas (name, kelas_id, kelas_name) VALUES ($1, $2, $3) RETURNING *",
      [name, kelasCheck.rows[0].id, kelasCheck.rows[0].name]
    );
    res.status(201).json({
      id: newSiswa.rows[0].id,
      name: newSiswa.rows[0].name,
      kelas: newSiswa.rows[0].kelas_name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// UPDATE: Ubah data siswa
app.put("/api/siswa/:id", async (req, res) => {
  try {
    const siswa = await pool.query("SELECT * FROM siswas WHERE id = $1", [
      req.params.id,
    ]);
    if (siswa.rows.length === 0)
      return res.status(404).json({ message: "Siswa not found" });

    const { name, kelas } = req.body;
    let kelasId = siswa.rows[0].kelas_id;
    let kelasName = siswa.rows[0].kelas_name;

    if (kelas) {
      const kelasData = await pool.query(
        "SELECT id, name FROM kelases WHERE name = $1",
        [kelas]
      );
      if (kelasData.rows.length === 0)
        return res.status(400).json({ message: "Kelas tidak ditemukan" });
      kelasId = kelasData.rows[0].id;
      kelasName = kelasData.rows[0].name;
    }

    await pool.query(
      "UPDATE siswas SET name = $1, kelas_id = $2, kelas_name = $3 WHERE id = $4",
      [name || siswa.rows[0].name, kelasId, kelasName, req.params.id]
    );

    res.status(200).json({
      id: req.params.id,
      name: name || siswa.rows[0].name,
      kelas: kelasName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// DELETE: Hapus siswa
app.delete("/api/siswa/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM siswas WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Siswa not found" });
    res.status(200).json({ message: "Siswa deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// --- Fitur Manage Kelas (CRUD) ---

// GET semua kelas
app.get("/api/kelas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM kelases");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// CREATE: Tambah kelas baru
app.post("/api/kelas", async (req, res) => {
  const { name } = req.body;
  try {
    const newKelas = await pool.query(
      "INSERT INTO kelases (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(newKelas.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// UPDATE: Ubah data kelas
app.put("/api/kelas/:id", async (req, res) => {
  try {
    const kelas = await pool.query("SELECT * FROM kelases WHERE id = $1", [
      req.params.id,
    ]);
    if (kelas.rows.length === 0)
      return res.status(404).json({ message: "Kelas not found" });

    const { name } = req.body;
    await pool.query("UPDATE kelases SET name = $1 WHERE id = $2", [
      name,
      req.params.id,
    ]);

    // Update semua siswa dan guru yang terkait
    await pool.query("UPDATE siswas SET kelas_name = $1 WHERE kelas_id = $2", [
      name,
      req.params.id,
    ]);
    await pool.query("UPDATE gurus SET kelas_name = $1 WHERE kelas_id = $2", [
      name,
      req.params.id,
    ]);

    res.status(200).json({ id: req.params.id, name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// DELETE: Hapus kelas
app.delete("/api/kelas/:id", async (req, res) => {
  try {
    const kelasId = req.params.id;
    const usedBySiswa = await pool.query(
      "SELECT 1 FROM siswas WHERE kelas_id = $1 LIMIT 1",
      [kelasId]
    );
    const usedByGuru = await pool.query(
      "SELECT 1 FROM gurus WHERE kelas_id = $1 LIMIT 1",
      [kelasId]
    );
    if (usedBySiswa.rows.length > 0 || usedByGuru.rows.length > 0) {
      return res.status(400).json({
        message:
          "Kelas tidak dapat dihapus karena sedang digunakan oleh siswa atau guru",
      });
    }

    await pool.query("DELETE FROM kelases WHERE id = $1", [kelasId]);
    res.status(200).json({ message: "Kelas deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// --- Fitur Manage Guru (CRUD) ---

// GET semua guru
app.get("/api/guru", async (req, res) => {
  const kelas = req.query.kelas;
  try {
    let query = "SELECT * FROM gurus";
    const result = await pool.query(query);
    let gurus = result.rows.map((g) => ({
      id: g.id,
      name: g.name,
      kelas: g.kelas_name,
    }));
    if (kelas) {
      gurus = gurus.filter((g) => g.kelas === kelas);
    }
    res.status(200).json(gurus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// CREATE: Tambah guru baru
app.post("/api/guru", async (req, res) => {
  const { name, kelas } = req.body;
  try {
    const kelasCheck = await pool.query(
      "SELECT id, name FROM kelases WHERE name = $1",
      [kelas]
    );
    if (kelasCheck.rows.length === 0)
      return res.status(400).json({ message: "Kelas tidak ditemukan" });

    const newGuru = await pool.query(
      "INSERT INTO gurus (name, kelas_id, kelas_name) VALUES ($1, $2, $3) RETURNING *",
      [name, kelasCheck.rows[0].id, kelasCheck.rows[0].name]
    );
    res.status(201).json({
      id: newGuru.rows[0].id,
      name: newGuru.rows[0].name,
      kelas: newGuru.rows[0].kelas_name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// UPDATE: Ubah data guru
app.put("/api/guru/:id", async (req, res) => {
  try {
    const guru = await pool.query("SELECT * FROM gurus WHERE id = $1", [
      req.params.id,
    ]);
    if (guru.rows.length === 0)
      return res.status(404).json({ message: "Guru not found" });

    const { name, kelas } = req.body;
    let kelasId = guru.rows[0].kelas_id;
    let kelasName = guru.rows[0].kelas_name;

    if (kelas) {
      const kelasData = await pool.query(
        "SELECT id, name FROM kelases WHERE name = $1",
        [kelas]
      );
      if (kelasData.rows.length === 0)
        return res.status(400).json({ message: "Kelas tidak ditemukan" });
      kelasId = kelasData.rows[0].id;
      kelasName = kelasData.rows[0].name;
    }

    await pool.query(
      "UPDATE gurus SET name = $1, kelas_id = $2, kelas_name = $3 WHERE id = $4",
      [name || guru.rows[0].name, kelasId, kelasName, req.params.id]
    );

    res.status(200).json({
      id: req.params.id,
      name: name || guru.rows[0].name,
      kelas: kelasName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// DELETE: Hapus guru
app.delete("/api/guru/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM gurus WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Guru not found" });
    res.status(200).json({ message: "Guru deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// --- Endpoint Gabungan: List Siswa, Kelas, dan Guru ---
app.get("/api/list", async (req, res) => {
  try {
    const [siswasResult, kelasesResult, gurusResult] = await Promise.all([
      pool.query("SELECT * FROM siswas"),
      pool.query("SELECT * FROM kelases"),
      pool.query("SELECT * FROM gurus"),
    ]);

    const formattedSiswas = siswasResult.rows.map((s) => ({
      id: s.id,
      name: s.name,
      kelas: s.kelas_name,
    }));
    const formattedGurus = gurusResult.rows.map((g) => ({
      id: g.id,
      name: g.name,
      kelas: g.kelas_name,
    }));

    res.status(200).json({
      siswas: formattedSiswas,
      kelases: kelasesResult.rows,
      gurus: formattedGurus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// --- Endpoint Statistik ---
app.get("/api/stats", async (req, res) => {
  try {
    const [siswasCount, kelasesCount, gurusCount] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM siswas"),
      pool.query("SELECT COUNT(*) FROM kelases"),
      pool.query("SELECT COUNT(*) FROM gurus"),
    ]);

    const stats = {
      totalSiswas: parseInt(siswasCount.rows[0].count),
      totalKelases: parseInt(kelasesCount.rows[0].count),
      totalGurus: parseInt(gurusCount.rows[0].count),
    };
    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
