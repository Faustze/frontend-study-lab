<template>
  <section class="demo">
    <div class="demo-card">
      <div class="demo-header">
        <p class="demo-label">
          {{ categoryLabel }}
        </p>
        <UiBadge :difficulty="difficulty" :xp="xpReward" />
      </div>
      <h2>{{ title }}</h2>
      <p v-if="description" class="demo-copy">
        {{ description }}
      </p>

      <slot />

      <CompleteButton :module-slug="moduleSlug" :xp-reward="xpReward" />
    </div>
  </section>
</template>

<script setup lang="ts">
import UiBadge from '@/components/ui/UiBadge.vue'
import CompleteButton from '@/components/topic/CompleteButton.vue'

interface Props {
  moduleSlug: string
  title: string
  description?: string
  categoryLabel: string
  difficulty: 'easy' | 'medium' | 'hard'
  xpReward: number
}

defineProps<Props>()
</script>

<style lang="scss">
@use '@/assets/scss/pages/topic' as *;
</style>
