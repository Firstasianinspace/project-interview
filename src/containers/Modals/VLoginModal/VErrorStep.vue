<script setup lang="ts">
import { reactive } from 'vue'
import { useOTPStore } from '../../../store/otp'

interface IState {
  message: string;
}

const otpStore = useOTPStore()

const state = reactive<IState>({
  message: otpStore.state.hint,
})
</script>
<template>
  <div class="modal-auth-phone">
    {{ state.message }}
  </div>
</template>
<style>
</style>