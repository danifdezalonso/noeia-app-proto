<script setup lang="ts">
definePageMeta({ layout: 'main' })
useSeoMeta({ title: 'Settings' })

const router = useRouter()

// Toggle state
const faceId = ref(false)
const pinUnlock = ref(false)

// Delete dialog
const showDeleteDialog = ref(false)

function logout() {
  router.push('/login')
}
</script>

<template>
  <div class="settings-root">

    <!-- ── Header ── -->
    <header class="settings-header">
      <h1 class="settings-title">Settings</h1>
      <button class="done-btn">Done</button>
    </header>

    <div class="settings-body">

      <!-- ── Profile ── -->
      <div class="section-card profile-card">
        <div class="profile-avatar">DF</div>
        <div class="profile-info">
          <p class="profile-name">Dani Fer</p>
          <p class="profile-username">dani-test</p>
          <p class="profile-email">dani@noeia.app</p>
        </div>
        <UIcon name="i-lucide-chevron-right" class="w-4 h-4 row-chevron" />
      </div>

      <!-- ── Privacy & Security ── -->
      <div class="section">
        <p class="section-header">Privacy & Security</p>
        <div class="section-card rows-card">
          <!-- Microphone -->
          <div class="row">
            <span class="row-label">Microphone permissions</span>
            <UIcon name="i-lucide-chevron-right" class="row-chevron" />
          </div>
          <div class="row-divider" />
          <!-- Face ID -->
          <div class="row">
            <span class="row-label">Face ID unlock</span>
            <AppToggle v-model="faceId" />
          </div>
          <div class="row-divider" />
          <!-- PIN -->
          <div class="row">
            <span class="row-label">PIN unlock</span>
            <AppToggle v-model="pinUnlock" />
          </div>
        </div>
      </div>

      <!-- ── Defaults ── -->
      <div class="section">
        <p class="section-header">Defaults</p>
        <div class="section-card rows-card">
          <div class="row">
            <span class="row-label">Note</span>
            <UIcon name="i-lucide-chevron-right" class="row-chevron" />
          </div>
          <div class="row-divider" />
          <div class="row">
            <span class="row-label">Voice</span>
            <div class="row-right">
              <span class="row-value">Goldilocks</span>
              <UIcon name="i-lucide-chevron-right" class="row-chevron" />
            </div>
          </div>
          <div class="row-divider" />
          <div class="row">
            <span class="row-label">Scribe</span>
            <div class="row-right">
              <span class="row-value">Fast</span>
              <UIcon name="i-lucide-chevron-right" class="row-chevron" />
            </div>
          </div>
          <div class="row-divider" />
          <div class="row">
            <span class="row-label row-label-brand">Input Language</span>
            <div class="row-right">
              <span class="row-value row-value-dim">Not set</span>
              <UIcon name="i-lucide-chevron-right" class="row-chevron" />
            </div>
          </div>
          <div class="row-divider" />
          <div class="row">
            <span class="row-label row-label-brand">Output Language</span>
            <div class="row-right">
              <span class="row-value">English</span>
              <UIcon name="i-lucide-chevron-right" class="row-chevron" />
            </div>
          </div>
        </div>
      </div>

      <!-- ── Troubleshooting ── -->
      <div class="section">
        <p class="section-header">Troubleshooting</p>
        <div class="section-card rows-card">
          <div class="row">
            <span class="row-label">Get help</span>
            <UIcon name="i-lucide-chevron-right" class="row-chevron" />
          </div>
          <div class="row-divider" />
          <div class="row">
            <span class="row-label">Check for update</span>
            <UIcon name="i-lucide-chevron-right" class="row-chevron" />
          </div>
        </div>
        <p class="version-text">Noeia iOS version: 0.1.0 (prototype)</p>
      </div>

      <!-- ── Danger zone ── -->
      <div class="danger-section">
        <button class="danger-btn" @click="showDeleteDialog = true">
          Delete my account
        </button>
        <div class="row-divider danger-divider" />
        <button class="danger-btn" @click="logout">
          Log out
        </button>
      </div>

    </div><!-- end body -->

    <!-- ── Delete confirmation dialog ── -->
    <Transition name="fade">
      <div v-if="showDeleteDialog" class="dialog-backdrop" @click.self="showDeleteDialog = false">
        <div class="dialog-card">
          <div class="dialog-icon-wrap">
            <UIcon name="i-lucide-triangle-alert" class="w-6 h-6" style="color: #E83D59;" />
          </div>
          <h3 class="dialog-title">Delete account?</h3>
          <p class="dialog-body">
            This action cannot be undone. All your data will be permanently deleted.
          </p>
          <div class="dialog-actions">
            <button class="dialog-cancel" @click="showDeleteDialog = false">Cancel</button>
            <button class="dialog-delete" @click="showDeleteDialog = false">Delete</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
/* ── Root ────────────────────────────────────── */
.settings-root {
  background: #0a0d1a;
  min-height: 100%;
  position: relative;
}

/* ── Header ──────────────────────────────────── */
.settings-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 20px 20px 14px;
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(10,13,26,0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.settings-title {
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
}
.done-btn {
  font-size: 15px;
  font-weight: 600;
  color: #E83D59;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
}

/* ── Body ────────────────────────────────────── */
.settings-body {
  padding: 16px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ── Section ─────────────────────────────────── */
.section { display: flex; flex-direction: column; gap: 6px; }
.section-header {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0 4px;
  margin-top: 8px;
}

/* ── Cards ───────────────────────────────────── */
.section-card {
  background: #0e1229;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
}

/* Profile card */
.profile-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  cursor: pointer;
}
.profile-avatar {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #E83D59;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
}
.profile-info { flex: 1; }
.profile-name {
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
}
.profile-username {
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  margin-top: 1px;
}
.profile-email {
  font-size: 12px;
  color: rgba(255,255,255,0.3);
  margin-top: 1px;
}

/* Rows card */
.rows-card { overflow: hidden; }

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  gap: 12px;
  cursor: pointer;
  transition: background 0.12s;
  -webkit-tap-highlight-color: transparent;
}
.row:active { background: rgba(255,255,255,0.04); }

.row-label {
  font-size: 14px;
  color: rgba(255,255,255,0.85);
  flex: 1;
}
.row-label-brand { color: #E83D59; }

.row-right {
  display: flex;
  align-items: center;
  gap: 4px;
}
.row-value {
  font-size: 14px;
  color: rgba(255,255,255,0.4);
}
.row-value-dim { color: rgba(255,255,255,0.25); }

.row-chevron {
  width: 16px;
  height: 16px;
  color: rgba(255,255,255,0.2);
  flex-shrink: 0;
}

.row-divider {
  height: 1px;
  background: rgba(255,255,255,0.05);
  margin: 0 16px;
}

/* ── Version text ────────────────────────────── */
.version-text {
  font-size: 12px;
  color: rgba(255,255,255,0.2);
  text-align: center;
  padding: 8px 4px 0;
}

/* ── Danger zone ─────────────────────────────── */
.danger-section {
  background: #0e1229;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  overflow: hidden;
  margin-top: 8px;
}
.danger-btn {
  width: 100%;
  padding: 15px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  color: #E83D59;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.12s;
}
.danger-btn:active { background: rgba(232,61,89,0.06); }
.danger-divider { margin: 0; }

/* ── Delete dialog ───────────────────────────── */
.dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.dialog-card {
  background: #131729;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 22px;
  padding: 28px 22px 22px;
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  animation: popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.dialog-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: rgba(232,61,89,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}
.dialog-title {
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
}
.dialog-body {
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  line-height: 1.5;
  margin-bottom: 4px;
}
.dialog-actions {
  display: flex;
  gap: 10px;
  width: 100%;
  margin-top: 6px;
}
.dialog-cancel, .dialog-delete {
  flex: 1;
  padding: 13px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.dialog-cancel { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); }
.dialog-delete { background: #E83D59; color: #ffffff; }
.dialog-cancel:active, .dialog-delete:active { opacity: 0.8; }

/* ── Transitions ─────────────────────────────── */
.fade-enter-active { transition: opacity 0.2s ease; }
.fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes popIn {
  from { opacity: 0; transform: scale(0.88) translateY(10px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
}
</style>
