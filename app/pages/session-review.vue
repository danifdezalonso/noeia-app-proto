<script setup lang="ts">
definePageMeta({ layout: 'main' })
useSeoMeta({ title: 'Session Review' })

const router = useRouter()
</script>

<template>
  <div class="review-root">
    <div class="glow" />

    <!-- Header -->
    <header class="review-header">
      <button class="back-btn" @click="router.push('/home')">
        <UIcon name="i-lucide-chevron-left" class="w-5 h-5" />
      </button>
      <span class="header-title">Review</span>
      <div class="w-10" />
    </header>

    <!-- Center content -->
    <div class="center">
      <div class="check-ring">
        <UIcon name="i-lucide-check" class="w-9 h-9" style="color: #E83D59;" />
      </div>
      <p class="recorded-text">Session recorded</p>
      <p class="recorded-sub">Ready to process your recording</p>
    </div>

    <!-- Action buttons -->
    <div class="action-area">
      <button class="btn-process">
        <UIcon name="i-lucide-sparkles" class="w-4 h-4" />
        Process &amp; Transcribe
      </button>
      <button class="btn-back" @click="router.push('/home')">
        Discard &amp; go back
      </button>
    </div>
  </div>
</template>

<style scoped>
.review-root {
  position: relative;
  background: #0a0d1a;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 38%, rgba(232,61,89,0.08) 0%, transparent 60%);
  pointer-events: none;
}

/* Header */
.review-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
}
.back-btn {
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
.back-btn:active { background: rgba(255,255,255,0.12); }
.header-title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255,255,255,0.5);
}

/* Center */
.center {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
}
.check-ring {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: rgba(232,61,89,0.1);
  border: 1.5px solid rgba(232,61,89,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}
.recorded-text {
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
}
.recorded-sub {
  font-size: 14px;
  color: rgba(255,255,255,0.3);
}

/* Actions */
.action-area {
  position: relative;
  z-index: 1;
  padding: 0 20px 32px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.btn-process {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 17px 24px;
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
.btn-process:active { opacity: 0.85; transform: scale(0.98); }

.btn-back {
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
.btn-back:active { background: rgba(255,255,255,0.1); }
</style>
