import './style.css'

// 1. Interface: struktur data tugas
interface Task {
  id: number
  title: string
  course: string
  deadline: string
  description: string
  completed: boolean
}

// 2. Type alias dan Union Type
type TaskStatus = 'Belum Selesai' | 'Selesai'
type FilterType = 'Semua' | TaskStatus

// 3. Primitive Types
const appName: string = import.meta.env.VITE_APP_NAME
const appVersion: string = import.meta.env.VITE_APP_VERSION
let totalTasks: number = 0

// 4. Array
let tasks: Task[] = loadData<Task[]>('taskmate-tasks', [])

// 5. Generic Function untuk mengambil data
function loadData<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) as T : fallback
  } catch {
    return fallback
  }
}

// Generic Function untuk menyimpan data
function saveData<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data))
}

// Mengambil elemen HTML
const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Elemen #app tidak ditemukan')
}

// Filter dan mode edit
let currentFilter: FilterType = 'Semua'
let editingId: number | null = null

// Menghindari input HTML yang tidak aman
function escapeHTML(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }
    return entities[char]
  })
}

// Menampilkan tampilan aplikasi
app.innerHTML = `
  <header class="topbar">
    <div class="brand">
      <div class="brand-icon">T</div>
      <span>${appName}</span>
    </div>
    <div class="version">Version ${appVersion}</div>
  </header>

  <main class="container">
    <section class="welcome">
      <div>
        <p class="eyebrow">CATATAN KULIAH</p>
        <h1>Halo, Farah Diva! 👋</h1>
        <p class="subtitle">Ada tugas apa hari ini? Yuk, catat biar nggak lupa!</p>
      </div>
      <div class="welcome-icon">📚</div>
    </section>

    <section class="stats">
      <div class="stat-card">
        <span class="stat-icon">📋</span>
        <p>Total Tugas</p>
        <h2 id="total-count">0</h2>
      </div>
      <div class="stat-card">
        <span class="stat-icon">⏳</span>
        <p>Belum Selesai</p>
        <h2 id="pending-count">0</h2>
      </div>
      <div class="stat-card">
        <span class="stat-icon">✅</span>
        <p>Selesai</p>
        <h2 id="completed-count">0</h2>
      </div>
    </section>

    <section class="content-grid">
      <div class="form-card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">TUGAS BARU</p>
            <h2 id="form-title">Tambah Tugas</h2>
          </div>
          <span class="heading-icon">✏️</span>
        </div>

        <form id="task-form">
          <label for="task-title">Nama Tugas</label>
          <input id="task-title" type="text"
            placeholder="Contoh: Membuat laporan..." required>

          <label for="task-course">Mata Kuliah</label>
          <input id="task-course" type="text"
            placeholder="Contoh: Pengembangan Aplikasi Web" required>

          <label for="task-deadline">Deadline</label>
          <input id="task-deadline" type="date" required>

          <label for="task-description">Deskripsi (opsional)</label>
          <textarea id="task-description" rows="3"
            placeholder="Tambahkan catatan tugas..."></textarea>

          <div class="form-actions">
            <button type="submit" class="btn-primary" id="submit-btn">
              + Tambahkan Tugas
            </button>
            <button type="button" class="btn-cancel" id="cancel-btn" hidden>
              Batal
            </button>
          </div>
        </form>
      </div>

      <div class="list-card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">AKTIVITAS KULIAH</p>
            <h2>Daftar Tugas</h2>
          </div>
          <span class="heading-icon">📝</span>
        </div>

        <div class="filters">
          <button class="filter-btn active" data-filter="Semua">Semua</button>
          <button class="filter-btn" data-filter="Belum Selesai">Belum</button>
          <button class="filter-btn" data-filter="Selesai">Selesai</button>
        </div>

        <div id="task-list" class="task-list"></div>
      </div>
    </section>

    <!-- PENJELASAN TEKNOLOGI -->
    <section class="technology-section">
      <div class="technology-heading">
        <p class="eyebrow">PENGEMBANGAN APLIKASI</p>
        <h2>Teknologi di Balik TaskMate</h2>
        <p>Teknologi yang digunakan dalam proses pengembangan aplikasi TaskMate.</p>
      </div>

      <div class="technology-grid">
        <article class="technology-card">
          <h3>Git dan GitHub</h3>
          <p>Git digunakan untuk mengelola versi kode, mencatat perubahan, membuat branch, dan menggabungkan kode. GitHub digunakan untuk menyimpan repository secara online serta mengelola kolaborasi melalui Pull Request.</p>
        </article>

        <article class="technology-card">
          <h3>npm (Node Package Manager)</h3>
          <p>npm digunakan untuk mengelola package atau library yang dibutuhkan dalam pengembangan aplikasi, memasang dependency, dan menjalankan perintah melalui script pada package.json.</p>
        </article>

        <article class="technology-card">
          <h3>TypeScript</h3>
          <p>TypeScript merupakan pengembangan JavaScript yang memiliki sistem tipe data. TaskMate menggunakan interface, type alias, union type, array, primitive types, dan generic function agar kode lebih terstruktur.</p>
        </article>

        <article class="technology-card">
          <h3>Vite</h3>
          <p>Vite merupakan build tool yang menyediakan development server untuk menjalankan aplikasi selama proses pengembangan serta membantu menghasilkan file aplikasi yang siap dipublikasikan.</p>
        </article>

        <article class="technology-card">
          <h3>Environment Variables</h3>
          <p>Environment variables digunakan untuk mengatur konfigurasi aplikasi di luar kode utama. TaskMate menggunakan file .env untuk menyimpan nama dan versi aplikasi serta .env.example sebagai contoh konfigurasi.</p>
        </article>
      </div>

      <div class="process-card">
        <h3>Peran Compiler, Transpiler, dan Bundler</h3>

        <div class="process-item">
          <strong>Compiler</strong>
          <p>TypeScript Compiler (tsc) memeriksa tipe data dan membantu mendeteksi kesalahan pada kode TypeScript.</p>
        </div>

        <div class="process-item">
          <strong>Transpiler</strong>
          <p>Mengubah kode TypeScript menjadi JavaScript agar dapat dijalankan oleh browser.</p>
        </div>

        <div class="process-item">
          <strong>Bundler</strong>
          <p>Vite menggunakan proses bundling untuk menggabungkan dan mengoptimalkan JavaScript, CSS, serta aset lainnya menjadi hasil build yang siap dipublikasikan.</p>
        </div>
      </div>
    </section>

    <footer>
      <p>Dibuat dengan 💜 untuk menemani kegiatan kuliah.</p>
      <p>TaskMate © 2026</p>
    </footer>
  </main>
`

// Mengambil elemen form
const taskForm = document.querySelector<HTMLFormElement>('#task-form')!
const titleInput = document.querySelector<HTMLInputElement>('#task-title')!
const courseInput = document.querySelector<HTMLInputElement>('#task-course')!
const deadlineInput = document.querySelector<HTMLInputElement>('#task-deadline')!
const descriptionInput = document.querySelector<HTMLTextAreaElement>('#task-description')!
const taskList = document.querySelector<HTMLDivElement>('#task-list')!
const submitBtn = document.querySelector<HTMLButtonElement>('#submit-btn')!
const cancelBtn = document.querySelector<HTMLButtonElement>('#cancel-btn')!
const formTitle = document.querySelector<HTMLHeadingElement>('#form-title')!

// Memperbarui statistik tugas
function updateStats(): void {
  totalTasks = tasks.length

  const pendingTasks = tasks.filter(task => !task.completed).length
  const completedTasks = tasks.filter(task => task.completed).length

  document.querySelector('#total-count')!.textContent = String(totalTasks)
  document.querySelector('#pending-count')!.textContent = String(pendingTasks)
  document.querySelector('#completed-count')!.textContent = String(completedTasks)
}

// Menyimpan dan memperbarui tampilan tugas
function renderTasks(): void {
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'Semua') return true
    if (currentFilter === 'Selesai') return task.completed
    return !task.completed
  })

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <span>📭</span>
        <p>Belum ada tugas di kategori ini.</p>
      </div>
    `
  } else {
    taskList.innerHTML = filteredTasks.map(task => `
      <article class="task-item ${task.completed ? 'completed' : ''}">
        <div class="task-info">
          <div class="task-title-row">
            <h3>${escapeHTML(task.title)}</h3>
            <span class="task-status ${task.completed ? 'done' : 'pending'}">
              ${task.completed ? 'Selesai' : 'Belum Selesai'}
            </span>
          </div>
          <p class="task-course">${escapeHTML(task.course)}</p>
          <p class="task-deadline">📅 ${escapeHTML(task.deadline)}</p>
          ${task.description ? `<p class="task-description">${escapeHTML(task.description)}</p>` : ''}
        </div>

        <div class="task-actions">
          <button class="action-btn complete-btn" data-id="${task.id}" title="Ubah status">
            ${task.completed ? '↩️' : '✅'}
          </button>
          <button class="action-btn edit-btn" data-id="${task.id}" title="Edit tugas">
            ✏️
          </button>
          <button class="action-btn delete-btn" data-id="${task.id}" title="Hapus tugas">
            🗑️
          </button>
        </div>
      </article>
    `).join('')
  }

  updateStats()
  saveData<Task[]>('taskmate-tasks', tasks)
}

// Mengosongkan form
function resetForm(): void {
  taskForm.reset()
  editingId = null
  formTitle.textContent = 'Tambah Tugas'
  submitBtn.textContent = '+ Tambahkan Tugas'
  cancelBtn.hidden = true
}

// Menambahkan dan mengedit tugas
taskForm.addEventListener('submit', (event: SubmitEvent) => {
  event.preventDefault()

  const title = titleInput.value.trim()
  const course = courseInput.value.trim()
  const deadline = deadlineInput.value
  const description = descriptionInput.value.trim()

  if (!title || !course || !deadline) return

  if (editingId !== null) {
    tasks = tasks.map(task =>
      task.id === editingId
        ? { ...task, title, course, deadline, description }
        : task
    )
  } else {
    const newTask: Task = {
      id: Date.now(),
      title,
      course,
      deadline,
      description,
      completed: false
    }

    tasks.unshift(newTask)
  }

  resetForm()
  renderTasks()
})

// Membatalkan edit
cancelBtn.addEventListener('click', resetForm)

// Tombol filter
document.querySelectorAll<HTMLButtonElement>('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter as FilterType
    currentFilter = selectedFilter

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active')
    })

    button.classList.add('active')
    renderTasks()
  })
})

// Aksi edit, hapus, dan ubah status
taskList.addEventListener('click', (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const button = target.closest<HTMLButtonElement>('button[data-id]')

  if (!button) return

  const id = Number(button.dataset.id)
  const task = tasks.find(item => item.id === id)

  if (!task) return

  if (button.classList.contains('complete-btn')) {
    tasks = tasks.map(item =>
      item.id === id
        ? { ...item, completed: !item.completed }
        : item
    )
  }

  if (button.classList.contains('edit-btn')) {
    editingId = id

    titleInput.value = task.title
    courseInput.value = task.course
    deadlineInput.value = task.deadline
    descriptionInput.value = task.description

    formTitle.textContent = 'Edit Tugas'
    submitBtn.textContent = 'Simpan Perubahan'
    cancelBtn.hidden = false

    titleInput.focus()
  }

  if (button.classList.contains('delete-btn')) {
    const confirmation = window.confirm('Yakin ingin menghapus tugas ini?')

    if (confirmation) {
      tasks = tasks.filter(item => item.id !== id)

      if (editingId === id) {
        resetForm()
      }
    }
  }

  renderTasks()
})

// Menampilkan tugas saat aplikasi dibuka
renderTasks()