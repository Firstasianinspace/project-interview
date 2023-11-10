import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { useFetch } from '@vueuse/core'

interface IOTPState {
  phone: string;
  code: string;
  hint: string;
}


interface IOTPStatus {
  code: 'initial' | 'pending' | 'success' | 'error';
  auth: 'initial' | 'pending' | 'success' | 'error';
}

export const useOTPStore = defineStore('otp', () => {
  const state = reactive<IOTPState>({
    phone: '',
    code: '',
    hint: '',
  });

  const status = reactive<IOTPStatus>({
    code: 'initial',
    auth: 'initial',
  });

  const getCode = async (phone?: string) => {
    status.code = 'pending';
    const { data, error } = await useFetch('/api/generate-otp', {
      onFetchError(ctx) {
        if (ctx.error?.message === 'Too Many Requests')
          state.hint = ctx.data?.message
        return ctx
      },
    }).post({
      phone_number: phone
    }).json()
    if (data.value) {
      status.code = 'success';
    }
    if (error.value) {
      status.code = 'error';
    }
  }

  const checkCode = async (value: string) => {
    if (state.code === '') {
      status.auth = 'initial';
    }
    state.code = value;
    if (value.length === 5) {
      status.auth = 'pending';
      const { data, error } = await useFetch('/api/verify-otp').post({
        phone_number: state.phone.replace(/\D/g, ''),
        otp_code: state.code,
      }).json()
      if (data.value) {
        status.auth = 'success';
      }
      if (error.value) {
        status.code = 'error';
      }
    }
  }

  return {
    state,
    status,
    getCode,
    checkCode,
  };
});
