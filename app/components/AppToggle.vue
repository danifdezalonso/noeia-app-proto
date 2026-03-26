<script setup lang="ts">
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <button
    role="switch"
    :aria-checked="model"
    class="toggle"
    :class="{ on: model }"
    @click="model = !model"
  >
    <span class="thumb" />
  </button>
</template>

<style scoped>
.toggle {
  width: 50px;
  height: 30px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.12);
  border: none;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition: background 0.22s ease;
  -webkit-tap-highlight-color: transparent;
}
.toggle.on { background: #E83D59; }

.thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toggle.on .thumb { transform: translateX(20px); }
</style>
