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
const appName: string = 'TaskMate'
const appVersion: string = '1.0.0'
let totalTasks: number = 0

// 4. Array
let tasks: Task[] = loadData<Task[]>('taskmate-tasks', [])

// 5. Generic Function
function loadData<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) as T : fallback
  } catch {
    return fallback
  }
}

// Generic untuk menyimpan data
function saveData<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data))
}

// Mengambil elemen HTML
const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Elemen #app tidak ditemukan')
}

// Filter tugas
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

    <footer>
      <p>Dibuat dengan 💜 untuk menemani kegiatan kuliah.</p>
      <p>TaskMate © 2026</p>
    </footer>
  </main>
`

// Mengambil elemen form
const form = document.querySelector<HTMLFormElement>('#task-form')!
const titleInput = document.querySelector<HTMLInputElement>('#task-title')!
const courseInput = document.querySelector<HTMLInputElement>('#task-course')!
const deadlineInput = document.querySelector<HTMLInputElement>('#task-deadline')!
const descriptionInput = document.querySelector<HTMLTextAreaElement>('#task-description')!
const taskList = document.querySelector<HTMLDivElement>('#task-list')!
const submitBtn = document.querySelector<HTMLButtonElement>('#submit-btn')!
const cancelBtn = document.querySelector<HTMLButtonElement>('#cancel-btn')!

// Menghitung dan menampilkan statistik
function renderStats(): void {
  totalTasks = tasks.length

  const completed = tasks.filter(task => task.completed).length
  const pending = totalTasks - completed

  document.querySelector('#total-count')!.textContent = String(totalTasks)
  document.querySelector('#completed-count')!.textContent = String(completed)
  document.querySelector('#pending-count')!.textContent = String(pending)
}

// Menampilkan daftar tugas
function renderTasks(): void {
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'Semua') return true
    return currentFilter === 'Selesai'
      ? task.completed
      : !task.completed
  })

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <div>🌷</div>
        <h3>Belum ada tugas</h3>
        <p>Belum ada tugas nih. Yuk, tambahkan tugas pertamamu!</p>
      </div>
    `
  } else {
    taskList.innerHTML = filteredTasks.map(task => {
      const status: TaskStatus = task.completed
        ? 'Selesai'
        : 'Belum Selesai'

      return `
        <article class="task-item ${task.completed ? 'completed' : ''}">
          <div class="task-top">
            <span class="status ${task.completed ? 'done' : 'pending'}">
              ${status}
            </span>
            <span class="task-date">📅 ${escapeHTML(task.deadline)}</span>
          </div>

          <h3>${escapeHTML(task.title)}</h3>
          <p class="course-name">📚 ${escapeHTML(task.course)}</p>
          <p class="task-description">
            ${escapeHTML(task.description || 'Tidak ada deskripsi')}
          </p>

          <div class="task-actions">
            <button class="btn-done" data-action="toggle" data-id="${task.id}">
              ${task.completed ? '↩ Belum Selesai' : '✓ Selesaikan'}
            </button>
            <button class="btn-edit" data-action="edit" data-id="${task.id}">
              ✏ Edit
            </button>
            <button class="btn-delete" data-action="delete" data-id="${task.id}">
              🗑 Hapus
            </button>
          </div>
        </article>
      `
    }).join('')
  }

  renderStats()
  saveData<Task[]>('taskmate-tasks', tasks)
}

// Mengatur ulang form
function resetForm(): void {
  form.reset()
  editingId = null
  document.querySelector('#form-title')!.textContent = 'Tambah Tugas'
  submitBtn.textContent = '+ Tambahkan Tugas'
  cancelBtn.hidden = true
}

// Menambahkan atau mengedit tugas
form.addEventListener('submit', (event: SubmitEvent) => {
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

// Tombol batal edit
cancelBtn.addEventListener('click', resetForm)

// Mengatur aksi edit, hapus, dan status tugas
taskList.addEventListener('click', (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const button = target.closest<HTMLButtonElement>('button[data-action]')

  if (!button) return

  const id = Number(button.dataset.id)
  const action = button.dataset.action
  const selectedTask = tasks.find(task => task.id === id)

  if (!selectedTask) return

  if (action === 'toggle') {
    tasks = tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    )
  }

  if (action === 'delete') {
    const confirmation = confirm('Yakin ingin menghapus tugas ini?')
    if (!confirmation) return

    tasks = tasks.filter(task => task.id !== id)
  }

  if (action === 'edit') {
    editingId = id

    titleInput.value = selectedTask.title
    courseInput.value = selectedTask.course
    deadlineInput.value = selectedTask.deadline
    descriptionInput.value = selectedTask.description

    document.querySelector('#form-title')!.textContent = 'Edit Tugas'
    submitBtn.textContent = 'Simpan Perubahan'
    cancelBtn.hidden = false

    titleInput.focus()
    return
  }

  renderTasks()
})

// Filter daftar tugas
document.querySelectorAll<HTMLButtonElement>('.filter-btn')
  .forEach(button => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.filter as FilterType

      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active')
      })

      button.classList.add('active')
      renderTasks()
    })
  })

// Tampilan awal aplikasi
renderTasks()