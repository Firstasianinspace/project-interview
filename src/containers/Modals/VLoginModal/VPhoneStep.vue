<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import VFieldControl from '../../../components/common/VFieldControl/index.vue'
import VInputPhone from '../../../components/common/VInputPhone/index.vue'
import { useOTPStore } from '../../../store/otp'
import type { IInputChangeParams } from '../../../components/common/VInputPhone/VInputPhone.types'
import { isValidPhone } from '../../../helpers'

interface IState {
  phone: string;
  hint: string;
}

const otpStore = useOTPStore()

const inputPhoneRef = ref<null | InstanceType<typeof VInputPhone>>(null)

const state = reactive<IState>({
  phone: otpStore.state.phone || '',
  hint: '',
})

const isSubmitDisabled = computed(() => otpStore.status.code === 'pending')
const displayError = computed(() => state.phone.length === 16 && !isValidPhone(state.phone))

const onPhoneChange = (params: IInputChangeParams) => state.phone = params.value

const onSubmit = () => {
  const formatPhoneForApi = (phone: string) => phone.replace(/[^\d]/g, '')
  otpStore.getCode(formatPhoneForApi(state.phone))
}

onMounted(() => {
  inputPhoneRef.value?.focus()
})
</script>

<template>
  <div class='modal-auth-phone'>
    <VFieldControl
      :has-error="displayError"
      error-text="Что-то не так с номером"
    >
      <VInputPhone
        ref="inputPhoneRef"
        :value="otpStore.state.phone"
        :disabled="otpStore.status.code === 'pending'"
        :has-error="displayError"
        @change="onPhoneChange"
        @keyup.enter="onSubmit"
      />
    </VFieldControl>
    <button
      @click="onSubmit"
      :disabled="isSubmitDisabled"
    >
      Далее
    </button>
  </div>
</template>

<style>
</style>
