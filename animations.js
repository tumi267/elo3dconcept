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
  threshold:1 // triggers when 30% of the element is visible
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
  // scroll to section
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  let lastScrollY = window.scrollY;
  const nav = document.querySelector('.nav');
  // hide nav animation
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
  
    if (currentScrollY > lastScrollY) {
      // Scrolling down
      nav.classList.add('nav--hidden');
    } else {
      // Scrolling up
      nav.classList.remove('nav--hidden');
    }
  
    lastScrollY = currentScrollY;
  });

  // contact form
  const form = document.querySelector('.contact-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const emailInput = form.email;
  const messageInput = form.message;

  // Clear previous errors
  form.querySelectorAll('.error-message').forEach(span => span.textContent = '');

  let valid = true;

  if (!emailInput.value.includes('@')) {
    emailInput.nextElementSibling.textContent = 'Please enter a valid email address';
    valid = false;
  }

  if (messageInput.value.length < 10) {
    messageInput.nextElementSibling.textContent = 'Message must be at least 10 characters';
    valid = false;
  }

  if (valid) {
    const clientEmail = 'info@client.co.za'; // ← replace
    const subject = encodeURIComponent('New website enquiry');
  const body = encodeURIComponent(
    `From: ${email}\n\nMessage:\n${message}`
  );

  window.location.href = `mailto:${clientEmail}?subject=${subject}&body=${body}`;
    // Demo submission
    messageInput.nextElementSibling.textContent = '';
    emailInput.nextElementSibling.textContent = '';
    const successMsg = document.createElement('span');
    successMsg.className = 'success-message';
    successMsg.textContent = 'This is for demo purposes only';
    form.appendChild(successMsg);
  }
});