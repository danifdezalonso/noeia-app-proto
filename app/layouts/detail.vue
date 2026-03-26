<template>
  <div class="detail-layout">
    <slot />
  </div>
</template>

<style scoped>
.detail-layout {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
