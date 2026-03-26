<script setup lang="ts">
useSeoMeta({ title: 'Loading...' })

const router = useRouter()

onMounted(() => {
  setTimeout(() => router.push('/login'), 2500)
})
</script>

<template>
  <div class="splash">
    <div class="logo-wrap">
      <LogoMark :size="120" />
    </div>
  </div>
</template>

<style scoped>
.splash {
  background: #0a0d1a;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-wrap {
  animation: splashSequence 2.5s cubic-bezier(0.4, 0, 0.6, 1) forwards;
  transform-origin: center;
}

@keyframes splashSequence {
  0%   { opacity: 0;   transform: scale(0.96); }
  12%  { opacity: 1;   transform: scale(1); }
  28%  { opacity: 1;   transform: scale(1.05); }
  44%  { opacity: 1;   transform: scale(1); }
  60%  { opacity: 1;   transform: scale(1.05); }
  76%  { opacity: 1;   transform: scale(1); }
  88%  { opacity: 1;   transform: scale(1); }
  100% { opacity: 0;   transform: scale(1.02); }
}
</style>
