
import { useEffect, useState } from 'react'
import './App.css'

// Alamat API backend untuk mengelola data siswa
const API_URL = 'http://localhost:3000/api/siswa'

const formKosong = {
  kode_siswa: '',
  nama_siswa: '',
  alamat_siswa: '',
  tgl_siswa: '',
  jurusan_siswa: ''
}

function App() {
  const [siswa, setSiswa] = useState([])
  const [form, setForm] = useState(formKosong)
  const [loading, setLoading] = useState(true)
  const [cari, setCari] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [pesan, setPesan] = useState('')

  const ambilData = async () => {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Gagal mengambil data')
      const data = await response.json()
      setSiswa(data)
    } catch (error) {
      setPesan('Tidak dapat terhubung ke backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ambilData()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const simpanData = async (e) => {
    e.preventDefault()

    try {
      const url = editMode
        ? `${API_URL}/${encodeURIComponent(form.kode_siswa)}`
        : API_URL

      const response = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const hasil = await response.json()
      if (!response.ok) throw new Error(hasil.message)

      setPesan(editMode ? 'Data berhasil diperbarui!' : 'Siswa berhasil ditambahkan!')
      setForm(formKosong)
      setEditMode(false)
      ambilData()
    } catch (error) {
      setPesan('Gagal menyimpan data: ' + error.message)
    }
  }

  const mulaiEdit = (item) => {
    setForm({
      kode_siswa: item.kode_siswa,
      nama_siswa: item.nama_siswa,
      alamat_siswa: item.alamat_siswa || '',
      tgl_siswa: item.tgl_siswa
        ? String(item.tgl_siswa).slice(0, 10)
        : '',
      jurusan_siswa: item.jurusan_siswa || ''
    })
    setEditMode(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hapusData = async (kode) => {
    if (!window.confirm(`Yakin ingin menghapus siswa ${kode}?`)) return

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(kode)}`,
        { method: 'DELETE' }
      )

      const hasil = await response.json()
      if (!response.ok) throw new Error(hasil.message)

      setPesan('Data siswa berhasil dihapus!')
      ambilData()
    } catch (error) {
      setPesan('Gagal menghapus data: ' + error.message)
    }
  }

  const batalEdit = () => {
    setForm(formKosong)
    setEditMode(false)
    setPesan('')
  }

  const siswaTampil = siswa.filter((item) =>
    `${item.kode_siswa} ${item.nama_siswa} ${item.jurusan_siswa}`
      .toLowerCase()
      .includes(cari.toLowerCase())
  )

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <h2>EduManage</h2>
            <span>Student Portal</span>
          </div>
        </div>

        <div className="side-label">MENU UTAMA</div>

        <a className="side-link active" href="#dashboard">
          <span>▦</span> Dashboard
        </a>

        <a className="side-link" href="#data-siswa">
          <span>♙</span> Data Siswa
        </a>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="profile-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <small>Admin Sekolah</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Halaman / Dashboard</span>
            <h1>Dashboard</h1>
          </div>
          <div className="admin-badge">
            <span className="online-dot"></span>
            Sistem Aktif
          </div>
        </header>

        <section className="welcome-banner">
          <div>
            <span className="welcome-tag">STUDENT MANAGEMENT SYSTEM</span>
            <h2>Selamat Datang, Administrator!</h2>
            <p>Kelola dan pantau informasi data siswa dalam satu tempat.</p>
          </div>
          <div className="banner-icon">🎓</div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">♙</div>
            <div>
              <span>Total Siswa</span>
              <h2>{siswa.length}</h2>
              <small>Data siswa terdaftar</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">▤</div>
            <div>
              <span>Total Jurusan</span>
              <h2>{new Set(siswa.map(s => s.jurusan_siswa).filter(Boolean)).size}</h2>
              <small>Jurusan tersedia</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <div>
              <span>Status Sistem</span>
              <h2 className="status-text">Aktif</h2>
              <small>Koneksi database</small>
            </div>
          </div>
        </section>

        {pesan && (
          <div className="notification">
            <span>{pesan}</span>
            <button onClick={() => setPesan('')}>×</button>
          </div>
        )}

        <section className="content-grid">
          <div className="panel form-panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">FORMULIR</span>
                <h2>{editMode ? 'Edit Data Siswa' : 'Tambah Siswa'}</h2>
              </div>
              <div className="heading-icon">✎</div>
            </div>

            <form onSubmit={simpanData}>
              <label>Kode Siswa</label>
              <input
                name="kode_siswa"
                placeholder="Contoh: S001"
                value={form.kode_siswa}
                onChange={handleChange}
                disabled={editMode}
                required
              />

              <label>Nama Lengkap</label>
              <input
                name="nama_siswa"
                placeholder="Masukkan nama siswa"
                value={form.nama_siswa}
                onChange={handleChange}
                required
              />

              <label>Alamat</label>
              <textarea
                name="alamat_siswa"
                placeholder="Masukkan alamat siswa"
                value={form.alamat_siswa}
                onChange={handleChange}
                rows="3"
              />

              <label>Tanggal Lahir</label>
              <input
                type="date"
                name="tgl_siswa"
                value={form.tgl_siswa}
                onChange={handleChange}
              />

              <label>Jurusan</label>
              <input
                name="jurusan_siswa"
                placeholder="Masukkan jurusan"
                value={form.jurusan_siswa}
                onChange={handleChange}
              />

              <button className="primary-button" type="submit">
                {editMode ? '✓ Simpan Perubahan' : '+ Tambahkan Siswa'}
              </button>

              {editMode && (
                <button
                  className="cancel-button"
                  type="button"
                  onClick={batalEdit}
                >
                  Batal Edit
                </button>
              )}
            </form>
          </div>

          <div className="panel table-panel" id="data-siswa">
            <div className="panel-heading table-heading">
              <div>
                <span className="section-kicker">DATABASE SEKOLAH</span>
                <h2>Daftar Siswa</h2>
                <p>Informasi seluruh siswa yang terdaftar.</p>
              </div>
              <div className="total-badge">{siswa.length} Siswa</div>
            </div>

            <div className="search-box">
              <span>⌕</span>
              <input
                placeholder="Cari kode, nama, atau jurusan..."
                value={cari}
                onChange={(e) => setCari(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="empty-state">Memuat data siswa...</div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>KODE</th>
                      <th>NAMA SISWA</th>
                      <th>ALAMAT</th>
                      <th>TANGGAL LAHIR</th>
                      <th>JURUSAN</th>
                      <th>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siswaTampil.length > 0 ? (
                      siswaTampil.map((item) => (
                        <tr key={item.kode_siswa}>
                          <td><span className="code-badge">{item.kode_siswa}</span></td>
                          <td><strong>{item.nama_siswa}</strong></td>
                          <td>{item.alamat_siswa || '-'}</td>
                          <td>
                            {item.tgl_siswa
                              ? String(item.tgl_siswa).slice(0, 10)
                              : '-'}
                          </td>
                          <td>{item.jurusan_siswa || '-'}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="edit-button"
                                onClick={() => mulaiEdit(item)}
                                title="Edit"
                              >
                                ✎
                              </button>
                              <button
                                className="delete-button"
                                onClick={() => hapusData(item.kode_siswa)}
                                title="Hapus"
                              >
                                ×
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">
                          <div className="empty-state">
                            {cari
                              ? 'Siswa tidak ditemukan.'
                              : 'Belum ada data siswa. Silakan tambahkan siswa.'}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <footer className="footer">
          © 2026 EduManage. Student Management System.
        </footer>
      </main>
    </div>
  )
}

export default App
