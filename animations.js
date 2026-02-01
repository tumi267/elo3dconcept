const services = document.querySelectorAll('.service');

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.classList.add('visible');   // fade in
      } else {
        entry.target.classList.remove('visible'); // fade out when out of view
      }
  });
}, {
  threshold: 0.3 // triggers when 30% of the element is visible
});

services.forEach(service => observer.observe(service));

document.addEventListener('DOMContentLoaded', () => {
    const teamDivs = document.querySelectorAll('.team');
  
    teamDivs.forEach(div => {
      div.addEventListener('click', () => {
        const isAlreadyExpanded = div.classList.contains('expanded');
  
        // reset all divs
        teamDivs.forEach(d => {
          d.classList.remove('expanded');
          d.style.transform = '';
        });
  
        if (!isAlreadyExpanded) {
          // expand clicked div
          div.classList.add('expanded');
  
        }
      });
    });
  });
  