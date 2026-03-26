// Module-level state — shared across all components (CSR only)
const _msg = ref('')
const _visible = ref(false)
let _timer: ReturnType<typeof setTimeout> | null = null

export function useToast() {
  function showToast(message: string, duration = 2400) {
    if (_timer) clearTimeout(_timer)
    _msg.value = message
    _visible.value = true
    _timer = setTimeout(() => { _visible.value = false }, duration)
  }
  return { toastMsg: _msg, toastVisible: _visible, showToast }
}
