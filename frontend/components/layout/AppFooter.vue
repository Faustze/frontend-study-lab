<template>
  <footer class="app-footer">
    <span class="footer-text">© {{ year }} Frontend Study Lab</span>
    <span class="footer-separator">·</span>
    <a
      href="https://github.com/faustze/frontend-study-lab"
      target="_blank"
      rel="noopener noreferrer"
      class="footer-link"
    >
      GitHub
    </a>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
