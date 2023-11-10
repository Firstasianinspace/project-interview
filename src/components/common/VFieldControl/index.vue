<script setup lang="ts">
interface IFormControlProps {
  errorText?: string;
  hasError?: boolean;
}

defineProps<IFormControlProps>();
</script>

<template>
  <div class="field-control">
    <slot />
    <div v-if="hasError" class="field-control__error">
      <span>
        {{ errorText }}
      </span>
    </div>
  </div>
</template>

<style lang="postcss">
.field-control {
  margin-bottom: 20px;

  &__error {
    display: flex;
    padding: 0 16px;
  }
}
</style>
