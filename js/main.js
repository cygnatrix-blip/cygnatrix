// This function runs once the document is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    
    // --- START: NEW COMPONENT-LOADING CODE ---
    // This part is missing from your file.
    const loadComponent = (id, url) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${url}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                const element = document.getElementById(id);
                if (element) {
                    element.innerHTML = data;
                }
            })
            .catch(error => console.error(error));
    };

    // Load header and footer
    loadComponent("header-placeholder", "components/header.html");
    loadComponent("footer-placeholder", "components/footer.html");
    // --- END: NEW COMPONENT-LOADING CODE ---


    // --- YOUR EXISTING ANIMATION CODE (This part is correct) ---
    
    // 1. Select all elements we want to animate
    const sectionsToAnimate = document.querySelectorAll('.fade-in-section');

    // 2. Check if the browser supports IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        // If not, just make all sections visible immediately
        sectionsToAnimate.forEach(section => {
            section.classList.add('is-visible');
        });
        return; // Stop the script
    }

    // 3. Create the Observer
    // This "watches" for elements to enter the viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // entry.isIntersecting is true if the element is on screen
            if (entry.isIntersecting) {
                // Add the 'is-visible' class to trigger the CSS transition
                entry.target.classList.add('is-visible');
                
                // Stop observing this element since it's already visible
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // 4. Tell the observer to watch each of our sections
    sectionsToAnimate.forEach(section => {
        observer.observe(section);
    });

});

// --- NEW: Contact Form Handler ---
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission
            
            // Show sending status
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            formStatus.innerHTML = '';

            // Collect form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
            };

            // Send data to our Vercel serverless function
            fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Success
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Send Message';
                    formStatus.innerHTML = '<div class="alert alert-success" role="alert">Message sent successfully! We will get back to you soon.</div>';
                    contactForm.reset(); // Clear the form
                } else {
                    // Failure
                    throw new Error(result.error || 'An unknown error occurred.');
                }
            })
            .catch(error => {
                // Error
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Message';
                formStatus.innerHTML = `<div class="alert alert-danger" role="alert"><strong>Error:</strong> ${error.message}</div>`;
            });
        });
    }
    // --- END: Contact Form Handler ---