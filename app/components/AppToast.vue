<script setup lang="ts">
const { toastMsg, toastVisible } = useToast()
</script>

<template>
  <Transition name="toast">
    <div v-if="toastVisible" class="toast-pill">
      {{ toastMsg }}
    </div>
  </Transition>
</template>

<style scoped>
.toast-pill {
  position: absolute;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 300;
  background: rgba(30, 33, 55, 0.96);
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: rgba(255,255,255,0.88);
  font-size: 13px;
  font-weight: 500;
  padding: 10px 18px;
  border-radius: 24px;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}

.toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.2s ease-in; }
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
</style>
