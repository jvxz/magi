<script lang="ts" setup>
const { me } = useUser()
</script>

<template>
  <div class="p-4 rounded-l-lg bg-background shrink-0 w-64">
    <UButton variant="ghost" class="group text-foreground font-normal p-3 gap-3.5 h-[4.25rem] w-full items-center justify-between">
      <MatrixAvatar
        :user="me"
        :size="48"
        class="shrink-0"
      />
      <div class="flex flex-col h-full w-full justify-evenly *:w-fit">
        <span class="font-medium">{{ me?.displayName }}</span>
        <span class="text-muted-foreground group-hover:text-foreground">
          Edit Profile
          <Icon name="tabler:pencil-filled" class="h-0.6lh" />
        </span>
      </div>
    </UButton>
  </div>
</template>
