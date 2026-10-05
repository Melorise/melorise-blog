export default defineNuxtPlugin(() => {
  let pointerType = '';
  const controller = new AbortController();

  const clearRevealedSpoilers = (except?: HTMLElement) => {
    document
      .querySelectorAll<HTMLElement>('.heti del.is-spoiler-revealed')
      .forEach((spoiler) => {
        if (spoiler !== except) spoiler.classList.remove('is-spoiler-revealed');
      });
  };

  document.addEventListener('pointerdown', (event) => {
    pointerType = event.pointerType;
  }, { signal: controller.signal });

  document.addEventListener('click', (event) => {
    const isTouchInteraction = pointerType === 'touch' || pointerType === 'pen';
    pointerType = '';

    if (!isTouchInteraction || !(event.target instanceof Element)) return;

    const spoiler = event.target.closest<HTMLElement>('.heti del');

    if (!spoiler) {
      clearRevealedSpoilers();
      return;
    }

    if (!spoiler.classList.contains('is-spoiler-revealed')) {
      // 第一次点击只揭示内容，避免隐藏状态下误触其中的链接。
      event.preventDefault();
      clearRevealedSpoilers(spoiler);
      spoiler.classList.add('is-spoiler-revealed');
    }
  }, { signal: controller.signal });

  import.meta.hot?.dispose(() => controller.abort());
});
