// This function runs once the document is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    
    // --- START: COMPONENT-LOADING CODE ---
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
    // --- END: COMPONENT-LOADING CODE ---


    // --- START: ANIMATION CODE ---
    const sectionsToAnimate = document.querySelectorAll('.fade-in-section');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        sectionsToAnimate.forEach(section => {
            observer.observe(section);
        });
    } else {
        // Fallback for older browsers
        sectionsToAnimate.forEach(section => {
            section.classList.add('is-visible');
        });
    }
    // --- END: ANIMATION CODE ---


    // --- START: CONTACT FORM HANDLER ---
    // (This was moved inside)
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            formStatus.innerHTML = '';

            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
            };

            fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                // Check if the response is valid JSON before parsing
                if (!response.ok) {
                    // If the server response is an error (like 404 or 500)
                    // throw an error to be caught by the .catch() block
                    throw new Error(`Server error: ${response.statusText}`);
                }
                return response.json();
            })
            .then(result => {
                if (result.success) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Send Message';
                    formStatus.innerHTML = '<div class="alert alert-success" role="alert">Message sent successfully! We will get back to you soon.</div>';
                    contactForm.reset();
                } else {
                    throw new Error(result.error || 'An unknown error occurred.');
                }
            })
            .catch(error => {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Message';
                // This is where you are seeing the error
                // The 'error.message' might contain 'Unexpected token 'T''
                // I've simplified it to a cleaner message.
                formStatus.innerHTML = `<div class="alert alert-danger" role="alert"><strong>Error:</strong> Could not send message. The server is not responding correctly. Please try again later.</div>`;
                console.error('Fetch Error:', error);
            });
        });
    }
    // --- END: CONTACT FORM HANDLER ---

}); // <-- The main DOMContentLoaded listener closes here