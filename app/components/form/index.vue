<script lang="ts" setup>
export interface FormEmits {
  submit: [event: SubmitEvent]
}

const emits = defineEmits<FormEmits>()
</script>

<template>
  <form @submit.prevent="emits('submit', $event)">
    <slot />
  </form>
</template>
