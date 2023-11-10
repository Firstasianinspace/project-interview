<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from "vue"
import { vOnClickOutside } from "@vueuse/components"
import type { IInputProps, IInputEmits, IInputExpose } from "./VInput.types"

const props = withDefaults(defineProps<IInputProps>(), {
  size: "l",
  wrapperClass: undefined,
  decoratorClass: undefined,
  label: undefined,
  hint: undefined,
  error: undefined,
  prefix: undefined,
  suffix: undefined,
  clearable: true,
})
const emit = defineEmits<IInputEmits>()
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const slots = useSlots()

const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)

const rootClass = computed(() => [
  props.wrapperClass,
  {
    [`pl-input_size-${props.size}`]: props.size,
    "pl-input_error": props.hasError,
    "pl-input_has-left-icon": !!slots["iconLeft"],
    "pl-input_has-right-icon": !!slots["iconRight"],
    "pl-input_has-focus": isFocused.value,
    "pl-input_has-value": props.modelValue,
    "pl-input_has-label": props.label,
    "pl-input_has-clear": props.clearable,
    "pl-input_has-disabled": props.disabled,
  },
])

const focus = () => {
  if (props.disabled) {
    return;
  }

  // @NOTE: hack for iOS cause w/o setTimeout focus
  // instantly triggers field but phone can't position keyboard correctly
  setTimeout(() => {
    inputRef.value?.focus()
    isFocused.value = true
    emit("focus")
  }, 150)
};

const clear = () => {
  emit("update:modelValue", "")
  emit("clear")
  inputRef.value?.focus()
};

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit("update:modelValue", target.value)
};

const onClickControl = () => {
  if (isFocused.value || props.disabled) {
    return
  }

  inputRef.value?.focus()

  isFocused.value = true
  emit("focus")
};

const onClickOutsideControl = () => {
  if (!isFocused.value || props.disabled) {
    return
  }

  inputRef.value?.blur()

  isFocused.value = false
  emit("blur")
};

defineExpose<IInputExpose>({
  blur: onClickOutsideControl,
  focus,
  inputRef,
})
</script>

<template>
  <div class="pl-input-wrapper" :class="rootClass">
    <div
      v-on-click-outside="onClickOutsideControl"
      class="pl-input"
      @click="onClickControl"
    >
      <input
        v-bind="attrs"
        ref="inputRef"
        :value="modelValue"
        :disabled="disabled"
        class="pl-input-field"
        @input="onInput"
        @focus="onClickControl"
      />

      <span v-if="props.label" class="pl-input-label">{{ props.label }}</span>

      <span v-if="props.prefix" class="pl-input-prefix">
        {{ props.prefix }}
      </span>

      <span v-if="props.suffix" class="pl-input-suffix">
        {{ props.suffix }}
      </span>

      <span v-if="!!slots['iconLeft']" class="pl-input-icon-left">
        <slot name="iconLeft" />
      </span>

      <span v-if="clearable && modelValue && !disabled" class="pl-input-clear">
        <div v-if="!props.hasError" @click="clear" class="clear-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.29289 16.2922C5.90235 16.6827 5.90233 17.3158 6.29284 17.7064C6.68335 18.0969 7.31651 18.0969 7.70705 17.7064L11.9998 13.414L16.2914 17.7056C16.6819 18.0961 17.3151 18.0961 17.7056 17.7056C18.0961 17.3151 18.0961 16.6819 17.7056 16.2914L13.414 11.9998L17.7071 7.70713C18.0976 7.31662 18.0976 6.68346 17.7071 6.29292C17.3166 5.90238 16.6834 5.90236 16.2929 6.29287L11.9998 10.5856L7.70709 6.2929C7.31656 5.90237 6.6834 5.90237 6.29287 6.2929C5.90235 6.68342 5.90235 7.31658 6.29287 7.70711L10.5856 11.9998L6.29289 16.2922Z" fill="currentColor"/>
          </svg>
        </div>
        <div v-else @click="clear" class="clear-icon__red">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1Z" fill="var(--pl-color-icon-fill-system-errorWeak)"/>
            <path d="M9.70958 8.29289C9.31905 7.90237 8.68589 7.90237 8.29536 8.29289C7.90484 8.68342 7.90484 9.31658 8.29536 9.70711L10.5873 11.999L8.29533 14.2909C7.90481 14.6815 7.90481 15.3146 8.29533 15.7052C8.68586 16.0957 9.31902 16.0957 9.70955 15.7052L12.0015 13.4132L14.2929 15.7047C14.6834 16.0952 15.3166 16.0952 15.7071 15.7047C16.0977 15.3141 16.0977 14.681 15.7071 14.2904L13.4157 11.999L15.7071 9.7076C16.0976 9.31708 16.0976 8.68391 15.7071 8.29339C15.3166 7.90286 14.6834 7.90286 14.2929 8.29339L12.0015 10.5848L9.70958 8.29289Z" fill="var(--pl-color-icon-fill-system-error)"/>
          </svg>
        </div>
      </span>

      <span v-if="!!slots['iconRight']" class="pl-input-icon-right">
        <slot name="iconRight" />
      </span>
    </div>

    <span v-if="props.hint" class="pl-input-hint">
      {{ props.hint }}
    </span>

    <span v-if="props.error" class="pl-input-hint-error">
      {{ props.error }}
    </span>
  </div>
</template>

<style lang="postcss">
.pl-input {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: var(--pl-radius-field-m);
  background-color: var(--pl-color-field-background-default);
  border: var(--pl-borderWidth-field) solid var(--pl-color-field-border-default);

  .pl-input_size-m & {
    padding: 0 8px;
  }

  .pl-input_size-l & {
    padding: 0 12px;
  }

  .pl-input_error & {
    background-color: var(--pl-color-error-background-weak-default);
    border-color: var(--pl-color-error-border-default);
  }

  .pl-input_has-focus & {
    background-color: var(--pl-color-field-background-pressed);
    border-color: var(--pl-color-field-border-pressed);
  }

  .pl-input_has-disabled & {
    background-color: var(--pl-color-field-background-disabled);
    border-color: var(--pl-color-field-border-disabled);
  }

  .pl-input_error.pl-input_has-focus & {
    background-color: var(--pl-color-error-background-weak-pressed);
    border-color: var(--pl-color-error-border-pressed);
  }

  .pl-input_error.pl-input_has-disabled & {
    background-color: var(--pl-color-error-background-weak-default);
    border-color: var(--pl-color-error-border-default);
  }
}

.pl-input-field {
  position: relative;
  font: var(--pl-font-body-large-regular);
  color: var(--pl-color-text-primary);
  background: none;
  border: none;
  outline: none;
  z-index: var(--pl-z-index-level2);
  transition: 0.3s;
  margin: 0 4px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &::placeholder {
    color: var(--pl-color-text-secondary);
  }

  .pl-input_has-focus &::placeholder {
    color: var(--pl-color-text-tertiary);
  }

  &:placeholder-shown {
    text-overflow: ellipsis;
  }

  &:disabled {
    cursor: not-allowed;
    color: var(--pl-color-text-tertiary);
    -webkit-text-fill-color: var(--pl-color-text-tertiary);
  }

  .pl-input_size-m & {
    padding: 10px 0;
  }

  .pl-input_size-l & {
    padding: 16px 0;
  }

  .pl-input_has-label.pl-input_size-l & {
    opacity: 0;
  }

  .pl-input_has-value.pl-input_has-label.pl-input_size-l &,
  .pl-input_has-label.pl-input_size-l.pl-input_has-focus & {
    padding-top: 26px;
    padding-bottom: 6px;
    opacity: 1;
  }
}

.pl-input-label {
  position: absolute;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  top: 10px;
  left: 0;
  right: 0;
  padding: 6px 44px 0 16px;
  font: var(--pl-font-body-large-regular);
  color: var(--pl-color-text-secondary);
  transition: 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-duration: 0.3s;
  z-index: var(--pl-z-index-level1);

  .pl-input_size-m & {
    display: none;
  }

  .pl-input_has-left-icon & {
    padding-left: 44px;
  }

  .pl-input_has-disabled & {
    color: var(--pl-color-text-tertiary);
  }

  .pl-input_has-value &,
  .pl-input_has-focus & {
    top: 0;
    font: var(--pl-font-caption-large-regular-low);
  }

  .pl-input_error.pl-input_has-value &,
  .pl-input_error.pl-input_has-focus & {
    color: var(--pl-color-text-secondary);
  }
}

.pl-input-prefix {
  order: -1;
  font: var(--pl-font-body-large-regular);
  color: var(--pl-color-text-secondary);
  z-index: var(--pl-z-index-level1);
  margin-left: 4px;

  .pl-input_has-label & {
    display: none;
  }
}

.pl-input-suffix {
  font: var(--pl-font-body-large-regular);
  color: var(--pl-color-text-secondary);
  z-index: var(--pl-z-index-level1);
  margin-right: 4px;

  .pl-input_has-label & {
    display: none;
  }
}

.pl-input-icon-left {
  order: -2;
  z-index: var(--pl-z-index-level1);
  display: flex;
  align-items: center;
  margin-right: 4px;
  color: var(--pl-color-icon-fill-secondary);
}

.pl-input-clear {
  display: none;
  cursor: pointer;
  margin-right: 4px;
  z-index: var(--pl-z-index-level2);

  .pl-input_has-clear.pl-input_has-value & {
    display: flex;
  }
}

.pl-input-icon-right {
  z-index: var(--pl-z-index-level1);
  display: flex;
  align-items: center;
  margin-right: 4px;
  width: 24px;
  flex-shrink: 0;
  color: var(--pl-color-icon-fill-secondary);

  .pl-input-clear + & {
    margin-left: 4px;
  }
}

.pl-input-hint,
.pl-input-hint-error {
  padding: 0 16px;
  font: var(--pl-font-caption-large-regular);
}

.pl-input-hint {
  display: block;
  margin-top: var(--pl-unit-x1);
  color: var(--pl-color-text-secondary);

  .pl-input_error & {
    display: none;
  }
}

.pl-input-hint-error {
  display: none;
  margin-top: var(--pl-unit-x1);
  color: var(--pl-color-text-system-error);

  .pl-input_error & {
    display: block;
  }
}
</style>
