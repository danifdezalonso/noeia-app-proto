<template>
  <div class="main-layout">
    <main class="main-content">
      <slot />
    </main>
    <AppBottomNav />
  </div>
</template>

<style scoped>
.main-layout {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding-bottom: calc(68px + env(safe-area-inset-bottom, 0px));
}
</style>
