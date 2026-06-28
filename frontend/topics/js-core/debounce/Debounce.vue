<template>
  <TopicPage
    module-slug="debounce"
    title="debounce"
    :description="$t('modules.debounce.description')"
    category-label="JavaScript Core"
    difficulty="easy"
    :xp-reward="30"
  >
    <label class="field">
      <span>{{ $t('modules.debounce.inputLabel') }}</span>
      <input
        v-model="input"
        type="text"
        :placeholder="$t('modules.debounce.inputPlaceholder')"
        @input="updateValue(input)"
      >
    </label>

    <div class="stats">
      <div>
        <span class="muted">{{ $t('modules.debounce.currentValue') }}</span>
        <strong>{{ input || '...' }}</strong>
      </div>
      <div>
        <span class="muted">{{ $t('modules.debounce.debouncedValue') }}</span>
        <strong>{{ debouncedValue || '...' }}</strong>
      </div>
      <div>
        <span class="muted">{{ $t('modules.debounce.callCount') }}</span>
        <strong>{{ updates }}</strong>
      </div>
    </div>

    <CodeBlock language="javascript">
      debounce(fn, 500)
    </CodeBlock>
  </TopicPage>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { debounce } from './debounce'
import TopicPage from '@/components/layout/TopicPage.vue'
import CodeBlock from '@/components/ui/CodeBlock.vue'

const input = ref('')
const debouncedValue = ref('')
const updates = ref(0)

const updateValue = debounce((value: string) => {
  debouncedValue.value = value
  updates.value += 1
}, 500)
</script>
