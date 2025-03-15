// backend/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke MongoDB
mongoose.connect("mongodb://localhost:27017/schoolapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Skema dan Model

// Skema User (untuk autentikasi dan role)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["siswa", "guru"] }, // Role hanya boleh "siswa" atau "guru"
});
const User = mongoose.model("User", userSchema);

// Skema Siswa
const siswaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  kelasId: { type: Number, required: true },
  kelasName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Referensi ke user (opsional)
});
const Siswa = mongoose.model("Siswa", siswaSchema);

// Skema Kelas
const kelasSchema = new mongoose.Schema({
  name: { type: String, required: true },
});
const Kelas = mongoose.model("Kelas", kelasSchema);

// Skema Guru
const guruSchema = new mongoose.Schema({
  name: { type: String, required: true },
  kelasId: { type: Number, required: true },
  kelasName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Referensi ke user (opsional)
});
const Guru = mongoose.model("Guru", guruSchema);

// --- Route Root ---
app.get("/", (req, res) => {
  res.send("Backend server is running.");
});

// --- Fitur Autentikasi ---

// Register: Tambah pengguna baru dengan role
app.post("/api/register", async (req, res) => {
  const { username, password, role } = req.body;

  // Validasi input
  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ message: "Username, password, dan role wajib diisi." });
  }
  if (role !== "siswa" && role !== "guru") {
    return res
      .status(400)
      .json({
        message:
          "Role tidak valid. Hanya 'siswa' atau 'guru' yang diperbolehkan.",
      });
  }

  try {
    // Cek apakah username sudah ada
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username sudah terdaftar." });
    }

    // Simpan pengguna baru ke database
    const newUser = new User({ username, password, role });
    await newUser.save();
    res.status(201).json({ message: "Register berhasil", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      return res.status(200).json({ token: "123456", user });
    }
    res.status(401).json({ message: "Invalid credentials" });
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
    let siswas = await Siswa.find();
    const result = siswas.map((s) => ({
      id: s._id,
      name: s.name,
      kelas: s.kelasName,
    }));
    if (kelas) {
      return res.status(200).json(result.filter((s) => s.kelas === kelas));
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// GET detail siswa berdasarkan id
app.get("/api/siswa/:id", async (req, res) => {
  try {
    const siswa = await Siswa.findById(req.params.id);
    if (!siswa) return res.status(404).json({ message: "Siswa not found" });
    res.status(200).json({
      id: siswa._id,
      name: siswa.name,
      kelas: siswa.kelasName,
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
    const kelasData = await Kelas.findOne({ name: kelas });
    if (!kelasData)
      return res.status(400).json({ message: "Kelas tidak ditemukan" });

    const newSiswa = new Siswa({
      name,
      kelasId: kelasData._id,
      kelasName: kelasData.name,
    });
    await newSiswa.save();
    res.status(201).json({
      id: newSiswa._id,
      name: newSiswa.name,
      kelas: newSiswa.kelasName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// UPDATE: Ubah data siswa
app.put("/api/siswa/:id", async (req, res) => {
  try {
    const siswa = await Siswa.findById(req.params.id);
    if (!siswa) return res.status(404).json({ message: "Siswa not found" });

    const { name, kelas } = req.body;
    if (kelas) {
      const kelasData = await Kelas.findOne({ name: kelas });
      if (!kelasData)
        return res.status(400).json({ message: "Kelas tidak ditemukan" });
      siswa.kelasId = kelasData._id;
      siswa.kelasName = kelasData.name;
    }
    if (name) siswa.name = name;

    await siswa.save();
    res.status(200).json({
      id: siswa._id,
      name: siswa.name,
      kelas: siswa.kelasName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// DELETE: Hapus siswa
app.delete("/api/siswa/:id", async (req, res) => {
  try {
    const siswa = await Siswa.findByIdAndDelete(req.params.id);
    if (!siswa) return res.status(404).json({ message: "Siswa not found" });
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
    const kelases = await Kelas.find();
    res.status(200).json(kelases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// CREATE: Tambah kelas baru
app.post("/api/kelas", async (req, res) => {
  try {
    const newKelas = new Kelas(req.body);
    await newKelas.save();
    res.status(201).json(newKelas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// UPDATE: Ubah data kelas
app.put("/api/kelas/:id", async (req, res) => {
  try {
    const kelas = await Kelas.findById(req.params.id);
    if (!kelas) return res.status(404).json({ message: "Kelas not found" });

    const newName = req.body.name;
    Object.assign(kelas, req.body);
    await kelas.save();

    // Update semua siswa dan guru yang terkait
    await Siswa.updateMany({ kelasId: kelas._id }, { kelasName: newName });
    await Guru.updateMany({ kelasId: kelas._id }, { kelasName: newName });

    res.status(200).json(kelas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// DELETE: Hapus kelas
app.delete("/api/kelas/:id", async (req, res) => {
  try {
    const kelasId = req.params.id;
    const usedBySiswa = await Siswa.findOne({ kelasId });
    const usedByGuru = await Guru.findOne({ kelasId });
    if (usedBySiswa || usedByGuru) {
      return res.status(400).json({
        message:
          "Kelas tidak dapat dihapus karena sedang digunakan oleh siswa atau guru",
      });
    }

    await Kelas.findByIdAndDelete(kelasId);
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
    let gurus = await Guru.find();
    const result = gurus.map((g) => ({
      id: g._id,
      name: g.name,
      kelas: g.kelasName,
    }));
    if (kelas) {
      return res.status(200).json(result.filter((g) => g.kelas === kelas));
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// CREATE: Tambah guru baru
app.post("/api/guru", async (req, res) => {
  const { name, kelas } = req.body;
  try {
    const kelasData = await Kelas.findOne({ name: kelas });
    if (!kelasData)
      return res.status(400).json({ message: "Kelas tidak ditemukan" });

    const newGuru = new Guru({
      name,
      kelasId: kelasData._id,
      kelasName: kelasData.name,
    });
    await newGuru.save();
    res.status(201).json({
      id: newGuru._id,
      name: newGuru.name,
      kelas: newGuru.kelasName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// UPDATE: Ubah data guru
app.put("/api/guru/:id", async (req, res) => {
  try {
    const guru = await Guru.findById(req.params.id);
    if (!guru) return res.status(404).json({ message: "Guru not found" });

    const { name, kelas } = req.body;
    if (kelas) {
      const kelasData = await Kelas.findOne({ name: kelas });
      if (!kelasData)
        return res.status(400).json({ message: "Kelas tidak ditemukan" });
      guru.kelasId = kelasData._id;
      guru.kelasName = kelasData.name;
    }
    if (name) guru.name = name;

    await guru.save();
    res.status(200).json({
      id: guru._id,
      name: guru.name,
      kelas: guru.kelasName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// DELETE: Hapus guru
app.delete("/api/guru/:id", async (req, res) => {
  try {
    const guru = await Guru.findByIdAndDelete(req.params.id);
    if (!guru) return res.status(404).json({ message: "Guru not found" });
    res.status(200).json({ message: "Guru deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi error pada server." });
  }
});

// --- Endpoint Gabungan: List Siswa, Kelas, dan Guru ---
app.get("/api/list", async (req, res) => {
  try {
    const siswas = await Siswa.find();
    const kelases = await Kelas.find();
    const gurus = await Guru.find();
    const formattedSiswas = siswas.map((s) => ({
      id: s._id,
      name: s.name,
      kelas: s.kelasName,
    }));
    const formattedGurus = gurus.map((g) => ({
      id: g._id,
      name: g.name,
      kelas: g.kelasName,
    }));
    res.status(200).json({
      siswas: formattedSiswas,
      kelases,
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
    const totalSiswas = await Siswa.countDocuments();
    const totalKelases = await Kelas.countDocuments();
    const totalGurus = await Guru.countDocuments();
    const stats = {
      totalSiswas,
      totalKelases,
      totalGurus,
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
