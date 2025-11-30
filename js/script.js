// SAO Cybersecurity Tutorials - Main JavaScript

// Initialize Vanta.js background
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll reveal
    initScrollReveal();
    
    // Initialize filter functionality
    initFilters();

    // Display tutorial progress
    displayProgress();
});

// Scroll reveal animation
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// Smooth scroll to tutorials section
function scrollToTutorials() {
    document.getElementById('tutorials').scrollIntoView({
        behavior: 'smooth'
    });
}

// Filter functionality
function initFilters() {
    const filterBtn = document.getElementById('filter-btn');
    const filterModal = document.getElementById('filter-modal');
    
    filterBtn.addEventListener('click', () => {
        filterModal.classList.remove('hidden');
    });
}

function closeFilter() {
    document.getElementById('filter-modal').classList.add('hidden');
}

function applyFilters() {
    const difficulty = document.getElementById('difficulty-filter').value;
    const category = document.getElementById('category-filter').value;
    const cards = document.querySelectorAll('.tutorial-card');
    
    cards.forEach(card => {
        const cardDifficulty = card.dataset.difficulty;
        const cardCategory = card.dataset.category;
        
        let showCard = true;
        
        if (difficulty && cardDifficulty !== difficulty) {
            showCard = false;
        }
        
        if (category && cardCategory !== category) {
            showCard = false;
        }
        
        if (showCard) {
            card.style.display = 'block';
            card.classList.add('scroll-reveal');
        } else {
            card.style.display = 'none';
            card.classList.remove('scroll-reveal');
        }
    });
    
    closeFilter();
}

let quizData = [];

async function fetchQuizData() {
    try {
        const response = await fetch('js/quiz.json');
        quizData = await response.json();
    } catch (error) {
        console.error('Error fetching quiz data:', error);
    }
}

let currentQuestion = 0;
let score = 0;

async function loadQuiz() {
    if (quizData.length === 0) {
        await fetchQuizData();
    }
    const quizContent = document.getElementById('quiz-content');
    quizContent.innerHTML = ""; // Clear existing content

    const questionData = quizData[currentQuestion];

    const questionElement = document.createElement('div');
    questionElement.className = 'mb-6';
    questionElement.innerHTML = `
        <h4 class="text-lg font-semibold mb-3">Question ${currentQuestion + 1} of ${quizData.length}</h4>
        <p class="mb-4">${questionData.question}</p>
        <div class="space-y-2">
            ${questionData.options.map((option, index) => `
                <label class="flex items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700">
                    <input type="radio" name="q${currentQuestion}" value="${option}" class="mr-3">
                    <span>${option}</span>
                </label>
            `).join('')}
        </div>
    `;
    quizContent.appendChild(questionElement);

    const quizButtons = document.getElementById('quiz-buttons');
    if (quizButtons) {
        if (currentQuestion < quizData.length - 1) {
            quizButtons.innerHTML = `
                <button onclick="nextQuestion()" class="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                    Next
                </button>
                <button onclick="closeAssessment()" class="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
                    Close
                </button>
            `;
        } else {
            quizButtons.innerHTML = `
                <button onclick="submitQuiz()" class="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                    Submit
                </button>
                <button onclick="closeAssessment()" class="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
                    Close
                </button>
            `;
        }
    }
}

async function nextQuestion() {
    if (quizData.length === 0) {
        await fetchQuizData();
    }
    const selectedAnswer = document.querySelector(`input[name="q${currentQuestion}"]:checked`);
    if (selectedAnswer && selectedAnswer.value === quizData[currentQuestion].answer) {
        score++;
    }
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuiz();
    }
}

// Assessment modal functionality
function showAssessment() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('assessment-modal').classList.remove('hidden');
    const quizResults = document.getElementById('quiz-results');
    if (quizResults) {
        quizResults.classList.add('hidden');
    }
    loadQuiz();
}

function closeAssessment() {
    document.getElementById('assessment-modal').classList.add('hidden');
}

function submitQuiz() {
    const selectedAnswer = document.querySelector(`input[name="q${currentQuestion}"]:checked`);
    if (selectedAnswer && selectedAnswer.value === quizData[currentQuestion].answer) {
        score++;
    }

    const quizContent = document.getElementById('quiz-content');
    const quizResults = document.getElementById('quiz-results');

    quizContent.innerHTML = "";
    if (quizResults) {
        quizResults.classList.remove('hidden');
        quizResults.innerHTML = `
            <h3 class="text-2xl font-bold mb-4">Quiz Complete!</h3>
            <p class="text-xl mb-4">You scored ${score} out of ${quizData.length}</p>
            <button onclick="showAssessment()" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                Retake Quiz
            </button>
        `;
    }


    const quizButtons = document.getElementById('quiz-buttons');
    if(quizButtons) {
        quizButtons.innerHTML = `
            <button onclick="closeAssessment()" class="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
                Close
            </button>
        `;
    }
}

// Password strength checker (for tutorial pages)
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = [];
    
    // Length check
    if (password.length >= 12) {
        strength += 2;
    } else if (password.length >= 8) {
        strength += 1;
    } else {
        feedback.push('Password should be at least 12 characters long');
    }
    
    // Character variety checks
    if (/[a-z]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Include lowercase letters');
    }
    
    if (/[A-Z]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Include uppercase letters');
    }
    
    if (/[0-9]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Include numbers');
    }
    
    if (/[^A-Za-z0-9]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Include special characters');
    }
    
    // Common patterns check
    if (/(.)\1{2,}/.test(password)) {
        strength -= 1;
        feedback.push('Avoid repeated characters');
    }
    
    if (/123|abc|qwe/i.test(password)) {
        strength -= 1;
        feedback.push('Avoid sequential patterns');
    }
    
    // Determine strength level
    let strengthLevel = 'Very Weak';
    let strengthColor = '#ef4444';
    
    if (strength >= 6) {
        strengthLevel = 'Very Strong';
        strengthColor = '#22c55e';
    } else if (strength >= 5) {
        strengthLevel = 'Strong';
        strengthColor = '#84cc16';
    } else if (strength >= 3) {
        strengthLevel = 'Medium';
        strengthColor = '#f59e0b';
    } else if (strength >= 2) {
        strengthLevel = 'Weak';
        strengthColor = '#f97316';
    }
    
    return {
        strength: strength,
        level: strengthLevel,
        color: strengthColor,
        feedback: feedback
    };
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show success message
        const message = document.createElement('div');
        message.className = 'fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded-lg z-50';
        message.textContent = 'Copied to clipboard!';
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Progress tracking
function updateTutorialProgress(tutorialId, completed = true) {
    const progress = JSON.parse(localStorage.getItem('sao-progress') || '{}');
    progress[tutorialId] = completed;
    localStorage.setItem('sao-progress', JSON.stringify(progress));
}

function getTutorialProgress() {
    return JSON.parse(localStorage.getItem('sao-progress') || '{}');
}

// Function to display progress on the main page
function displayProgress() {
    const progress = getTutorialProgress();
    if (!progress) return;

    document.querySelectorAll('.tutorial-card').forEach(card => {
        const tutorialId = card.dataset.tutorialId;
        if (progress[tutorialId] === 'completed') {
            const header = card.querySelector('.flex.items-center.justify-between');
            if (header) {
                const checkmark = document.createElement('i');
                checkmark.className = 'fas fa-check-circle text-green-500 ml-2';
                header.appendChild(checkmark);
            }
        }
    });
}

// Social media sharing
function shareTutorial(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: `Check out this cybersecurity tutorial: ${title}`,
            url: url
        });
    } else {
        // Fallback: copy URL to clipboard
        copyToClipboard(url);
    }
}

// Search functionality
function searchTutorials(query) {
    const cards = document.querySelectorAll('.tutorial-card');
    const searchTerm = query.toLowerCase();
    
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        closeFilter();
        closeAssessment();
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Analytics and tracking (placeholder)
function trackTutorialView(tutorialId) {
    console.log(`Tutorial viewed: ${tutorialId}`);
    // Implement actual analytics tracking here
}

function trackButtonClick(buttonName) {
    console.log(`Button clicked: ${buttonName}`);
    // Implement actual analytics tracking here
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Implement error reporting here
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard navigation for tutorial cards
    const cards = document.querySelectorAll('.tutorial-card');
    cards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = card.querySelector('a');
                if (link) {
                    link.click();
                }
            }
        });
    });
});

// Phishing simulator functionality
function initPhishingSimulator() {
    const phishingFlags = document.querySelectorAll('.phishing-flag');
    const feedbackBox = document.getElementById('phishing-feedback');

    if (phishingFlags.length > 0 && feedbackBox) {
        phishingFlags.forEach(flag => {
            flag.addEventListener('click', (e) => {
                e.preventDefault();
                feedbackBox.innerHTML = `<div class="text-yellow-400 font-semibold">🚩 Good catch!</div><p class="mt-2">${flag.dataset.feedback}</p>`;
                flag.classList.add('bg-yellow-500/20');
            });
        });
    }
}

// Command line simulator functionality
function initCliSimulator() {
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output');
    
    if (cliInput && cliOutput) {
        let fileSystem = {
            'home': {
                'user': {
                    'Documents': {
                        'notes.txt': 'These are my cybersecurity notes'
                    },
                    'Desktop': {},
                    'Downloads': {}
                }
            }
        };
        let currentPath = ['home', 'user'];

        const getPath = (path) => {
            let current = fileSystem;
            for (const dir of path) {
                current = current[dir];
            }
            return current;
        };

        cliInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = e.target.value;
                const [cmd, ...args] = command.split(' ');
                
                // Print command
                cliOutput.innerHTML += `<div class="flex"><span class="command-prompt">user@sao:~$</span><span class="ml-2">${command}</span></div>`;

                switch (cmd) {
                    case 'pwd':
                        cliOutput.innerHTML += `<div>/${currentPath.join('/')}</div>`;
                        break;
                    case 'ls':
                        try {
                            const currentDir = getPath(currentPath);
                            const contents = Object.keys(currentDir);
                            cliOutput.innerHTML += `<div>${contents.join('  ')}</div>`;
                        } catch (error) {
                            cliOutput.innerHTML += `<div>ls: cannot access '${args[0]}': No such file or directory</div>`;
                        }
                        break;
                    case 'cd':
                        if (args[0] === '..') {
                            if (currentPath.length > 1) {
                                currentPath.pop();
                            }
                        } else if (args[0]) {
                            const currentDir = getPath(currentPath);
                            if (currentDir[args[0]]) {
                                currentPath.push(args[0]);
                            } else {
                                cliOutput.innerHTML += `<div>cd: ${args[0]}: No such file or directory</div>`;
                            }
                        }
                        break;
                    case 'cat':
                        try {
                            const currentDir = getPath(currentPath);
                            if (currentDir[args[0]]) {
                                cliOutput.innerHTML += `<div>${currentDir[args[0]]}</div>`;
                            } else {
                                cliOutput.innerHTML += `<div>cat: ${args[0]}: No such file or directory</div>`;
                            }
                        } catch (error) {
                            cliOutput.innerHTML += `<div>cat: ${args[0]}: No such file or directory</div>`;
                        }
                        break;
                    case 'echo':
                        cliOutput.innerHTML += `<div>${args.join(' ')}</div>`;
                        break;
                    case 'clear':
                        cliOutput.innerHTML = '';
                        break;
                    default:
                        cliOutput.innerHTML += `<div>command not found: ${cmd}</div>`;
                }

                e.target.value = '';
                cliOutput.scrollTop = cliOutput.scrollHeight;
            }
        });
    }
}

// Initialize phishing simulator on the appropriate page
if (window.location.pathname.includes('tutorial04.html')) {
    document.addEventListener('DOMContentLoaded', initPhishingSimulator);
}

if (window.location.pathname.includes('tutorial07.html')) {
    document.addEventListener('DOMContentLoaded', initCliSimulator);
}

// Export functions for use in other files
window.SAO = {
    scrollToTutorials,
    showAssessment,
    closeAssessment,
    submitQuiz,
    checkPasswordStrength,
    copyToClipboard,
    updateTutorialProgress,
    getTutorialProgress,
    shareTutorial,
    searchTutorials,
    trackTutorialView,
    trackButtonClick
};
// Progress bar functionality
function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }
    const readingProgressBar = document.getElementById('reading-progress-bar');
    if (readingProgressBar) {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        readingProgressBar.style.width = scrollPercent + '%';
        document.getElementById('reading-percentage').textContent = Math.round(scrollPercent) + '%';
    }
}
window.addEventListener('scroll', updateProgressBar);
// Tutorial 1 specific JavaScript
if (window.location.pathname.includes('tutorial01.html')) {
    // Interactive threat assessment
    function checkThreatAnswer() {
        const selected = document.querySelector('input[name="threat-assessment"]:checked');
        const feedback = document.getElementById('threat-feedback');
        
        if (!selected) {
            alert('Please select an answer first.');
            return;
        }
        
        feedback.classList.remove('hidden');
        
        if (selected.value === 'c') {
            feedback.innerHTML = '<div class="text-green-400 font-semibold">? Correct!</div><p class="mt-2">Using the same password for multiple accounts is extremely risky. If one account is compromised, all your accounts becomes vulnerable. This is why unique passwords for each account are crucial.</p>';
        } else {
            feedback.innerHTML = '<div class="text-yellow-400 font-semibold">Good try, but consider this:</div><p class="mt-2">While public WiFi and suspicious links are dangerous, using the same password across multiple accounts creates the highest risk because it creates a single point of failure for all your digital accounts.</p>';
        }
    }
    
    // Track tutorial progress
    document.addEventListener('DOMContentLoaded', function() {
        // Mark tutorial as started
        const progress = JSON.parse(localStorage.getItem('sao-progress') || '{}');
        progress['tutorial01'] = 'started';
        localStorage.setItem('sao-progress', JSON.stringify(progress));
        
        // Mark as completed when reaching the end
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progress['tutorial01'] = 'completed';
                    localStorage.setItem('sao-progress', JSON.stringify(progress));
                }
            });
        });
        
        const endSection = document.querySelector('footer');
        if (endSection) {
            observer.observe(endSection);
        }
    });
}

// Tutorial 2 specific JavaScript
if (window.location.pathname.includes('tutorial02.html')) {
    // Update password strength display
    function updatePasswordStrength() {
        const password = document.getElementById('password-input').value;
        const result = checkPasswordStrength(password);
        
        document.getElementById('strength-label').textContent = result.level;
        document.getElementById('strength-bar').className = `strength-bar ${result.class}`;
        
        const feedbackElement = document.getElementById('password-feedback');
        if (result.feedback.length > 0) {
            feedbackElement.innerHTML = '<strong>Suggestions:</strong><br>' + result.feedback.map(f => `• ${f}`).join('<br>');
            feedbackElement.className = 'text-sm text-yellow-300';
        } else {
            feedbackElement.innerHTML = '<strong class="text-green-400">Excellent password!</strong>';
            feedbackElement.className = 'text-sm text-green-400';
        }
    }
    
    // Event listener for password input
    const passwordInput = document.getElementById('password-input');
    if(passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }
    
    // Toggle password visibility
    function togglePasswordVisibility() {
        const input = document.getElementById('password-input');
        input.type = input.type === 'password' ? 'text' : 'password';
    }
    
    // Generate strong password
    function generateStrongPassword() {
        const length = 16;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        
        // Ensure at least one of each character type
        password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
        password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
        password += '0123456789'[Math.floor(Math.random() * 10)];
        password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
        
        // Fill the rest randomly
        for (let i = 4; i < length; i++) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }
        
        // Shuffle the password
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        document.getElementById('password-input').value = password;
        updatePasswordStrength();
    }
}

// Tutorial 4 specific JavaScript
if (window.location.pathname.includes('tutorial04.html')) {
    let quizAnswers = [];
    let score = 0;
    
    function selectOption(element, isCorrect) {
        // Remove previous selections in this question
        const question = element.closest('.quiz-question');
        question.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });
        
        // Mark this option as selected
        element.classList.add('selected');
        
        // Store the answer
        const questionIndex = Array.from(document.querySelectorAll('.quiz-question')).indexOf(question);
        quizAnswers[questionIndex] = isCorrect;
    }
    
    function showQuizResults() {
        if (quizAnswers.length < 3) {
            alert('Please answer all questions first!');
            return;
        }
        
        score = quizAnswers.filter(answer => answer).length;
        const percentage = (score / 3) * 100;
        
        document.getElementById('quiz-results').classList.remove('hidden');
        document.getElementById('score-display').textContent = `${score}/3 (${percentage}%)`;
        
        let feedback = '';
        if (score === 3) {
            feedback = 'Excellent! You have a keen eye for spotting phishing attempts. Keep up the great work!';
            document.getElementById('score-display').className = 'text-3xl font-bold text-green-400 text-center mb-4';
        } else if (score === 2) {
            feedback = 'Good job! You\'re on the right track. Review the red flags section to improve your detection skills.';
            document.getElementById('score-display').className = 'text-3xl font-bold text-yellow-400 text-center mb-4';
        } else {
            feedback = 'Keep learning! Phishing detection takes practice. Re-read this tutorial and try the quiz again.';
            document.getElementById('score-display').className = 'text-3xl font-bold text-red-400 text-center mb-4';
        }
        
        document.getElementById('score-feedback').textContent = feedback;
    }
}

// Tutorial 9 specific JavaScript
if (window.location.pathname.includes('tutorial09.html')) {
    let quizAnswers = [];
    
    function selectOption(element, isCorrect) {
        // Remove previous selections in this question
        const question = element.closest('.bg-gray-900');
        question.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Mark this option as selected
        element.classList.add('selected');
        
        // Store the answer
        const questionIndex = Array.from(document.querySelectorAll('.bg-gray-900')).indexOf(question);
        quizAnswers[questionIndex] = isCorrect;
    }
    
    function checkQuizAnswers() {
        if (quizAnswers.length < 3) {
            alert('Please answer all questions first!');
            return;
        }
        
        const score = quizAnswers.filter(answer => answer).length;
        const percentage = (score / 3) * 100;
        
        document.getElementById('quiz-results').classList.remove('hidden');
        document.getElementById('score-display').textContent = `${score}/3 (${percentage}%)`;
        
        let feedback = '';
        let scoreClass = '';
        
        if (score === 3) {
            feedback = 'Excellent! You have a strong understanding of different cyber attack types. You\'re ready to learn about more advanced security concepts.';
            scoreClass = 'text-green-400';
        } else if (score === 2) {
            feedback = 'Good job! You understand most attack types. Review the scenarios you missed to improve your threat recognition skills.';
            scoreClass = 'text-yellow-400';
        } else {
            feedback = 'Keep learning! Understanding attack types takes practice. Re-read the tutorial sections and try to identify the key characteristics of each attack type.';
            scoreClass = 'text-red-400';
        }
        
        document.getElementById('score-display').className = `text-2xl font-bold ${scoreClass} text-center mb-4`;
        document.getElementById('quiz-feedback').textContent = feedback;
    }
}