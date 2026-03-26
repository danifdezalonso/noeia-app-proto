<script setup lang="ts">
const route = useRoute()
const isActive = (path: string) => route.path === path
</script>

<template>
  <nav class="bottom-nav">
    <!-- Tab: Sessions -->
    <NuxtLink to="/home" class="tab" :class="{ active: isActive('/home') }">
      <UIcon name="i-lucide-calendar-days" class="tab-icon" />
      <span class="tab-label">Sessions</span>
    </NuxtLink>

    <!-- Tab: New Recording (FAB) -->
    <NuxtLink to="/recording" class="tab-fab-col">
      <div class="fab" :class="{ 'fab-on': isActive('/recording') }">
        <UIcon name="i-lucide-mic" class="fab-icon" />
      </div>
    </NuxtLink>

    <!-- Tab: Settings -->
    <NuxtLink to="/settings" class="tab" :class="{ active: isActive('/settings') }">
      <UIcon name="i-lucide-settings-2" class="tab-icon" />
      <span class="tab-label">Settings</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  /* Sticks to the bottom of .main-layout */
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  background: #09111f;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  height: calc(60px + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  /* Let the FAB overflow upward */
  overflow: visible;
}

/* ── Regular tabs ─── */
.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding-bottom: 6px;
  height: 60px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.3);
  transition: color 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.tab.active {
  color: #E83D59;
}
.tab-icon {
  width: 22px;
  height: 22px;
  transition: transform 0.15s;
}
.tab.active .tab-icon {
  transform: scale(1.08);
}
.tab-label {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.01em;
}

/* ── Center FAB column ─── */
.tab-fab-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Pull the FAB up above the nav bar */
  margin-top: -22px;
  padding-bottom: 6px;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

/* ── FAB button ─── */
.fab {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #E83D59;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 0 0 6px #09111f,
    0 6px 24px rgba(232, 61, 89, 0.5);
  transition: transform 0.15s, box-shadow 0.15s;
}
.fab-on {
  box-shadow:
    0 0 0 6px #09111f,
    0 6px 32px rgba(232, 61, 89, 0.7);
  transform: scale(1.05);
}
.tab-fab-col:active .fab {
  transform: scale(0.94);
}
.fab-icon {
  width: 22px;
  height: 22px;
  color: #ffffff;
}
</style>
