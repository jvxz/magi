<script lang="ts" setup>
const dialogOpen = ref(false)
const timestamp = useTimestamp()

const { data: randomNumber } = await useFetch('/api/number')
</script>

<template>
  <Transition name="zoom" appear>
    <div class="flex h-screen flex-col items-center justify-center gap-2">
      <ClientOnly>
        <p class="tabular-nums">
          {{ timestamp }}
        </p>
      </ClientOnly>
      <p>{{ randomNumber }}</p>
      <UDropdownMenuRoot>
        <UDropdownMenuTrigger as-child>
          <UButton>
            Click!
          </UButton>
        </UDropdownMenuTrigger>
        <UDropdownMenuContent>
          <UDropdownMenuItem @select="dialogOpen = true">
            Dialog
          </UDropdownMenuItem>
        </UDropdownMenuContent>
      </UDropdownMenuRoot>
      <ClientOnly>
        <UButton
          size="icon"
          variant="soft"
          @click="toggleColorMode"
        >
          <Icon :name="$colorMode.value === 'dark' ? 'mingcute:sun-line' : 'mingcute:moon-line'" />
        </UButton>
      </ClientOnly>
      <UDialogRoot v-model:open="dialogOpen">
        <UDialogContent>
          <UDialogHeader>
            <UDialogTitle>
              Example
            </UDialogTitle>
          </UDialogHeader>
          <p class="font-sans">
            This is sans
          </p>
          <p class="font-mono">
            This is mono
          </p>
          <UDialogFooter>
            <UDialogClose as-child>
              <UButton>Close </UButton>
            </UDialogClose>
          </UDialogFooter>
        </UDialogContent>
      </UDialogRoot>
    </div>
  </Transition>
</template>
