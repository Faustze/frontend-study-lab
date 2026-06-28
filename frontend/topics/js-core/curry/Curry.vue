<template>
  <TopicPage
    module-slug="curry"
    title="curry"
    :description="$t('modules.curry.description')"
    category-label="JavaScript Core"
    difficulty="medium"
    :xp-reward="60"
  >
    <div class="lesson-grid">
      <article class="lesson-card">
        <h3>{{ $t('modules.curry.beforeLabel') }}</h3>
        <p>{{ $t('modules.curry.beforeText') }}</p>
        <CodeBlock language="code">
          buildUrl('/users', { page: 1 }, 'json')
        </CodeBlock>
      </article>
      <article class="lesson-card">
        <h3>{{ $t('modules.curry.afterLabel') }}</h3>
        <p>{{ $t('modules.curry.afterText') }}</p>
        <CodeBlock language="code">
          curriedBuildUrl('/users')({ page: 1 })('json')
        </CodeBlock>
      </article>
    </div>

    <div class="flow">
      <div class="flow-step">
        <span class="step-number">1</span>
        <strong>{{ $t('modules.curry.step1') }}</strong>
        <code>'/users'</code>
      </div>
      <div class="flow-step">
        <span class="step-number">2</span>
        <strong>{{ $t('modules.curry.step2') }}</strong>
        <code>(query) => ...</code>
      </div>
      <div class="flow-step">
        <span class="step-number">3</span>
        <strong>{{ $t('modules.curry.step3') }}</strong>
        <code>{ page: 1 }</code>
      </div>
      <div class="flow-step">
        <span class="step-number">4</span>
        <strong>{{ $t('modules.curry.step4') }}</strong>
        <code>'json'</code>
      </div>
    </div>

    <div class="result-panel">
      <span class="muted">{{ $t('modules.curry.resultLabel') }}</span>
      <strong>{{ url }}</strong>
    </div>
  </TopicPage>
</template>

<script setup lang="ts">
import { curry } from './curry'
import TopicPage from '@/components/layout/TopicPage.vue'
import CodeBlock from '@/components/ui/CodeBlock.vue'

const buildUrl = curry((endpoint: string, query: Record<string, number>, format: string) => {
  const params = new URLSearchParams(query as any).toString()
  return `https://api.example.com${endpoint}?${params}&format=${format}`
})

const url = buildUrl('/users')({ page: 1 })('json')
</script>
