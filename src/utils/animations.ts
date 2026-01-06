// Safe animation utilities to prevent clientHeight errors
export const safeAnimateElement = (element: HTMLElement | null, delay: number = 0) => {
  if (!element) return;
  
  setTimeout(() => {
    if (element && element.clientHeight) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  }, delay * 1000);
};

export const observeElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        safeAnimateElement(element, parseFloat(element.dataset.delay || '0'));
      }
    });
  });

  document.querySelectorAll('.stagger-item').forEach((el) => {
    observer.observe(el);
  });

  return observer;
};
