/* document.addEventListener("DOMContentLoaded", function () {
  const hiddenElements = document.querySelectorAll('.hidden-content');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing once the element is visible
        observer.unobserve(entry.target);
      }
    });
  });

  hiddenElements.forEach((el) => observer.observe(el));
});
 */

/* document.addEventListener("DOMContentLoaded", function () {
  const hiddenElements = document.querySelectorAll('.hidden-content');

  // Create the IntersectionObserver with rootMargin for 70% from top
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);  // Stop observing once the element is visible
      }
    });
  }, {
    root: null,  // Use the viewport as the root
    rootMargin: '-30% 0px',  // Offset the intersection by 30% from the top
    threshold: 0  // Trigger as soon as any part of the element is visible
  });

  hiddenElements.forEach((el) => observer.observe(el));
});

 */


/* document.addEventListener("DOMContentLoaded", function () {
  const welcomeSection = document.querySelector('.welcome-section');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');  // Show the section
        
        // Stop observing the welcome section once it becomes visible
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '-30% 0px',  // Show when 70% of viewport is above the section
    threshold: 0
  });

  observer.observe(welcomeSection);
});
 */




document.addEventListener("DOMContentLoaded", function () {
  const hiddenElements = document.querySelectorAll('.hidden-content');

  // Create the IntersectionObserver with rootMargin for 70% from top
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);  // Stop observing once the element is visible
      }
    });
  }, {
    root: null,  // Use the viewport as the root
    rootMargin: '-30% 0px',  // Offset the intersection by 30% from the top
    threshold: 0  // Trigger as soon as any part of the element is visible
  });



  hiddenElements.forEach((el) => observer.observe(el));
});

