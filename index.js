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
        
        // Validate student number
        const studentNumberInput = document.getElementById('student-number');
        if (!studentNumberInput.value.trim()) {
            document.getElementById('student-number-item').classList.add('error');
            isValid = false;
        }
        
        // Validate year
        const yearSelected = document.querySelector('input[name="year"]:checked');
        if (!yearSelected) {
            document.getElementById('year-item').classList.add('error');
            isValid = false;
        }
        
        // Validate course
        const courseSelected = document.querySelector('input[name="faculty"]:checked');
        if (!courseSelected) {
            document.getElementById('faculty-item').classList.add('error');
            isValid = false;
        }
        
        // Validate problems
        const problemsInput = document.getElementById('problems');
        if (!problemsInput.value.trim()) {
            document.getElementById('problems-item').classList.add('error');
            isValid = false;
        }
        
        // Validate access difficulties
        const accessSelected = document.querySelectorAll('input[name="access"]:checked');
        if (accessSelected.length === 0) {
            document.getElementById('access-difficulties-item').classList.add('error');
            isValid = false;
        }
        
        // Validate difficulty causes
        const causesSelected = document.querySelectorAll('input[name="causes"]:checked');
        if (causesSelected.length === 0) {
            document.getElementById('difficulty-causes-item').classList.add('error');
            isValid = false;
        }
        
        // Validate smartphone usage
        const smartphoneUsageSelected = document.querySelector('input[name="smartphone-usage"]:checked');
        if (!smartphoneUsageSelected) {
            document.getElementById('smartphone-usage-item').classList.add('error');
            isValid = false;
        }
        
        // Validate app help
        const appHelpSelected = document.querySelector('input[name="app-help"]:checked');
        if (!appHelpSelected) {
            document.getElementById('app-help-item').classList.add('error');
            isValid = false;
        }
        
        // Validate digital tasks
        const digitalTasksInput = document.getElementById('digital-tasks');
        if (!digitalTasksInput.value.trim()) {
            document.getElementById('digital-tasks-item').classList.add('error');
            isValid = false;
        }
        
        // Validate testing willingness
        const testingWillingnessSelected = document.querySelector('input[name="testing-willingness"]:checked');
        if (!testingWillingnessSelected) {
            document.getElementById('testing-willingness-item').classList.add('error');
            isValid = false;
        }
        
        // Validate suggestions
        const suggestionsInput = document.getElementById('suggestions');
        if (!suggestionsInput.value.trim()) {
            document.getElementById('suggestions-item').classList.add('error');
            isValid = false;
        }
        
        // If all validations pass
        if (isValid) {
            try {
                // Prepare form data
                const formData = {
                    // Section A: General Student Experience
                    name: document.getElementById('name').value,
                    studentNumber: document.getElementById('student-number').value,
                    year: document.querySelector('input[name="year"]:checked')?.value,
                    course: document.querySelector('input[name="faculty"]:checked')?.value,
                    courseOther: document.getElementById('faculty-other-text')?.value,
                    problems: document.getElementById('problems').value,

                    // Section B: Access & Campus Services
                    accessDifficulties: Array.from(document.querySelectorAll('input[name="access"]:checked')).map(cb => cb.value),
                    accessOther: document.getElementById('access-other-text')?.value,
                    difficultyCauses: Array.from(document.querySelectorAll('input[name="causes"]:checked')).map(cb => cb.value),
                    causesOther: document.getElementById('cause-other-text')?.value,

                    // Section C: Technology on Campus
                    smartphoneUsage: document.querySelector('input[name="smartphone-usage"]:checked')?.value,
                    appHelp: document.querySelector('input[name="app-help"]:checked')?.value,
                    appHelpDetails: document.getElementById('app-help-details')?.value,
                    digitalTasks: document.getElementById('digital-tasks')?.value,

                    // Section D: Willingness to Engage
                    testingWillingness: document.querySelector('input[name="testing-willingness"]:checked')?.value,
                    suggestions: document.getElementById('suggestions')?.value,

                    // Timestamp
                    submittedAt: serverTimestamp()
                };

                console.log('Form data prepared:', formData);
                console.log('Firebase db object:', db);
                console.log('Firebase functions available:', { addDoc, collection, serverTimestamp });

                // Save to Firebase
                const docRef = await addDoc(collection(db, 'form-submissions'), formData);
                console.log('Document written with ID:', docRef.id);
                
                // Hide the form and show thank you message
                form.style.display = 'none';
                thankYouMessage.style.display = 'block';
                
                // Scroll to the thank you message
                thankYouMessage.scrollIntoView({ behavior: 'smooth' });

                // Reset form
                form.reset();
            } catch (error) {
                console.error('Detailed error information:', {
                    message: error.message,
                    code: error.code,
                    stack: error.stack
                });
                alert(`Error submitting form: ${error.message}. Please check the console for more details.`);
            }
        } else {
            // Scroll to the first error
            const firstError = document.querySelector('.form-item.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // --- Profile Dropdown & Firebase Auth ---
    const profileIcon = document.getElementById('profile-icon');
    const profileDropdown = document.getElementById('profile-dropdown');
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profilePhoto = document.getElementById('profile-photo');
    const signInBtn = document.getElementById('sign-in-btn');
    const signOutBtn = document.getElementById('sign-out-btn');

    let auth, provider;
    if (window.firebase && window.firebase.auth) {
        auth = window.firebase.auth();
        provider = new window.firebase.auth.GoogleAuthProvider();
    } else if (window.getAuth) {
        auth = getAuth();
        provider = new GoogleAuthProvider();
    }

    function showDropdown(show) {
        profileDropdown.style.display = show ? 'block' : 'none';
    }
    profileIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        showDropdown(profileDropdown.style.display !== 'block');
    });
    document.addEventListener('click', function() {
        showDropdown(false);
    });

    if (auth) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                profileName.textContent = user.displayName || 'No Name';
                profileEmail.textContent = user.email;
                profilePhoto.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName||'User')}`;
                signInBtn.style.display = 'none';
                signOutBtn.style.display = 'block';
            } else {
                profileName.textContent = 'Guest';
                profileEmail.textContent = 'Not signed in';
                profilePhoto.src = 'https://ui-avatars.com/api/?name=User';
                signInBtn.style.display = 'block';
                signOutBtn.style.display = 'none';
            }
        });
        signInBtn.addEventListener('click', function() {
            signInWithPopup(auth, provider);
        });
        signOutBtn.addEventListener('click', function() {
            signOut(auth);
        });
    }
});
