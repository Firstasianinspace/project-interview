<script setup lang="ts">
import { ref, useAttrs } from "vue";
import VInput from "../VInput/index.vue";

import type {
  IInputPhoneEmits,
  IInputPhoneExpose,
  IInputPhoneProps,
} from "./VInputPhone.types";

const CODE = "+7";
const DEFAULT_MASK = "XX XXX XXX XX XX";
let prevValue = CODE;

const props = defineProps<IInputPhoneProps>();
const emit = defineEmits<IInputPhoneEmits>();

const attrs = useAttrs();

const inputRef = ref<null | InstanceType<typeof VInput>>(null);
const currentValue = ref(props.value || CODE);

const focus = () => {
  inputRef.value?.focus();
};

defineExpose<IInputPhoneExpose>({
  focus,
});

const getInputValue = (value: string) => {
  let result = DEFAULT_MASK;

  /* Автоподстановка */
  if (value[0] !== "+" && value[1] !== "7") {
    value = `${CODE}${value}`;
  }

  const found = value.match(/^\+\d(\d|\s)+/);
  if (found) {
    value = found[0];
  } else {
    value = CODE;
  }

  /* В маске посимвольно "X" заменяются на значение  */
  value.split("").forEach((char) => {
    if (char === " ") {
      return;
    }
    result = result.replace("X", char);
  });

  return result.replace(/X/g, "").trim();
};

const onInput = (e: string) => {
  const target = inputRef.value?.inputRef as HTMLInputElement;
  const startSelection = target.selectionStart;
  const endSelection = target.selectionEnd;
  const value = getInputValue(e);
  currentValue.value = value;
  target.value = value;

  /* Сохранение позиции курсора при удалении/добавлении символов */
  if (prevValue.length > value.length) {
    if (!startSelection && !endSelection) {
      target.selectionStart = value.length;
      target.selectionEnd = value.length;
    } else {
      target.selectionStart = startSelection;
      target.selectionEnd = startSelection;
    }
  } else if (
    endSelection &&
    endSelection > 1 &&
    value[endSelection + 1] &&
    value.length < DEFAULT_MASK.length
  ) {
    target.selectionStart = endSelection;
    target.selectionEnd = endSelection;
  }

  emit("change", { value, valid: value.length === DEFAULT_MASK.length });
  prevValue = value;
};
</script>

<template>
  <VInput
    ref="inputRef"
    v-bind="attrs"
    type="tel"
    placeholder="Введите номер телефона"
    :maxlength="16"
    :model-value="currentValue"
    @update:model-value="onInput"
  />
</template>
