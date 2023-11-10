<script setup lang="ts">
import { defineAsyncComponent, ref, computed, watch } from 'vue'
import { useOTPStore } from '../../../store/otp'

const otpStore = useOTPStore()
const step = ref<"phone" | "otp" | 'error'>("phone");

const title = computed(() => {
  let stepTitle
  if (step.value === 'phone') stepTitle = 'Номер телефона'
  if (step.value === 'otp') stepTitle = 'Код из СМС'
  if (step.value === 'error') stepTitle = 'Ошибка'
  return stepTitle;
});

const formComponent = computed(() => {
  if (step.value === "phone" ) return defineAsyncComponent(() => import('./VPhoneStep.vue'))
  if (step.value === 'otp') return defineAsyncComponent(() => import('./VOTPStep.vue'))
  return defineAsyncComponent(() => import('./VErrorStep.vue'))
})

watch(
  () => [otpStore.status.code],
  ([statusCode]) => {
    if (statusCode === "success") {
      step.value = "otp"
    }
    if (statusCode === 'error') {
      step.value = 'error'
    }
  }
);
</script>
<template>
  <div class="modal">
    <h3 class="modal-title">{{ title }}</h3>
    <div class="modal-content">
      <component
        :is="formComponent"
      />
    </div>
  </div>
</template>
<style>
.modal {
  padding: 15px 25px;
  border-radius: 10px;
  background: #fff;
  width: 520px;
}
</style>