<template>
  <TopicPage
    module-slug="throttle"
    title="throttle"
    :description="$t('modules.throttle.description')"
    category-label="JavaScript Core"
    difficulty="easy"
    :xp-reward="30"
  >
    <label class="field">
      <span>{{ $t('modules.throttle.inputLabel') }}</span>
      <input
        v-model="input"
        type="text"
        :placeholder="$t('modules.throttle.inputPlaceholder')"
        @input="updateValue(input)"
      >
    </label>

    <div class="stats">
      <div>
        <span class="muted">{{ $t('modules.throttle.currentValue') }}</span>
        <strong>{{ input || '...' }}</strong>
      </div>
      <div>
        <span class="muted">{{ $t('modules.throttle.throttledValue') }}</span>
        <strong>{{ throttled || '...' }}</strong>
      </div>
      <div>
        <span class="muted">{{ $t('modules.throttle.callCount') }}</span>
        <strong>{{ updates }}</strong>
      </div>
    </div>

    <CodeBlock language="javascript">
      throttle(fn, 1000)
    </CodeBlock>
  </TopicPage>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { throttle } from './throttle'
import TopicPage from '@/components/layout/TopicPage.vue'
import CodeBlock from '@/components/ui/CodeBlock.vue'

const input = ref('')
const throttled = ref('')
const updates = ref(0)

const updateValue = throttle((value: string) => {
  throttled.value = value
  updates.value += 1
}, 1000)
</script>
