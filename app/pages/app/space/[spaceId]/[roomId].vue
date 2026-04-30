<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  name: 'space-room',
})

// this page is here solely to allow for navigation to it. the actual logic for the page is
// inside the `/pages/app/space/[spaceId].vue` page. the reason for this is to persist the
// event list component instance across route changes
</script>
