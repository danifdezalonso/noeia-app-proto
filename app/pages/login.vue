<script setup lang="ts">
useSeoMeta({ title: 'Welcome' })

const router = useRouter()

// Which sheet is open: 'signin' | 'signup' | null
const activeModal = ref<'signin' | 'signup' | null>(null)

// Form state
const signInEmail = ref('')
const signInError = ref('')
const signUpEmail = ref('')
const signUpError = ref('')

// Magic link popup
const showMagicLink = ref(false)
const magicLinkEmail = ref('')

function closeAll() {
  activeModal.value = null
  showMagicLink.value = false
}

function handleSignInEmail() {
  const e = signInEmail.value.trim()
  if (!e || !e.includes('@')) {
    signInError.value = 'Enter a valid email address'
    return
  }
  signInError.value = ''
  magicLinkEmail.value = e
  showMagicLink.value = true
}

function handleSignUpEmail() {
  const e = signUpEmail.value.trim()
  if (!e || !e.includes('@')) {
    signUpError.value = 'Enter a valid email address'
    return
  }
  signUpError.value = ''
  magicLinkEmail.value = e
  showMagicLink.value = true
}

function handleSocial() {
  closeAll()
  router.push('/home')
}

function handleMagicLinkDismiss() {
  closeAll()
  router.push('/home')
}

watch(signInEmail, () => { signInError.value = '' })
watch(signUpEmail, () => { signUpError.value = '' })
</script>

<template>
  <div class="login-root">

    <!-- ── Background blobs ── -->
    <div class="blob blob-1" />
    <div class="blob blob-2" />
    <div class="blob blob-3" />
    <div class="glow" />

    <!-- ── Main content ── -->
    <div class="content">
      <div class="logo-area">
        <LogoMark :size="80" />
      </div>

      <div class="headline-area">
        <h1 class="headline">
          <span class="line line-regular">Capture</span>
          <span class="line line-italic">every session,</span>
          <span class="line line-regular">wherever care</span>
          <span class="line line-regular">takes you</span>
        </h1>
      </div>

      <div class="buttons-area">
        <button class="btn-signin" @click="activeModal = 'signin'">
          Sign in
        </button>
        <button class="btn-register" @click="activeModal = 'signup'">
          Create account
        </button>
      </div>
    </div>

    <!-- ── Overlay ── -->
    <Transition name="fade">
      <div
        v-if="activeModal"
        class="sheet-overlay"
        @click="closeAll"
      />
    </Transition>

    <!-- ── Bottom Sheet ── -->
    <Transition name="slide-up">
      <div v-if="activeModal" class="sheet">

        <!-- Drag handle -->
        <div class="drag-handle-row">
          <div class="drag-handle" />
        </div>

        <!-- Close button -->
        <button class="close-btn" aria-label="Close" @click="closeAll">
          <UIcon name="i-lucide-x" class="w-4 h-4" />
        </button>

        <!-- Logo (static) -->
        <div class="sheet-logo">
          <LogoMark :size="44" />
        </div>

        <!-- Switching content -->
        <Transition name="content-fade" mode="out-in">

          <!-- ── Sign In ── -->
          <div v-if="activeModal === 'signin'" key="signin" class="sheet-content">
            <div class="sheet-head">
              <h2 class="sheet-title">Welcome back</h2>
              <p class="sheet-sub">Sign in to continue</p>
            </div>

            <div class="field">
              <input
                v-model="signInEmail"
                type="email"
                placeholder="your@email.com"
                autocomplete="email"
                class="email-input"
                :class="{ 'is-error': signInError }"
                @keydown.enter="handleSignInEmail"
              />
              <Transition name="err-fade">
                <p v-if="signInError" class="error-msg">{{ signInError }}</p>
              </Transition>
            </div>

            <button class="btn-primary" @click="handleSignInEmail">
              Sign in with email
            </button>

            <div class="divider">
              <span class="divider-line" />
              <span class="divider-label">or</span>
              <span class="divider-line" />
            </div>

            <button class="btn-social" @click="handleSocial">
              <UIcon name="i-simple-icons-google" class="w-4 h-4 shrink-0" />
              Continue with Google
            </button>
            <button class="btn-social" @click="handleSocial">
              <UIcon name="i-simple-icons-apple" class="w-[15px] h-[15px] shrink-0" />
              Continue with Apple
            </button>

            <button class="switch-link" @click="activeModal = 'signup'">
              No account? <span class="switch-cta">Create one</span>
            </button>
          </div>

          <!-- ── Sign Up ── -->
          <div v-else-if="activeModal === 'signup'" key="signup" class="sheet-content">
            <div class="sheet-head">
              <h2 class="sheet-title">Create account</h2>
              <p class="sheet-sub">Get started for free</p>
            </div>

            <div class="field">
              <input
                v-model="signUpEmail"
                type="email"
                placeholder="your@email.com"
                autocomplete="email"
                class="email-input"
                :class="{ 'is-error': signUpError }"
                @keydown.enter="handleSignUpEmail"
              />
              <Transition name="err-fade">
                <p v-if="signUpError" class="error-msg">{{ signUpError }}</p>
              </Transition>
            </div>

            <button class="btn-primary" @click="handleSignUpEmail">
              Continue with email
            </button>

            <div class="divider">
              <span class="divider-line" />
              <span class="divider-label">or</span>
              <span class="divider-line" />
            </div>

            <button class="btn-social" @click="handleSocial">
              <UIcon name="i-simple-icons-google" class="w-4 h-4 shrink-0" />
              Continue with Google
            </button>
            <button class="btn-social" @click="handleSocial">
              <UIcon name="i-simple-icons-apple" class="w-[15px] h-[15px] shrink-0" />
              Continue with Apple
            </button>

            <button class="switch-link" @click="activeModal = 'signin'">
              Already have an account? <span class="switch-cta">Sign in</span>
            </button>
          </div>

        </Transition>
      </div>
    </Transition>

    <!-- ── Magic Link Popup ── -->
    <Transition name="fade">
      <div v-if="showMagicLink" class="popup-backdrop">
        <div class="popup-card">
          <div class="popup-icon-wrap">
            <UIcon name="i-lucide-mail-check" class="w-7 h-7" style="color: #E83D59;" />
          </div>
          <h3 class="popup-title">Check your inbox</h3>
          <p class="popup-body">
            We sent a magic link to
            <span class="popup-email">{{ magicLinkEmail }}</span>
          </p>
          <button class="popup-btn" @click="handleMagicLinkDismiss">
            Got it
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
/* ── Root ─────────────────────────────────────── */
.login-root {
  position: relative;
  flex: 1;
  background: #0a0d1a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Main content ─────────────────────────────── */
.content {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 56px 28px 40px;
  padding-bottom: max(40px, env(safe-area-inset-bottom, 40px));
}

.logo-area { flex-shrink: 0; }

.headline-area {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 32px 0 40px;
}

.headline {
  display: flex;
  flex-direction: column;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.4rem, 10vw, 2.75rem);
  line-height: 1.12;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.line { display: block; }
.line-regular { font-weight: 400; }
.line-italic { font-style: italic; font-weight: 400; margin-bottom: 0.06em; }

.buttons-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
}

.btn-signin,
.btn-register {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 17px 24px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  letter-spacing: -0.01em;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.1s ease;
  -webkit-tap-highlight-color: transparent;
}
.btn-signin:active,
.btn-register:active { opacity: 0.85; transform: scale(0.98); }

.btn-signin  { background: #E83D59; color: #ffffff; }
.btn-register { background: #1e2035; color: #ffffff; }

/* ── Background blobs ─────────────────────────── */
.blob {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
}
.blob-1 {
  width: 420px; height: 420px;
  top: -160px; right: -140px;
  background: radial-gradient(circle, #111830 0%, transparent 70%);
  border-radius: 62% 38% 70% 30% / 45% 55% 45% 55%;
}
.blob-2 {
  width: 300px; height: 300px;
  bottom: 80px; left: -100px;
  background: radial-gradient(circle, #0d1224 0%, transparent 70%);
  border-radius: 40% 60% 35% 65% / 60% 40% 60% 40%;
}
.blob-3 {
  width: 180px; height: 180px;
  top: 45%; right: -60px;
  background: radial-gradient(circle, #0f1530 0%, transparent 70%);
  border-radius: 50% 50% 40% 60% / 40% 60% 40% 60%;
}
.glow {
  position: absolute;
  top: -80px; right: -80px;
  width: 320px; height: 320px;
  background: radial-gradient(circle, rgba(232, 61, 89, 0.06) 0%, transparent 65%);
  pointer-events: none;
  z-index: 1;
}

/* ── Overlay ──────────────────────────────────── */
.sheet-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

/* ── Bottom Sheet ─────────────────────────────── */
.sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  background: #0f1329;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 26px 26px 0 0;
  max-height: 92%;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.drag-handle-row {
  display: flex;
  justify-content: center;
  padding: 12px 0 6px;
}
.drag-handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.15);
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 14px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.close-btn:hover  { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.7); }
.close-btn:active { background: rgba(255,255,255,0.05); }

.sheet-logo {
  display: flex;
  justify-content: center;
  padding: 8px 24px 4px;
}

/* ── Sheet content ────────────────────────────── */
.sheet-content {
  padding: 0 24px;
  padding-bottom: max(28px, env(safe-area-inset-bottom, 28px));
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.sheet-head { margin-bottom: 2px; text-align: center; }

.sheet-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 5px;
}
.sheet-sub {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
  line-height: 1;
}

/* ── Input ────────────────────────────────────── */
.field { display: flex; flex-direction: column; gap: 6px; }

.email-input {
  width: 100%;
  box-sizing: border-box;
  background: #181d38;
  border: 1.5px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 14px 16px;
  color: #ffffff;
  font-size: 15px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  caret-color: #E83D59;
}
.email-input::placeholder { color: rgba(255, 255, 255, 0.22); }
.email-input:focus  { border-color: rgba(232, 61, 89, 0.45); }
.email-input.is-error { border-color: rgba(232, 61, 89, 0.6); }

.error-msg {
  font-size: 12px;
  color: #E83D59;
  padding-left: 4px;
}

/* ── Buttons ──────────────────────────────────── */
.btn-primary {
  width: 100%;
  background: #E83D59;
  color: #ffffff;
  border: none;
  border-radius: 14px;
  padding: 16px 24px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
}
.btn-primary:active { opacity: 0.85; transform: scale(0.98); }

.divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 2px 0;
}
.divider-line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.07);
}
.divider-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.22);
  font-weight: 500;
}

.btn-social {
  width: 100%;
  background: #1a1f3c;
  color: rgba(255, 255, 255, 0.88);
  border: none;
  border-radius: 14px;
  padding: 14px 20px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  letter-spacing: -0.01em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background 0.15s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
}
.btn-social:active { background: #222845; transform: scale(0.98); }

.switch-link {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
  cursor: pointer;
  border: none;
  background: none;
  padding: 6px 0 2px;
  width: 100%;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
}
.switch-cta {
  color: #E83D59;
  font-weight: 600;
}

/* ── Magic link popup ─────────────────────────── */
.popup-backdrop {
  position: absolute;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.popup-card {
  background: #131729;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: 28px 24px;
  width: 100%;
  max-width: 310px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  animation: popIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.popup-icon-wrap {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  background: rgba(232, 61, 89, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.popup-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.2;
}

.popup-body {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.55;
}

.popup-email {
  display: block;
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  word-break: break-all;
}

.popup-btn {
  width: 100%;
  background: #E83D59;
  color: #ffffff;
  border: none;
  border-radius: 13px;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  margin-top: 10px;
  transition: opacity 0.15s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
}
.popup-btn:active { opacity: 0.85; transform: scale(0.98); }

/* ── Animations ───────────────────────────────── */
@keyframes popIn {
  from { opacity: 0; transform: scale(0.88) translateY(10px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
}

/* Overlay / popup backdrop fade */
.fade-enter-active { transition: opacity 0.28s ease; }
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

/* Sheet slide up */
.slide-up-enter-active { transition: transform 0.42s cubic-bezier(0.32, 0.72, 0, 1); }
.slide-up-leave-active { transition: transform 0.28s cubic-bezier(0.4, 0, 1, 1); }
.slide-up-enter-from,
.slide-up-leave-to { transform: translateY(100%); }

/* Sign-in ↔ Sign-up content swap */
.content-fade-enter-active { transition: opacity 0.18s ease-out, transform 0.18s ease-out; }
.content-fade-leave-active { transition: opacity 0.12s ease-in,  transform 0.12s ease-in; }
.content-fade-enter-from { opacity: 0; transform: translateX(12px); }
.content-fade-leave-to   { opacity: 0; transform: translateX(-12px); }

/* Error message */
.err-fade-enter-active { transition: all 0.15s ease-out; }
.err-fade-leave-active { transition: all 0.1s ease-in; }
.err-fade-enter-from,
.err-fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
