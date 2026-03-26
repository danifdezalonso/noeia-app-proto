<script setup lang="ts">
// Full-screen recording experience — Tab 2 (no patient context, assign after)
useSeoMeta({ title: 'New Recording' })

const router = useRouter()

// ── State ──
type RecState = 'idle' | 'recording' | 'paused'
const recState = ref<RecState>('idle')

const permissionGranted = ref(false)
const showPermission    = ref(false)
const showFinishSheet   = ref(false)
const showAssignSheet   = ref(false)
const selectedSession   = ref<number | null>(null)

onMounted(() => {
  permissionGranted.value = localStorage.getItem('micPermissionGranted') === 'true'
})

// ── Timer ──
const elapsed = ref(0)
let timerHandle: ReturnType<typeof setInterval> | null = null

const timerDisplay = computed(() => {
  const m = Math.floor(elapsed.value / 60).toString()
  const s = String(elapsed.value % 60).padStart(2, '0')
  return `${m}:${s}`
})

// ── Controls ──
function handleMicTap() {
  if (recState.value === 'idle') {
    if (!permissionGranted.value) {
      showPermission.value = true
    } else {
      startRecording()
    }
  } else {
    showFinishSheet.value = true
  }
}

function allowMic() {
  permissionGranted.value = true
  localStorage.setItem('micPermissionGranted', 'true')
  showPermission.value = false
  startRecording()
}

function denyMic() {
  showPermission.value = false
}

function startRecording() {
  recState.value = 'recording'
  elapsed.value = 0
  timerHandle = setInterval(() => { elapsed.value++ }, 1000)
}

function togglePause() {
  if (recState.value === 'recording') {
    recState.value = 'paused'
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null }
  } else if (recState.value === 'paused') {
    recState.value = 'recording'
    timerHandle = setInterval(() => { elapsed.value++ }, 1000)
  }
}

function confirmFinish() {
  if (timerHandle) { clearInterval(timerHandle); timerHandle = null }
  showFinishSheet.value = false
  showAssignSheet.value = true
}

function assignToSession() {
  showAssignSheet.value = false
  router.push('/session-detail')
}

function saveAsNew() {
  showAssignSheet.value = false
  router.push('/session-detail')
}

onUnmounted(() => {
  if (timerHandle) clearInterval(timerHandle)
})

// ── Mock sessions for assign sheet ──
const assignSearch = ref('')
const mockSessions = [
  { id: 1, patient: 'Sarah Johnson', initials: 'SJ', color: '#4F6EF5', time: '9:00 AM', date: 'Today' },
  { id: 2, patient: 'Marcus Webb',   initials: 'MW', color: '#0EA5E9', time: '10:30 AM', date: 'Today' },
  { id: 3, patient: 'Elena Rossi',   initials: 'ER', color: '#A78BFA', time: '1:00 PM', date: 'Today' },
  { id: 4, patient: 'James Park',    initials: 'JP', color: '#34D399', time: '3:30 PM', date: 'Today' },
]

const filteredSessions = computed(() =>
  mockSessions.filter(s =>
    s.patient.toLowerCase().includes(assignSearch.value.toLowerCase())
  )
)
</script>

<template>
  <div class="recording">

    <!-- ── Top bar ── -->
    <header class="top-bar">
      <div class="top-spacer" />

      <button class="source-selector">
        <UIcon name="i-lucide-mic" class="w-[15px] h-[15px] text-white/70" />
        <span>iPhone Microphone</span>
        <UIcon name="i-lucide-chevron-down" class="w-4 h-4 text-white/40" />
      </button>

      <button class="dismiss-btn" aria-label="Back" @click="router.push('/home')">
        <UIcon name="i-lucide-chevron-down" class="w-5 h-5" />
      </button>
    </header>

    <!-- ── Center stage ── -->
    <div class="center-stage">
      <div class="mic-area">
        <Transition name="rings-fade">
          <div v-if="recState !== 'idle'" class="rings">
            <div class="ring" :class="['ring-1', recState === 'paused' && 'rings-paused']" />
            <div class="ring" :class="['ring-2', recState === 'paused' && 'rings-paused']" />
            <div class="ring" :class="['ring-3', recState === 'paused' && 'rings-paused']" />
          </div>
        </Transition>

        <button class="mic-btn" @click="handleMicTap">
          <UIcon
            :name="recState !== 'idle' ? 'i-lucide-square' : 'i-lucide-mic'"
            class="btn-icon"
          />
        </button>
      </div>

      <Transition name="label-swap" mode="out-in">
        <span v-if="recState === 'idle'" key="label" class="tap-label">Tap to start</span>
        <button v-else key="pause" class="pause-pill" @click="togglePause">
          <UIcon :name="recState === 'paused' ? 'i-lucide-play' : 'i-lucide-pause'" class="w-4 h-4" />
          {{ recState === 'paused' ? 'Resume' : 'Pause' }}
        </button>
      </Transition>
    </div>

    <!-- ── Bottom section ── -->
    <div class="bottom-section">
      <div class="timer-row">
        <span v-if="recState === 'recording'" class="rec-dot" />
        <UIcon v-else name="i-lucide-timer" class="w-4 h-4 text-white/30" />
        <span class="timer-text" :class="{ 'timer-active': recState !== 'idle' }">
          {{ timerDisplay }}
        </span>
      </div>

      <!-- Assign to session placeholder -->
      <button class="assign-btn" @click="showAssignSheet = true">
        + Assign to session
      </button>

      <!-- Finish recording — only when active -->
      <Transition name="finish-reveal">
        <button v-if="recState !== 'idle'" class="btn-finish" @click="showFinishSheet = true">
          <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
          Finish recording
        </button>
      </Transition>

      <!-- Context card -->
      <div class="context-card">
        <div class="context-text">
          <p class="context-title">Add context</p>
          <p class="context-sub">Add notes you'd like the transcription to take into account</p>
        </div>
        <UIcon name="i-lucide-paperclip" class="w-5 h-5 text-white/25 shrink-0" />
      </div>
    </div>

    <!-- ── Mic permission dialog ── -->
    <Transition name="fade">
      <div v-if="showPermission" class="dialog-backdrop">
        <div class="permission-dialog">
          <div class="dialog-body">
            <LogoMark :size="52" />
            <p class="dialog-title">"Noeia" Would Like to Access the Microphone</p>
            <p class="dialog-desc">
              This app uses the microphone to record sessions with your patients.
              Recordings are transcribed and analyzed to help you document consultations.
            </p>
          </div>
          <div class="dialog-footer">
            <button class="dialog-deny" @click="denyMic">Don't Allow</button>
            <div class="dialog-sep" />
            <button class="dialog-allow" @click="allowMic">Allow</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Finish recording bottom sheet ── -->
    <Transition name="fade">
      <div v-if="showFinishSheet" class="sheet-overlay" @click="showFinishSheet = false" />
    </Transition>
    <Transition name="slide-up">
      <div v-if="showFinishSheet" class="sheet sheet-finish">
        <div class="drag-handle-row"><div class="drag-handle" /></div>
        <div class="sheet-content finish-content">
          <div class="finish-icon-wrap">
            <div class="finish-icon-outer">
              <div class="finish-icon-inner">
                <UIcon name="i-lucide-check" class="w-7 h-7" style="color: #E83D59;" />
              </div>
            </div>
          </div>
          <h3 class="finish-title">Done recording?</h3>
          <p class="finish-desc">
            You can assign this recording to an existing session or save it as a new one.
          </p>
          <button class="btn-finish-confirm" @click="confirmFinish">
            <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
            Yes, finish
          </button>
          <button class="btn-keep-listening" @click="showFinishSheet = false">
            Keep listening
          </button>
        </div>
      </div>
    </Transition>

    <!-- ── Assign to session sheet ── -->
    <Transition name="fade">
      <div v-if="showAssignSheet" class="sheet-overlay" @click="showAssignSheet = false" />
    </Transition>
    <Transition name="slide-up">
      <div v-if="showAssignSheet" class="sheet sheet-assign">
        <div class="drag-handle-row"><div class="drag-handle" /></div>
        <button class="sheet-close" @click="showAssignSheet = false">
          <UIcon name="i-lucide-x" class="w-4 h-4" />
        </button>
        <div class="sheet-content">
          <h3 class="sheet-title">Assign to session</h3>

          <!-- Search -->
          <div class="search-wrap">
            <UIcon name="i-lucide-search" class="w-4 h-4 text-white/30 shrink-0" />
            <input
              v-model="assignSearch"
              class="search-input"
              placeholder="Search sessions…"
              type="search"
            />
          </div>

          <!-- Session list -->
          <div class="assign-list">
            <div
              v-for="s in filteredSessions"
              :key="s.id"
              class="assign-row"
              :class="{ 'assign-selected': selectedSession === s.id }"
              @click="selectedSession = s.id"
            >
              <div class="assign-avatar" :style="{ background: s.color + '22', color: s.color }">
                {{ s.initials }}
              </div>
              <div class="assign-info">
                <p class="assign-name">{{ s.patient }}</p>
                <p class="assign-meta">{{ s.date }} · {{ s.time }}</p>
              </div>
              <div v-if="selectedSession === s.id" class="assign-check">
                <UIcon name="i-lucide-check" class="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          <!-- CTAs -->
          <div class="assign-ctas">
            <button
              class="btn-assign"
              :class="{ 'btn-assign-disabled': selectedSession === null }"
              :disabled="selectedSession === null"
              @click="assignToSession"
            >
              Assign to selected session
            </button>
            <button class="btn-save-new" @click="saveAsNew">
              Save as new session
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
/* ── Root ─────────────────────────────────────── */
.recording {
  background: #0a0d1a;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* ── Top bar ─────────────────────────────────── */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
  flex-shrink: 0;
}
.top-spacer { width: 40px; }

.source-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 20px;
  background: rgba(255,255,255,0.06);
  border: none;
  color: rgba(255,255,255,0.85);
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}
.source-selector:active { background: rgba(255,255,255,0.1); }

.dismiss-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}
.dismiss-btn:active { background: rgba(255,255,255,0.12); }

/* ── Center stage ────────────────────────────── */
.center-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 16px;
}

/* ── Mic area + rings ────────────────────────── */
.mic-area {
  position: relative;
  width: 240px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rings {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ring {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1.5px solid rgba(232, 61, 89, 0.4);
  animation: ringPulse 2.4s cubic-bezier(0.3, 0, 0.7, 1) infinite;
}
.ring-1 { animation-delay: 0s; }
.ring-2 { animation-delay: 0.8s; }
.ring-3 { animation-delay: 1.6s; }
.rings-paused { animation-play-state: paused; opacity: 0.3; }

@keyframes ringPulse {
  0%   { transform: scale(1);   opacity: 0.55; }
  100% { transform: scale(2.5); opacity: 0; }
}

/* ── Main button ─────────────────────────────── */
.mic-btn {
  position: relative;
  z-index: 2;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #E83D59;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow:
    0 0 0 8px rgba(232, 61, 89, 0.1),
    0 12px 40px rgba(232, 61, 89, 0.4);
  transition: transform 0.12s, box-shadow 0.12s;
  -webkit-tap-highlight-color: transparent;
}
.mic-btn:active {
  transform: scale(0.93);
  box-shadow:
    0 0 0 8px rgba(232, 61, 89, 0.07),
    0 6px 20px rgba(232, 61, 89, 0.3);
}
.btn-icon { width: 36px; height: 36px; color: #ffffff; }

/* ── Tap label / Pause pill ──────────────────── */
.tap-label {
  font-size: 14px;
  color: rgba(255,255,255,0.35);
  letter-spacing: 0.01em;
}
.pause-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 24px;
  background: rgba(255,255,255,0.09);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.8);
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.pause-pill:active { background: rgba(255,255,255,0.14); }

/* ── Bottom section ──────────────────────────── */
.bottom-section {
  flex-shrink: 0;
  padding: 0 20px 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Timer */
.timer-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 2px;
}
.rec-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #E83D59;
  flex-shrink: 0;
  animation: blink 1s ease-in-out infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.25; }
}
.timer-text {
  font-size: 17px;
  font-weight: 600;
  color: rgba(255,255,255,0.3);
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
}
.timer-active { color: rgba(255,255,255,0.8); }

/* Assign button */
.assign-btn {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.35);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 2px;
  font-family: inherit;
  text-align: left;
  transition: color 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.assign-btn:active { color: rgba(255,255,255,0.6); }

/* Finish recording button */
.btn-finish {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  border-radius: 16px;
  background: #E83D59;
  border: none;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
}
.btn-finish:active { opacity: 0.85; transform: scale(0.98); }

/* Context card */
.context-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #0e1229;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 14px 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}
.context-card:active { background: #131630; }
.context-text { flex: 1; }
.context-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255,255,255,0.75);
  margin-bottom: 3px;
}
.context-sub {
  font-size: 12px;
  color: rgba(255,255,255,0.3);
  line-height: 1.4;
}

/* ── Permission dialog ───────────────────────── */
.dialog-backdrop {
  position: absolute;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.permission-dialog {
  width: 272px;
  background: rgba(22, 26, 48, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 22px;
  overflow: hidden;
  animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.dialog-body {
  padding: 26px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}
.dialog-title { font-size: 16px; font-weight: 700; color: #ffffff; line-height: 1.3; }
.dialog-desc { font-size: 12.5px; color: rgba(255,255,255,0.45); line-height: 1.55; }
.dialog-footer { display: flex; border-top: 1px solid rgba(255,255,255,0.08); }
.dialog-sep { width: 1px; background: rgba(255,255,255,0.08); flex-shrink: 0; }
.dialog-deny, .dialog-allow {
  flex: 1;
  padding: 15px 8px;
  border: none;
  background: none;
  font-size: 15px;
  font-family: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.12s;
}
.dialog-deny { color: rgba(255,255,255,0.45); }
.dialog-deny:active { background: rgba(255,255,255,0.04); }
.dialog-allow { color: #E83D59; font-weight: 600; }
.dialog-allow:active { background: rgba(232,61,89,0.08); }

/* ── Bottom sheets ───────────────────────────── */
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
.drag-handle-row { display: flex; justify-content: center; padding: 12px 0 4px; }
.drag-handle { width: 36px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.14); }
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
.sheet-content { padding: 4px 20px 36px; }
.sheet-title { font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.01em; margin-bottom: 16px; }

/* Finish sheet */
.sheet-finish { max-height: 55%; }
.finish-content { display: flex; flex-direction: column; align-items: center; text-align: center; padding-top: 8px; padding-bottom: 40px; }
.finish-icon-wrap { margin-bottom: 20px; }
.finish-icon-outer {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(232,61,89,0.08);
  border: 1.5px solid rgba(232,61,89,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.finish-icon-inner {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(232,61,89,0.14);
  border: 1.5px solid rgba(232,61,89,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.finish-title { font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; margin-bottom: 10px; line-height: 1.2; }
.finish-desc { font-size: 14px; color: rgba(255,255,255,0.4); line-height: 1.5; margin-bottom: 28px; padding: 0 8px; }
.btn-finish-confirm {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  border-radius: 16px;
  background: #E83D59;
  border: none;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  letter-spacing: -0.01em;
  cursor: pointer;
  margin-bottom: 10px;
  transition: opacity 0.15s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
}
.btn-finish-confirm:active { opacity: 0.85; transform: scale(0.98); }
.btn-keep-listening {
  width: 100%;
  padding: 15px 24px;
  border-radius: 16px;
  background: rgba(255,255,255,0.06);
  border: none;
  color: rgba(255,255,255,0.45);
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.btn-keep-listening:active { background: rgba(255,255,255,0.1); }

/* Assign sheet */
.sheet-assign { max-height: 78%; }

.search-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #181d38;
  border: 1.5px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 11px 14px;
  margin-bottom: 14px;
}
.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  font-family: inherit;
}
.search-input::placeholder { color: rgba(255,255,255,0.22); }

.assign-list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 20px; }
.assign-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 10px;
  border-radius: 14px;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;
  -webkit-tap-highlight-color: transparent;
}
.assign-row:active { background: rgba(255,255,255,0.04); }
.assign-selected {
  background: rgba(232,61,89,0.06);
  border-color: rgba(232,61,89,0.25);
  border-left-width: 3px;
}
.assign-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}
.assign-info { flex: 1; min-width: 0; }
.assign-name { font-size: 14px; font-weight: 600; color: #ffffff; }
.assign-meta { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 1px; }
.assign-check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #E83D59;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.assign-ctas { display: flex; flex-direction: column; gap: 10px; }
.btn-assign {
  width: 100%;
  padding: 16px 24px;
  border-radius: 16px;
  background: #E83D59;
  border: none;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
}
.btn-assign:active { opacity: 0.85; transform: scale(0.98); }
.btn-assign-disabled { opacity: 0.35; cursor: default; }
.btn-save-new {
  width: 100%;
  padding: 15px 24px;
  border-radius: 16px;
  background: rgba(255,255,255,0.06);
  border: none;
  color: rgba(255,255,255,0.45);
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.btn-save-new:active { background: rgba(255,255,255,0.1); }

/* ── Animations ──────────────────────────────── */
@keyframes popIn {
  from { opacity: 0; transform: scale(0.88) translateY(8px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
}
.fade-enter-active { transition: opacity 0.25s ease; }
.fade-leave-active { transition: opacity 0.18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active { transition: transform 0.38s cubic-bezier(0.32, 0.72, 0, 1); }
.slide-up-leave-active { transition: transform 0.26s cubic-bezier(0.4, 0, 1, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

.rings-fade-enter-active, .rings-fade-leave-active { transition: opacity 0.3s ease; }
.rings-fade-enter-from, .rings-fade-leave-to { opacity: 0; }

.label-swap-enter-active { transition: all 0.18s ease-out; }
.label-swap-leave-active { transition: all 0.12s ease-in; }
.label-swap-enter-from { opacity: 0; transform: translateY(6px); }
.label-swap-leave-to   { opacity: 0; transform: translateY(-6px); }

.finish-reveal-enter-active { transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1); }
.finish-reveal-leave-active { transition: all 0.15s ease-in; }
.finish-reveal-enter-from, .finish-reveal-leave-to { opacity: 0; transform: translateY(6px); }
</style>
