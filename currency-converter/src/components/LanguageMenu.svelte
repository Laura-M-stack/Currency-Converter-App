<script lang="ts">
  import { tick } from 'svelte';
  import Icon from './Icon.svelte';
  import { LANG_NAMES, LANGS, type Lang } from '../i18n';

  type Props = { current: Lang; label: string; onchange: (lang: Lang) => void };
  let { current, label, onchange }: Props = $props();

  const uid = $props.id();
  let open = $state(false);
  let root = $state<HTMLDivElement>();
  let trigger = $state<HTMLButtonElement>();
  let menu = $state<HTMLUListElement>();

  function items(): HTMLButtonElement[] {
    return Array.from(menu?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? []);
  }

  async function openMenu() {
    open = true;
    await tick();
    const all = items();
    (all.find((el) => el.dataset.lang === current) ?? all[0])?.focus();
  }

  function closeMenu(restoreFocus = true) {
    open = false;
    if (restoreFocus) trigger?.focus();
  }

  function choose(lang: Lang) {
    if (lang !== current) onchange(lang);
    closeMenu();
  }

  function onMenuKeydown(event: KeyboardEvent) {
    const all = items();
    const index = all.indexOf(document.activeElement as HTMLButtonElement);
    const focusAt = (i: number) => all[(i + all.length) % all.length]?.focus();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusAt(index + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusAt(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusAt(0);
        break;
      case 'End':
        event.preventDefault();
        focusAt(all.length - 1);
        break;
      case 'Escape':
        event.preventDefault();
        closeMenu();
        break;
      case 'Tab':
        closeMenu(false);
        break;
    }
  }

  $effect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (root && !root.contains(event.target as Node)) closeMenu(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  });
</script>

<div class="lang" bind:this={root}>
  <button
    bind:this={trigger}
    type="button"
    class="icon-btn lang__trigger"
    aria-haspopup="menu"
    aria-expanded={open}
    aria-controls={open ? `${uid}-menu` : undefined}
    aria-label="{label}: {LANG_NAMES[current]}"
    onclick={() => (open ? closeMenu() : openMenu())}
    onkeydown={(event) => {
      if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
        event.preventDefault();
        openMenu();
      }
    }}
  >
    <Icon name="globe" size={18} />
    <span class="lang__code">{current.toUpperCase()}</span>
  </button>

  {#if open}
    <ul bind:this={menu} id="{uid}-menu" class="menu" role="menu" aria-label={label} tabindex="-1" onkeydown={onMenuKeydown}>
      {#each LANGS as lang (lang)}
        <li role="none">
          <button
            type="button"
            role="menuitemradio"
            aria-checked={lang === current}
            data-lang={lang}
            lang={lang}
            class="menu__item"
            tabindex="-1"
            onclick={() => choose(lang)}
          >
            <span>{LANG_NAMES[lang]}</span>
            {#if lang === current}<Icon name="check" size={16} />{/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .lang {
    position: relative;
  }

  .lang__trigger {
    gap: 6px;
    width: auto;
    padding: 0 12px;
  }

  .lang__code {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  .menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 30;
    min-width: 180px;
    margin: 0;
    padding: 6px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--card);
    box-shadow: var(--popover-shadow);
    list-style: none;
  }

  .menu__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 38px;
    padding: 0 10px;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text);
    font-size: 14px;
    text-align: left;
    cursor: pointer;
  }

  .menu__item:hover,
  .menu__item:focus-visible {
    background: var(--panel-hover);
    outline: none;
  }

  .menu__item[aria-checked='true'] {
    color: var(--accent-text);
    font-weight: 600;
  }
</style>
