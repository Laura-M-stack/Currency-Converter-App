<script lang="ts">
  let dark = false;

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('darkMode');
    dark = stored === 'true';
    document.documentElement.classList.toggle('dark', dark);
  }

  function toggleDarkMode() {
    dark = !dark;
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('darkMode', String(dark));
  }
</script>

<button
  class="dark-toggle"
  on:click={toggleDarkMode}
  role="switch"
  aria-checked={dark}
  aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
  title={dark ? 'Light mode' : 'Dark mode'}
>
  {#if dark}
<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="4" />
  <line x1="12" y1="2" x2="12" y2="5" />
  <line x1="12" y1="19" x2="12" y2="22" />
  <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
  <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
  <line x1="2" y1="12" x2="5" y2="12" />
  <line x1="19" y1="12" x2="22" y2="12" />
  <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
  <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
</svg>

  {:else}
<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 12.79A9 9 0 1 1 11.21 3
           7 7 0 0 0 21 12.79z" />
</svg>

  {/if}
</button>

<style lang="scss" src="./DarkModeToggle.scss"></style>
