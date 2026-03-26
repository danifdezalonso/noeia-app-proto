<script setup lang="ts">
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap'
    }
  ],
  htmlAttrs: { lang: 'en' }
})
</script>

<template>
  <UApp>
    <div class="h-[100dvh] bg-[#060810] flex items-start justify-center sm:items-center sm:py-10">
      <div
        class="relative w-full sm:w-[390px] h-[100dvh] sm:h-[844px] sm:rounded-[2.75rem] overflow-hidden sm:shadow-[0_40px_80px_rgba(0,0,0,0.6)] sm:ring-1 sm:ring-white/5 bg-[#0a0d1a] flex flex-col"
      >
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
        <AppToast />
      </div>
    </div>
  </UApp>
</template>
