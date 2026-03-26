<script setup lang="ts">
// Full-screen recording experience — no bottom nav
useSeoMeta({ title: 'Record Session' })

const router = useRouter()
const route  = useRoute()

// ── State ──
type RecState = 'idle' | 'recording' | 'paused'
const recState  = ref<RecState>('idle')
const mode      = ref<'transcribe' | 'dictate'>('transcribe')

// Permission: persisted in localStorage
const permissionGranted  = ref(false)
const showPermission     = ref(false)
const showPatientSheet   = ref(false)
const showFinishSheet    = ref(false)

onMounted(() => {
  permissionGranted.value = localStorage.getItem('micPermissionGranted') === 'true'
  // Auto-start if navigated from Resume
  if (route.query.autostart === 'true') {
    if (permissionGranted.value) {
      startRecording()
    } else {
      showPermission.value = true
    }
  }
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

function finishSession() {
  if (timerHandle) { clearInterval(timerHandle); timerHandle = null }
  showFinishSheet.value = false
  router.push('/session-detail')
}

onUnmounted(() => {
  if (timerHandle) clearInterval(timerHandle)
})
</script>

<template>
  <div class="session">

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

    <!-- ── Segmented: Transcribe / Dictate ── -->
    <div class="seg-wrap">
      <div class="seg">
        <button class="seg-btn" :class="{ 'seg-on': mode === 'transcribe' }" @click="mode = 'transcribe'">Transcribe</button>
        <button class="seg-btn" :class="{ 'seg-on': mode === 'dictate' }" @click="mode = 'dictate'">Dictate</button>
      </div>
    </div>

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

      <button class="patient-btn" @click="showPatientSheet = true">
        + Add patient details
      </button>

      <!-- Finish session button — only when recording/paused -->
      <Transition name="finish-reveal">
        <button v-if="recState !== 'idle'" class="btn-finish" @click="showFinishSheet = true">
          <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
          Finish session
        </button>
      </Transition>

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

    <!-- ── Patient details bottom sheet ── -->
    <Transition name="fade">
      <div v-if="showPatientSheet" class="sheet-overlay" @click="showPatientSheet = false" />
    </Transition>
    <Transition name="slide-up">
      <div v-if="showPatientSheet" class="sheet">
        <div class="drag-handle-row"><div class="drag-handle" /></div>
        <button class="sheet-close" @click="showPatientSheet = false">
          <UIcon name="i-lucide-x" class="w-4 h-4" />
        </button>
        <div class="sheet-content">
          <h3 class="sheet-title">Patient details</h3>
          <div class="patient-input-wrap">
            <UIcon name="i-lucide-search" class="w-4 h-4 text-white/30" />
            <span class="patient-input-placeholder">Search or add patient…</span>
          </div>
          <p class="sheet-sub">Recent patients</p>
          <div class="recent-patients">
            <div v-for="name in ['Sarah Johnson', 'Marcus Webb', 'Elena Rossi']" :key="name" class="recent-row">
              <div class="recent-avatar">{{ name.split(' ').map(n => n[0]).join('') }}</div>
              <span class="recent-name">{{ name }}</span>
              <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-white/20 ml-auto" />
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Finish session bottom sheet ── -->
    <Transition name="fade">
      <div v-if="showFinishSheet" class="sheet-overlay" @click="showFinishSheet = false" />
    </Transition>
    <Transition name="slide-up">
      <div v-if="showFinishSheet" class="sheet sheet-finish">
        <div class="drag-handle-row"><div class="drag-handle" /></div>
        <div class="sheet-content finish-content">
          <!-- Icon -->
          <div class="finish-icon-wrap">
            <div class="finish-icon-outer">
              <div class="finish-icon-inner">
                <UIcon name="i-lucide-check" class="w-7 h-7" style="color: #E83D59;" />
              </div>
            </div>
          </div>

          <h3 class="finish-title">Are you done with this session?</h3>
          <p class="finish-desc">
            The recording will be saved and ready for transcription and note generation.
          </p>

          <button class="btn-finish-confirm" @click="finishSession">
            <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
            Yes, finish session
          </button>
          <button class="btn-keep-listening" @click="showFinishSheet = false">
            Keep listening
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
/* ── Root ─────────────────────────────────────── */
.session {
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

/* ── Segmented control ───────────────────────── */
.seg-wrap { padding: 6px 20px 0; flex-shrink: 0; }
.seg {
  display: flex;
  background: rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 3px;
  gap: 3px;
}
.seg-btn {
  flex: 1;
  padding: 9px 12px;
  border-radius: 9px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.35);
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  -webkit-tap-highlight-color: transparent;
}
.seg-on {
  background: #1a1f3a;
  color: #ffffff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

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

/* Patient button */
.patient-btn {
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
.patient-btn:active { color: rgba(255,255,255,0.6); }

/* Finish session button */
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

/* Add context card */
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
.dialog-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}
.dialog-desc {
  font-size: 12.5px;
  color: rgba(255,255,255,0.45);
  line-height: 1.55;
}
.dialog-footer {
  display: flex;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.dialog-sep {
  width: 1px;
  background: rgba(255,255,255,0.08);
  flex-shrink: 0;
}
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
  max-height: 70%;
  overflow-y: auto;
  overscroll-behavior: contain;
}
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
.sheet-content { padding: 4px 20px 36px; }
.sheet-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
  margin-bottom: 16px;
}
.patient-input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #181d38;
  border: 1.5px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 20px;
}
.patient-input-placeholder {
  font-size: 14px;
  color: rgba(255,255,255,0.22);
}
.sheet-sub {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.25);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}
.recent-patients { display: flex; flex-direction: column; gap: 2px; }
.recent-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 4px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.12s;
}
.recent-row:active { background: rgba(255,255,255,0.04); }
.recent-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(232,61,89,0.15);
  color: #E83D59;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}
.recent-name {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.8);
}

/* ── Finish sheet ─────────────────────────────── */
.sheet-finish { max-height: 55%; }
.finish-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 8px;
  padding-bottom: 40px;
}
.finish-icon-wrap {
  margin-bottom: 20px;
}
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
.finish-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
  line-height: 1.2;
}
.finish-desc {
  font-size: 14px;
  color: rgba(255,255,255,0.4);
  line-height: 1.5;
  margin-bottom: 28px;
  padding: 0 8px;
}
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

.rings-fade-enter-active { transition: opacity 0.3s ease; }
.rings-fade-leave-active { transition: opacity 0.3s ease; }
.rings-fade-enter-from, .rings-fade-leave-to { opacity: 0; }

.label-swap-enter-active { transition: all 0.18s ease-out; }
.label-swap-leave-active { transition: all 0.12s ease-in; }
.label-swap-enter-from { opacity: 0; transform: translateY(6px); }
.label-swap-leave-to   { opacity: 0; transform: translateY(-6px); }

.finish-reveal-enter-active { transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1); }
.finish-reveal-leave-active { transition: all 0.15s ease-in; }
.finish-reveal-enter-from, .finish-reveal-leave-to { opacity: 0; transform: translateY(6px); }
</style>
