<template>
  <TopicPage
    module-slug="deepEqual"
    title="deepEqual"
    :description="$t('modules.deepEqual.description')"
    category-label="JavaScript Core"
    difficulty="medium"
    :xp-reward="60"
  >
    <div class="lesson-grid">
      <article class="lesson-card">
        <h3>{{ $t('modules.deepEqual.leftLabel') }}</h3>
        <CodeBlock language="code">
          {{ leftValue }}
        </CodeBlock>
      </article>
      <article class="lesson-card">
        <h3>{{ $t('modules.deepEqual.rightLabel') }}</h3>
        <CodeBlock language="code">
          {{ rightValue }}
        </CodeBlock>
      </article>
    </div>

    <div class="result-panel">
      <span class="muted">{{ $t('modules.deepEqual.resultLabel') }}</span>
      <strong>{{ result }}</strong>
    </div>

    <CodeBlock language="javascript">
      {{ codeExample }}
    </CodeBlock>
  </TopicPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { deepEqual } from './deepEqual'
import TopicPage from '@/components/layout/TopicPage.vue'
import CodeBlock from '@/components/ui/CodeBlock.vue'

const left = { user: 'Ann', skills: ['js', 'ts'] }
const right = { user: 'Ann', skills: ['js', 'ts'] }

const leftValue = JSON.stringify(left, null, 2)
const rightValue = JSON.stringify(right, null, 2)
const result = computed(() => deepEqual(left, right))

const codeExample = [
  'const left = { user: "Ann", skills: ["js", "ts"] }',
  'const right = { user: "Ann", skills: ["js", "ts"] }',
  '',
  'deepEqual(left, right) // → true',
  'left === right         // → false',
].join('\n')
</script>
