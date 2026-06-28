import UiButton from '../UiButton.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('uiButton', () => {
  it('renders default slot content', () => {
    const wrapper = mount(UiButton, {
      slots: { default: 'Click me' },
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('applies primary variant class by default', () => {
    const wrapper = mount(UiButton)
    expect(wrapper.classes()).toContain('ui-btn--primary')
  })

  it('applies variant class', () => {
    const wrapper = mount(UiButton, {
      props: { variant: 'secondary' },
    })
    expect(wrapper.classes()).toContain('ui-btn--secondary')
  })

  it('applies all variant classes', () => {
    for (const variant of ['primary', 'secondary', 'ghost'] as const) {
      const wrapper = mount(UiButton, { props: { variant } })
      expect(wrapper.classes()).toContain(`ui-btn--${variant}`)
    }
  })

  it('applies size class', () => {
    const wrapper = mount(UiButton, {
      props: { size: 'lg' },
    })
    expect(wrapper.classes()).toContain('ui-btn--lg')
  })

  it('applies all size classes', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const wrapper = mount(UiButton, { props: { size } })
      expect(wrapper.classes()).toContain(`ui-btn--${size}`)
    }
  })

  it('is not disabled by default', () => {
    const wrapper = mount(UiButton)
    expect(wrapper.attributes('disabled')).toBeUndefined()
  })

  it('can be disabled', () => {
    const wrapper = mount(UiButton, {
      props: { disabled: true },
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('has button type by default', () => {
    const wrapper = mount(UiButton)
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('can have submit type', () => {
    const wrapper = mount(UiButton, {
      props: { type: 'submit' },
    })
    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('emits click event', async () => {
    const wrapper = mount(UiButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(UiButton, {
      props: { disabled: true },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('renders as a button element', () => {
    const wrapper = mount(UiButton)
    expect(wrapper.element.tagName).toBe('BUTTON')
  })

  it('combines variant and size classes', () => {
    const wrapper = mount(UiButton, {
      props: { variant: 'ghost', size: 'sm' },
    })
    expect(wrapper.classes()).toContain('ui-btn--ghost')
    expect(wrapper.classes()).toContain('ui-btn--sm')
  })
})
