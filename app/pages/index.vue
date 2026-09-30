<template>
  <div class="flex flex-col gap-2 h-screen items-center justify-center">
    <p>{{ GENERAL__APP_META.name }}</p>
    <UButton as-child>
      <NuxtLink to="/login"> Login </NuxtLink>
    </UButton>
  </div>
</template>
