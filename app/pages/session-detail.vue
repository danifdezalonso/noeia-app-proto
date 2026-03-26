<script setup lang="ts">
definePageMeta({ layout: 'detail' })
useSeoMeta({ title: 'Session Detail' })

const router = useRouter()
const { showToast } = useToast()

// ── Header state ──
const isFlagged = ref(false)
function toggleFlag() {
  isFlagged.value = !isFlagged.value
  showToast(isFlagged.value ? 'Session flagged for review' : 'Flag removed')
}

// ── Transcript ──
type TurnRole = 'therapist' | 'patient'
interface Turn {
  id: number
  role: TurnRole
  text: string
}

const transcript: Turn[] = [
  { id: 1,  role: 'therapist', text: 'Good morning, María. How are you feeling today compared to last week?' },
  { id: 2,  role: 'patient',   text: 'A little better, I think. I managed to go for a walk twice, like we talked about.' },
  { id: 3,  role: 'therapist', text: 'That\'s a real step forward. What did you notice during those walks — any thoughts or feelings that came up?' },
  { id: 4,  role: 'patient',   text: 'Mostly okay. But on Wednesday there was this moment where I started thinking about work again and it just... spiraled.' },
  { id: 5,  role: 'therapist', text: 'Can you tell me more about what that spiral looked like for you?' },
  { id: 6,  role: 'patient',   text: 'I started thinking about the presentation I have next month and then I\'m thinking about what happens if I mess it up, and then I\'m thinking about losing my job, and... yeah.' },
  { id: 7,  role: 'therapist', text: 'That\'s a very familiar pattern — the "what if" chain. Did you notice when it started, or did it catch you off guard?' },
  { id: 8,  role: 'patient',   text: 'I noticed maybe halfway through. I tried the grounding thing but I couldn\'t really focus on it.' },
  { id: 9,  role: 'therapist', text: 'You caught it mid-spiral — that\'s actually meaningful. Which part of the grounding felt hard to access?' },
  { id: 10, role: 'patient',   text: 'The sensory part. Like, naming things I could see. My brain just wouldn\'t slow down enough.' },
  { id: 11, role: 'therapist', text: 'Let\'s work on a shorter version — something with fewer steps that might be easier to grab quickly when you\'re already activated.' },
  { id: 12, role: 'patient',   text: 'That would help. Sometimes the full thing feels like too much when I\'m already in it.' },
  { id: 13, role: 'therapist', text: 'Exactly. For next week, I want you to try just one anchor — a physical sensation, like your feet on the floor. That\'s it.' },
  { id: 14, role: 'patient',   text: 'Okay. Just that one thing. I can probably do that.' },
  { id: 15, role: 'therapist', text: 'Perfect. And remember — catching it at all, even late, is the skill. We\'re building the muscle, not expecting perfection.' },
]

// ── Highlight feature ──
const highlightMode = ref(false)
const highlighted   = ref(new Set<number>())

function toggleHighlight(id: number) {
  if (!highlightMode.value) return
  if (highlighted.value.has(id)) {
    highlighted.value.delete(id)
  } else {
    highlighted.value.add(id)
  }
  // Force reactivity on Set mutation
  highlighted.value = new Set(highlighted.value)
}

function toggleHighlightMode() {
  highlightMode.value = !highlightMode.value
  if (highlightMode.value) {
    showToast('Tap any line to highlight it')
  }
}

// ── Bottom sheet state ──
const showTasksSheet    = ref(false)
const showSoapSheet     = ref(false)
const showExportSheet   = ref(false)

// ── Tasks ──
const tasks = ref([
  { id: 1, text: 'Practice 1-anchor grounding technique daily', done: false },
  { id: 2, text: 'Go for at least 3 walks before next session', done: true },
])

function toggleTask(id: number) {
  const task = tasks.value.find(t => t.id === id)
  if (task) task.done = !task.done
}

// ── Export ──
function exportAs(format: string) {
  showExportSheet.value = false
  showToast(`${format} — Coming soon`)
}
</script>

<template>
  <div class="detail-root">

    <!-- ── Header ── -->
    <header class="detail-header">
      <button class="back-btn" aria-label="Back" @click="router.push('/home')">
        <UIcon name="i-lucide-chevron-left" class="w-5 h-5" />
      </button>

      <div class="header-center">
        <p class="patient-name">María García</p>
        <p class="session-meta">25 Mar 2026 · 10:00</p>
        <p class="session-duration">48 min · 32 sec</p>
      </div>

      <button
        class="flag-btn"
        :class="{ 'flag-on': isFlagged }"
        aria-label="Flag session"
        @click="toggleFlag"
      >
        <UIcon name="i-lucide-flag" class="w-4 h-4" />
      </button>
    </header>

    <!-- ── Transcript scroll area ── -->
    <div class="transcript-scroll" :class="{ 'highlight-active': highlightMode }">
      <div
        v-for="turn in transcript"
        :key="turn.id"
        class="turn"
        :class="[
          turn.role === 'therapist' ? 'turn-therapist' : 'turn-patient',
          highlighted.has(turn.id) && 'turn-highlighted'
        ]"
        @click="toggleHighlight(turn.id)"
      >
        <span class="turn-role">{{ turn.role === 'therapist' ? 'Therapist' : 'María' }}</span>
        <p class="turn-text">{{ turn.text }}</p>
      </div>
    </div>

    <!-- ── Action bar ── -->
    <div class="action-bar">
      <div class="action-pills">
        <!-- Resume -->
        <button class="pill" @click="router.push('/session?autostart=true')">
          <UIcon name="i-lucide-mic" class="w-3.5 h-3.5" />
          Resume
        </button>

        <!-- Highlight -->
        <button class="pill" :class="{ 'pill-active': highlightMode }" @click="toggleHighlightMode">
          <UIcon name="i-lucide-highlighter" class="w-3.5 h-3.5" />
          Highlight
        </button>

        <!-- Tasks -->
        <button class="pill" @click="showTasksSheet = true">
          <UIcon name="i-lucide-list-checks" class="w-3.5 h-3.5" />
          Tasks
        </button>

        <!-- SOAP Note -->
        <button class="pill" @click="showSoapSheet = true">
          <UIcon name="i-lucide-file-text" class="w-3.5 h-3.5" />
          SOAP Note
        </button>

        <!-- Export -->
        <button class="pill" @click="showExportSheet = true">
          <UIcon name="i-lucide-share" class="w-3.5 h-3.5" />
          Export
        </button>

        <!-- Flag -->
        <button class="pill" :class="{ 'pill-active': isFlagged }" @click="toggleFlag">
          <UIcon name="i-lucide-flag" class="w-3.5 h-3.5" />
          Flag
        </button>
      </div>
    </div>

    <!-- ── Tasks sheet ── -->
    <Transition name="fade">
      <div v-if="showTasksSheet" class="sheet-overlay" @click="showTasksSheet = false" />
    </Transition>
    <Transition name="slide-up">
      <div v-if="showTasksSheet" class="sheet">
        <div class="drag-handle-row"><div class="drag-handle" /></div>
        <button class="sheet-close" @click="showTasksSheet = false">
          <UIcon name="i-lucide-x" class="w-4 h-4" />
        </button>
        <div class="sheet-content">
          <h3 class="sheet-title">Session tasks</h3>
          <div class="tasks-list">
            <div
              v-for="task in tasks"
              :key="task.id"
              class="task-row"
              :class="{ 'task-done': task.done }"
              @click="toggleTask(task.id)"
            >
              <div class="task-check" :class="{ 'task-check-done': task.done }">
                <UIcon v-if="task.done" name="i-lucide-check" class="w-3 h-3 text-white" />
              </div>
              <span class="task-text">{{ task.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── SOAP Note sheet ── -->
    <Transition name="fade">
      <div v-if="showSoapSheet" class="sheet-overlay" @click="showSoapSheet = false" />
    </Transition>
    <Transition name="slide-up">
      <div v-if="showSoapSheet" class="sheet sheet-tall">
        <div class="drag-handle-row"><div class="drag-handle" /></div>
        <button class="sheet-close" @click="showSoapSheet = false">
          <UIcon name="i-lucide-x" class="w-4 h-4" />
        </button>
        <div class="sheet-content">
          <h3 class="sheet-title">SOAP Note</h3>

          <div class="soap-section">
            <p class="soap-label">S — Subjective</p>
            <p class="soap-text">Patient reports slight improvement in mood. Completed two walks as agreed. Experienced an anxiety spiral mid-walk on Wednesday related to anticipatory worry about an upcoming work presentation.</p>
          </div>
          <div class="soap-section">
            <p class="soap-label">O — Objective</p>
            <p class="soap-text">Patient appeared engaged and reflective. Affect was slightly anxious at times but generally appropriate. Speech was coherent and organized. No vegetative signs observed during session.</p>
          </div>
          <div class="soap-section">
            <p class="soap-label">A — Assessment</p>
            <p class="soap-text">Generalized anxiety with cognitive patterns of catastrophizing (work → failure → job loss chain). Grounding skills partially implemented — patient demonstrated self-awareness mid-episode. Progress noted with behavioral activation goals.</p>
          </div>
          <div class="soap-section">
            <p class="soap-label">P — Plan</p>
            <p class="soap-text">Introduce simplified 1-anchor grounding technique (feet on floor). Continue daily walks (3x minimum before next session). Review anticipatory anxiety patterns in next session. Follow up on presentation outcome.</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Export sheet ── -->
    <Transition name="fade">
      <div v-if="showExportSheet" class="sheet-overlay" @click="showExportSheet = false" />
    </Transition>
    <Transition name="slide-up">
      <div v-if="showExportSheet" class="sheet">
        <div class="drag-handle-row"><div class="drag-handle" /></div>
        <div class="sheet-content">
          <h3 class="sheet-title">Export session</h3>
          <div class="export-options">
            <button class="export-row" @click="exportAs('PDF')">
              <div class="export-icon-wrap">
                <UIcon name="i-lucide-file-text" class="w-5 h-5 text-white/60" />
              </div>
              <div class="export-info">
                <p class="export-name">PDF Report</p>
                <p class="export-desc">Full transcript + SOAP note</p>
              </div>
              <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-white/20 ml-auto" />
            </button>
            <button class="export-row" @click="exportAs('DOCX')">
              <div class="export-icon-wrap">
                <UIcon name="i-lucide-file" class="w-5 h-5 text-white/60" />
              </div>
              <div class="export-info">
                <p class="export-name">Word Document</p>
                <p class="export-desc">Editable .docx format</p>
              </div>
              <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-white/20 ml-auto" />
            </button>
            <button class="export-row" @click="exportAs('EHR')">
              <div class="export-icon-wrap">
                <UIcon name="i-lucide-database" class="w-5 h-5 text-white/60" />
              </div>
              <div class="export-info">
                <p class="export-name">Send to EHR</p>
                <p class="export-desc">Connect to your practice system</p>
              </div>
              <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-white/20 ml-auto" />
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
/* ── Root ─────────────────────────────────────── */
.detail-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #0a0d1a;
  overflow: hidden;
}

/* ── Header ──────────────────────────────────── */
.detail-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px 12px;
  background: rgba(10,13,26,0.96);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}
.back-btn:active { background: rgba(255,255,255,0.12); }

.header-center {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.patient-name {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.session-meta {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
}
.session-duration {
  font-size: 11px;
  color: rgba(255,255,255,0.25);
}

.flag-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.3);
  cursor: pointer;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s, color 0.15s;
}
.flag-btn:active { background: rgba(255,255,255,0.12); }
.flag-btn.flag-on {
  background: rgba(232,61,89,0.12);
  color: #E83D59;
}

/* ── Transcript ──────────────────────────────── */
.transcript-scroll {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 16px 20px 8px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.turn {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 12px;
  transition: background 0.15s;
  cursor: default;
}

.highlight-active .turn {
  cursor: pointer;
}

.turn-highlighted {
  background: rgba(232,61,89,0.1) !important;
  border-left: 2px solid rgba(232,61,89,0.5);
  padding-left: 10px;
}

.turn-role {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.turn-therapist .turn-role { color: #E83D59; }
.turn-patient .turn-role { color: rgba(255,255,255,0.3); }

.turn-text {
  font-size: 14px;
  color: rgba(255,255,255,0.75);
  line-height: 1.55;
}
.turn-therapist .turn-text { color: rgba(255,255,255,0.88); }

.highlight-active .turn:not(.turn-highlighted):hover {
  background: rgba(255,255,255,0.03);
}

/* ── Action bar ──────────────────────────────── */
.action-bar {
  flex-shrink: 0;
  border-top: 1px solid rgba(255,255,255,0.06);
  background: rgba(10,13,26,0.98);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
}
.action-pills {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 2px;
}
.action-pills::-webkit-scrollbar { display: none; }

.pill {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  border-radius: 20px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.09);
  color: rgba(255,255,255,0.65);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  white-space: nowrap;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}
.pill:active { background: rgba(255,255,255,0.12); }
.pill-active {
  background: rgba(232,61,89,0.14);
  border-color: rgba(232,61,89,0.25);
  color: #E83D59;
}

/* ── Sheet base ──────────────────────────────── */
.sheet-overlay {
  position: absolute;
  inset: 0;
  z-index: 40;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}
.sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: #0f1329;
  border-top: 1px solid rgba(255,255,255,0.07);
  border-radius: 26px 26px 0 0;
  max-height: 60%;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.sheet-tall { max-height: 78%; }
.drag-handle-row {
  display: flex;
  justify-content: center;
  padding: 12px 0 4px;
}
.drag-handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255,255,255,0.14);
}
.sheet-close {
  position: absolute;
  top: 12px;
  right: 14px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.45);
  cursor: pointer;
}
.sheet-content { padding: 4px 20px 40px; }
.sheet-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
  margin-bottom: 20px;
}

/* ── Tasks ───────────────────────────────────── */
.tasks-list { display: flex; flex-direction: column; gap: 4px; }
.task-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 4px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.12s;
}
.task-row:active { background: rgba(255,255,255,0.04); }
.task-check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
  transition: background 0.15s, border-color 0.15s;
}
.task-check-done {
  background: #E83D59;
  border-color: #E83D59;
}
.task-text {
  font-size: 14px;
  color: rgba(255,255,255,0.75);
  line-height: 1.45;
  flex: 1;
}
.task-done .task-text {
  color: rgba(255,255,255,0.3);
  text-decoration: line-through;
}

/* ── SOAP Note ───────────────────────────────── */
.soap-section { margin-bottom: 20px; }
.soap-label {
  font-size: 11px;
  font-weight: 700;
  color: #E83D59;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}
.soap-text {
  font-size: 13.5px;
  color: rgba(255,255,255,0.65);
  line-height: 1.6;
}

/* ── Export ──────────────────────────────────── */
.export-options { display: flex; flex-direction: column; gap: 4px; }
.export-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 4px;
  border-radius: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  width: 100%;
  transition: background 0.12s;
  -webkit-tap-highlight-color: transparent;
}
.export-row:active { background: rgba(255,255,255,0.04); }
.export-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.export-info { flex: 1; }
.export-name {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  margin-bottom: 2px;
}
.export-desc {
  font-size: 12px;
  color: rgba(255,255,255,0.3);
}

/* ── Transitions ─────────────────────────────── */
.fade-enter-active { transition: opacity 0.25s ease; }
.fade-leave-active { transition: opacity 0.18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active { transition: transform 0.38s cubic-bezier(0.32, 0.72, 0, 1); }
.slide-up-leave-active { transition: transform 0.26s cubic-bezier(0.4, 0, 1, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
