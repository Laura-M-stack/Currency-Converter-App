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
    <!-- Light icon -->
    <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3a1 1 0 011 1v1.06a7.978 7.978 0 014.242 1.757l.752-.752a1 1 0 011.414 1.414l-.752.752A7.978 7.978 0 0120.94 11H22a1 1 0 110 2h-1.06a7.978 7.978 0 01-1.757 4.242l.752.752a1 1 0 01-1.414 1.414l-.752-.752A7.978 7.978 0 0113 19.94V21a1 1 0 11-2 0v-1.06a7.978 7.978 0 01-4.242-1.757l-.752.752a1 1 0 01-1.414-1.414l.752-.752A7.978 7.978 0 013.06 13H2a1 1 0 110-2h1.06a7.978 7.978 0 011.757-4.242l-.752-.752a1 1 0 011.414-1.414l.752.752A7.978 7.978 0 0111 4.06V3a1 1 0 011-1z" />
    </svg>
  {:else}
    <!-- Dark icon -->
    <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.75 12.007a9.75 9.75 0 01-9.743 9.743 9.57 9.57 0 01-3.634-.705.75.75 0 01-.175-1.28A8.25 8.25 0 0012 3.757c.27 0 .538.014.803.042a.75.75 0 01.557 1.107 8.247 8.247 0 007.686 7.101.75.75 0 01.704.75z" />
    </svg>
  {/if}
</button>

<style lang="scss" src="./DarkModeToggle.scss"></style>
