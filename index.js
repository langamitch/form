
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('questionnaire-form');
    const thankYouMessage = document.getElementById('thank-you-message');
    const helpButton = document.getElementById('help-button');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        // Update icon
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        // Save theme preference to localStorage
        const isDarkTheme = document.body.classList.contains('dark-theme');
        localStorage.setItem('darkTheme', isDarkTheme);
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    // Help button functionality
    helpButton.addEventListener('click', function() {
        alert('Need assistance filling out the form, removing your response in the survey or any other issue? Please contact our support team at langamitch69@gmail.com or call (+27) 79 244 4395.');
    });

    // Form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Reset previous error states
        const formItems = document.querySelectorAll('.form-item');
        formItems.forEach(item => {
            item.classList.remove('error');
        });
        
        let isValid = true;
        
        // Validate name
        const nameInput = document.getElementById('name');
        if (!nameInput.value.trim()) {
            document.getElementById('name-item').classList.add('error');
            isValid = false;
        }
        
        // Validate email
        const emailInput = document.getElementById('email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            document.getElementById('email-item').classList.add('error');
            isValid = false;
        }
        
        // Validate service selection
        const serviceRadios = document.querySelectorAll('input[name="service"]');
        let serviceSelected = false;
        serviceRadios.forEach(radio => {
            if (radio.checked) serviceSelected = true;
        });
        if (!serviceSelected) {
            document.getElementById('service-item').classList.add('error');
            isValid = false;
        }
        
        // Validate budget selection
        const budgetSelect = document.getElementById('budget');
        if (!budgetSelect.value) {
            document.getElementById('budget-item').classList.add('error');
            isValid = false;
        }
        
        // Validate design needs
        const needsCheckboxes = document.querySelectorAll('input[name="needs"]');
        let needsSelected = false;
        needsCheckboxes.forEach(checkbox => {
            if (checkbox.checked) needsSelected = true;
        });
        if (!needsSelected) {
            document.getElementById('needs-item').classList.add('error');
            isValid = false;
        }
        
        // Validate timeline selection
        const timelineSelect = document.getElementById('timeline');
        if (!timelineSelect.value) {
            document.getElementById('timeline-item').classList.add('error');
            isValid = false;
        }
        
        // Validate call preference
        const callRadios = document.querySelectorAll('input[name="call"]');
        let callSelected = false;
        callRadios.forEach(radio => {
            if (radio.checked) callSelected = true;
        });
        if (!callSelected) {
            document.getElementById('calls-item').classList.add('error');
            isValid = false;
        }
        
        // Validate message
        const messageInput = document.getElementById('message');
        if (!messageInput.value.trim()) {
            document.getElementById('message-item').classList.add('error');
            isValid = false;
        }
        
        // If all validations pass
        if (isValid) {
            try {
                // Prepare form data
                const formData = {
                    name: nameInput.value,
                    email: emailInput.value,
                    service: document.querySelector('input[name="service"]:checked').value,
                    budget: budgetSelect.value,
                    needs: Array.from(document.querySelectorAll('input[name="needs"]:checked')).map(cb => cb.value),
                    timeline: timelineSelect.value,
                    call: document.querySelector('input[name="call"]:checked').value,
                    message: messageInput.value,
                    submittedAt: serverTimestamp()
                };

                // Save to Firebase
                await addDoc(collection(db, 'form-submissions'), formData);
                
                // Hide the form and show thank you message
                form.style.display = 'none';
                thankYouMessage.style.display = 'block';
                
                // Scroll to the thank you message
                thankYouMessage.scrollIntoView({ behavior: 'smooth' });

                // Reset form
                form.reset();
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was an error submitting your form. Please try again later.');
            }
        } else {
            // Scroll to the first error
            const firstError = document.querySelector('.form-item.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});
