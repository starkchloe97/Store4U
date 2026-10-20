const observers = new WeakMap();

export const revealDirective = {
  mounted(element) {
    element.classList.add('rv');
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      element.classList.add('in');
      return;
    }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    observers.set(element, observer);
    observer.observe(element);
  },
  unmounted(element) {
    const observer = observers.get(element);
    observer?.unobserve(element);
    observer?.disconnect();
    observers.delete(element);
  }
};
