<script setup lang="ts">
definePageMeta({ layout: 'main' })
useSeoMeta({ title: 'Sessions' })

const router = useRouter()

type Status = 'completed' | 'pending' | 'in-progress'
const activeView = ref<'list' | 'calendar'>('list')

const sessions = [
  { id: 1, patient: 'Sarah Johnson', initials: 'SJ', color: '#4F6EF5', time: '9:00 AM', duration: '45 min', status: 'completed' as Status },
  { id: 2, patient: 'Marcus Webb',   initials: 'MW', color: '#0EA5E9', time: '10:30 AM', duration: '60 min', status: 'pending' as Status },
  { id: 3, patient: 'Elena Rossi',   initials: 'ER', color: '#A78BFA', time: '1:00 PM', duration: '30 min', status: 'in-progress' as Status },
  { id: 4, patient: 'James Park',    initials: 'JP', color: '#34D399', time: '3:30 PM', duration: '45 min', status: 'pending' as Status }
]

const statusConfig: Record<Status, { label: string; color: string; bg: string; icon: string }> = {
  'completed':   { label: 'Completed',             color: '#10B981', bg: 'rgba(16,185,129,0.12)',  icon: 'i-lucide-check-circle' },
  'pending':     { label: 'Pending transcription', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  icon: 'i-lucide-clock' },
  'in-progress': { label: 'In progress',           color: '#60A5FA', bg: 'rgba(96,165,250,0.12)', icon: 'i-lucide-mic' }
}

// ── Calendar strip ──
const today = new Date()
const todayStr = today.toDateString()

const weekDays = computed(() => {
  const dow = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1),
      num: d.getDate(),
      isToday: d.toDateString() === todayStr,
      hasSessions: [0, 2].includes(i)
    }
  })
})

const todayFormatted = today.toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric'
})

// ── Swipe to switch views ──
let _tx = 0
function onTouchStart(e: TouchEvent) { _tx = e.touches[0].clientX }
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - _tx
  if (Math.abs(dx) > 48) activeView.value = dx < 0 ? 'calendar' : 'list'
}

// ── Refresh ──
const spinning = ref(false)
function refresh() {
  if (spinning.value) return
  spinning.value = true
  setTimeout(() => { spinning.value = false }, 900)
}
</script>

<template>
  <div
    class="screen"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <!-- ── Sticky header ── -->
    <header class="top-bar">
      <h1 class="screen-title">Sessions</h1>
      <button class="refresh-btn" :class="{ spinning }" aria-label="Refresh" @click="refresh">
        <UIcon name="i-lucide-refresh-cw" class="w-5 h-5" />
      </button>
    </header>

    <!-- ── Segmented control ── -->
    <div class="seg-wrap">
      <div class="seg">
        <button
          class="seg-btn"
          :class="{ 'seg-active': activeView === 'list' }"
          @click="activeView = 'list'"
        >
          <UIcon name="i-lucide-list" class="w-4 h-4" />
          List
        </button>
        <button
          class="seg-btn"
          :class="{ 'seg-active': activeView === 'calendar' }"
          @click="activeView = 'calendar'"
        >
          <UIcon name="i-lucide-calendar" class="w-4 h-4" />
          Calendar
        </button>
      </div>
    </div>

    <!-- ── Views ── -->
    <Transition name="view-fade" mode="out-in">

      <!-- LIST VIEW -->
      <div v-if="activeView === 'list'" key="list" class="view">
        <p class="day-label">{{ todayFormatted }}</p>

        <div class="session-list">
          <div
            v-for="s in sessions"
            :key="s.id"
            class="session-card"
            @click="router.push('/session')"
          >
            <!-- Avatar -->
            <div
              class="avatar"
              :style="{ background: s.color + '22', color: s.color }"
            >
              {{ s.initials }}
            </div>

            <!-- Info -->
            <div class="session-info">
              <p class="patient-name">{{ s.patient }}</p>
              <p class="session-meta">{{ s.time }} · {{ s.duration }}</p>
              <div
                class="status-badge"
                :style="{ background: statusConfig[s.status].bg, color: statusConfig[s.status].color }"
              >
                <UIcon :name="statusConfig[s.status].icon" class="w-3 h-3" />
                {{ statusConfig[s.status].label }}
              </div>
            </div>

            <!-- Chevron -->
            <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-white/20 shrink-0 ml-auto" />
          </div>
        </div>
      </div>

      <!-- CALENDAR VIEW -->
      <div v-else key="calendar" class="view">
        <!-- Weekly strip -->
        <div class="cal-strip-wrap">
          <div class="cal-strip">
            <div
              v-for="day in weekDays"
              :key="day.num"
              class="cal-day"
              :class="{ 'cal-today': day.isToday }"
            >
              <span class="cal-day-label">{{ day.label }}</span>
              <div class="cal-num-wrap" :class="{ 'cal-today-circle': day.isToday }">
                <span class="cal-num">{{ day.num }}</span>
              </div>
              <span
                v-if="day.hasSessions"
                class="cal-dot"
                :class="day.isToday ? 'cal-dot-today' : ''"
              />
            </div>
          </div>
        </div>

        <!-- Sessions below -->
        <p class="day-label">{{ todayFormatted }}</p>
        <div class="session-list">
          <div
            v-for="s in sessions"
            :key="s.id"
            class="session-card"
            @click="router.push('/session')"
          >
            <div
              class="avatar"
              :style="{ background: s.color + '22', color: s.color }"
            >
              {{ s.initials }}
            </div>
            <div class="session-info">
              <p class="patient-name">{{ s.patient }}</p>
              <p class="session-meta">{{ s.time }} · {{ s.duration }}</p>
              <div
                class="status-badge"
                :style="{ background: statusConfig[s.status].bg, color: statusConfig[s.status].color }"
              >
                <UIcon :name="statusConfig[s.status].icon" class="w-3 h-3" />
                {{ statusConfig[s.status].label }}
              </div>
            </div>
            <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-white/20 shrink-0 ml-auto" />
          </div>
        </div>
      </div>

    </Transition>
  </div>
</template>

<style scoped>
.screen {
  background: #0a0d1a;
  min-height: 100%;
}

/* ── Header ─────────────────────────────────── */
.top-bar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 14px;
  background: rgba(10, 13, 26, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.screen-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
}
.refresh-btn {
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
  transition: color 0.15s, background 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.refresh-btn:active { background: rgba(255,255,255,0.1); color: white; }
.refresh-btn.spinning :deep(svg) {
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Segmented control ───────────────────────── */
.seg-wrap {
  padding: 12px 20px 0;
}
.seg {
  display: flex;
  background: rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 3px;
  gap: 3px;
}
.seg-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
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
.seg-active {
  background: #1a1f3a;
  color: #ffffff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

/* ── View container ──────────────────────────── */
.view { padding: 16px 20px 8px; }

.day-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
}

/* ── Session cards ───────────────────────────── */
.session-list { display: flex; flex-direction: column; gap: 10px; }

.session-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #0e1229;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.session-card:active { background: #131630; }

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.session-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.patient-name {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.session-meta {
  font-size: 12px;
  color: rgba(255,255,255,0.35);
}
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  width: fit-content;
  margin-top: 2px;
}

/* ── Calendar strip ──────────────────────────── */
.cal-strip-wrap {
  background: #0e1229;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 18px;
  padding: 14px 8px;
  margin-bottom: 20px;
}
.cal-strip {
  display: flex;
  justify-content: space-around;
}
.cal-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.cal-day-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.cal-today .cal-day-label { color: #E83D59; }

.cal-num-wrap {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cal-today-circle { background: #E83D59; }

.cal-num {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
}
.cal-today .cal-num { color: #ffffff; }
.cal-today-circle .cal-num { color: #ffffff; }

.cal-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
}
.cal-dot-today { background: #E83D59; }

/* ── View transition ─────────────────────────── */
.view-fade-enter-active,
.view-fade-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.view-fade-enter-from { opacity: 0; transform: translateX(8px); }
.view-fade-leave-to   { opacity: 0; transform: translateX(-8px); }
</style>
