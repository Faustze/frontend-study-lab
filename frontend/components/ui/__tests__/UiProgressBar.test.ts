import UiProgressBar from '../UiProgressBar.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('uiProgressBar', () => {
  it('renders with default props', () => {
    const wrapper = mount(UiProgressBar, {
      props: { value: 50 },
    })
    expect(wrapper.find('.ui-progress').exists()).toBe(true)
    expect(wrapper.find('.ui-progress__track').exists()).toBe(true)
    expect(wrapper.find('.ui-progress__fill').exists()).toBe(true)
  })

  it('sets fill width based on value', () => {
    const wrapper = mount(UiProgressBar, {
      props: { value: 50 },
    })
    const fill = wrapper.find('.ui-progress__fill')
    expect(fill.attributes('style')).toContain('width: 50%')
  })

  it('calculates percent correctly', () => {
    const wrapper = mount(UiProgressBar, {
      props: { value: 25, max: 100 },
    })
    const fill = wrapper.find('.ui-progress__fill')
    expect(fill.attributes('style')).toContain('width: 25%')
  })

  it('handles custom max value', () => {
    const wrapper = mount(UiProgressBar, {
      props: { value: 5, max: 10 },
    })
    const fill = wrapper.find('.ui-progress__fill')
    expect(fill.attributes('style')).toContain('width: 50%')
  })

  it('caps percent at 100 when value exceeds max', () => {
    const wrapper = mount(UiProgressBar, {
      props: { value: 150, max: 100 },
    })
    const fill = wrapper.find('.ui-progress__fill')
    expect(fill.attributes('style')).toContain('width: 100%')
  })

  it('does not go below 0 percent', () => {
    const wrapper = mount(UiProgressBar, {
      props: { value: -50 },
    })
    const fill = wrapper.find('.ui-progress__fill')
    expect(fill.attributes('style')).toContain('width: 0%')
  })

  it('shows 0% when value is 0', () => {
    const wrapper = mount(UiProgressBar, {
      props: { value: 0 },
    })
    const fill = wrapper.find('.ui-progress__fill')
    expect(fill.attributes('style')).toContain('width: 0%')
  })

  it('shows 100% when value equals max', () => {
    const wrapper = mount(UiProgressBar, {
      props: { value: 100 },
    })
    const fill = wrapper.find('.ui-progress__fill')
    expect(fill.attributes('style')).toContain('width: 100%')
  })

  it('hides label by default', () => {
    const wrapper = mount(UiProgressBar, {
      props: { value: 50 },
    })
    expect(wrapper.find('.ui-progress__label').exists()).toBe(false)
  })

  it('shows label when showLabel is true', () => {
    const wrapper = mount(UiProgressBar, {
      props: { value: 50, showLabel: true },
    })
    expect(wrapper.find('.ui-progress__label').text()).toBe('50%')
  })

  it('applies size class', () => {
    const wrapper = mount(UiProgressBar, {
      props: { value: 50, size: 'lg' },
    })
    expect(wrapper.classes()).toContain('ui-progress--lg')
  })

  it('applies all size classes', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const wrapper = mount(UiProgressBar, { props: { value: 50, size } })
      expect(wrapper.classes()).toContain(`ui-progress--${size}`)
    }
  })

  it('rounds percent to integer', () => {
    const wrapper = mount(UiProgressBar, {
      props: { value: 33, max: 100 },
    })
    const fill = wrapper.find('.ui-progress__fill')
    expect(fill.attributes('style')).toContain('width: 33%')
  })

  it('applies md size by default', () => {
    const wrapper = mount(UiProgressBar, {
      props: { value: 50 },
    })
    expect(wrapper.classes()).toContain('ui-progress--md')
  })
})
