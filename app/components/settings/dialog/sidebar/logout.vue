<script lang="ts" setup>
const open = ref(false)
const { logout } = useAuth()

function handleOpen(value: boolean) {
  if (logout.isLoading.value) return

  open.value = value
}
</script>

<template>
  <UAlertDialogRoot :open @update:open="handleOpen">
    <UAlertDialogTrigger as-child>
      <UButton variant="ghost" class="justify-start"> <Icon name="tabler:power" /> <span>Log out</span> </UButton>
    </UAlertDialogTrigger>
    <UAlertDialogContent>
      <UAlertDialogHeader>
        <UAlertDialogTitle>Log out</UAlertDialogTitle>
        <UAlertDialogDescription> Are you sure you want to log out?</UAlertDialogDescription>
      </UAlertDialogHeader>
      <UAlertDialogFooter>
        <UAlertDialogCancel>Cancel</UAlertDialogCancel>
        <UButton variant="danger" :is-loading="logout.isLoading.value" @click.prevent="logout.executeImmediate()">
          <span>Log out</span>
        </UButton>
      </UAlertDialogFooter>
    </UAlertDialogContent>
  </UAlertDialogRoot>
</template>
