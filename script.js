document.addEventListener('DOMContentLoaded', () => {
    // --- Global Variables & Initial Setup ---
    const sections = document.querySelectorAll('main section');
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    const carSwiperContainer = document.querySelector('.car-swiper-container');
    const challengeSwiperContainer = document.querySelector('.challenge-swiper-container');
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Mock Data ---
    const carData = [
        {
            id: 'renault-kwid', name: 'Renault Kwid', model: 'Climber (O) AMT', specialty: 'Compact City Carver', engine: '1.0L SCe Petrol', special: 'AGS, High Ground Clearance, Feature-Packed Hatchback', reviews: 'Great for city driving, surprisingly spacious for its size. Mileage is decent.', imageClass: 'car-renault-kwid'
        },
        {
            id: 'nissan-magnite', name: 'Nissan Magnite', model: 'XV Premium Turbo CVT', specialty: 'Bold Compact SUV', engine: '1.0L HRA0 Turbo Petrol', special: 'CVT Smoothness, 360 Camera, Striking Looks', reviews: 'Peppy engine, feature-rich for the price. A true head-turner on the road!', imageClass: 'car-nissan-magnite'
        },
        {
            id: 'renault-kiger', name: 'Renault Kiger', model: 'RXZ Turbo X-TRONIC', specialty: 'Sporty Compact SUV', engine: '1.0L Turbo X-TRONIC Petrol', special: 'Wireless Charging, Sporty Dynamics, Smart Cabin', reviews: 'Fun to drive, especially in sport mode. AMT is smooth enough for city traffic.', imageClass: 'car-renault-kiger'
        },
        {
            id: 'nissan-gt-r', name: 'Nissan GT-R', model: 'Premium', specialty: 'Legendary Supercar "Godzilla"', engine: '3.8L Twin-Turbo V6', special: 'Handcrafted Engine, Blistering Acceleration, Advanced AWD', reviews: 'An absolute beast! The G-forces are insane. A dream car for many.', imageClass: 'car-nissan-gt-r'
        },
        {
            id: 'renault-triber', name: 'Renault Triber', model: 'RXZ EASY-R AMT Dual Tone', specialty: 'Flexible 7-Seater MPV', engine: '1.0L ENERGY Petrol', special: 'Modular Seating (EZ Mode), Spacious for its Footprint, Value for Money', reviews: 'Incredibly practical for families. The removable third row is a game changer.', imageClass: 'car-renault-triber'
        }
    ];

    const challengeQuestions = [
        { id: 1, category: 'Engine Basics', text: 'Which component ignites the air-fuel mixture in a petrol engine?', options: ['Glow Plug', 'Spark Plug', 'Injector', 'Piston'], answer: 'Spark Plug' },
        { id: 2, category: 'Transmission', text: 'What does "CVT" stand for in automatic transmissions?', options: ['Continuously Variable Transmission', 'Constant Velocity Torque', 'Central Valve Timing'], answer: 'Continuously Variable Transmission' },
        { id: 3, category: 'Safety Systems', text: 'What is the primary function of ABS in a car?', options: ['Improve Fuel Efficiency', 'Prevent Wheel Lock-up During Braking', 'Enhance Audio Quality'], answer: 'Prevent Wheel Lock-up During Braking' },
        { id: 4, category: 'General Knowledge', text: 'Which car manufacturer uses the "Skyactiv" technology branding?', options: ['Honda', 'Toyota', 'Mazda', 'Subaru'], answer: 'Mazda' }
    ];

    // --- Navigation ---
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSectionId = item.dataset.section;
            sections.forEach(section => {
                section.style.display = section.id === targetSectionId ? 'block' : 'none';
                if (section.id === targetSectionId) {
                    section.classList.add('section-active'); // For potential future use
                } else {
                    section.classList.remove('section-active');
                }
            });
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
             window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    // Activate the first section by default
    if(navItems.length > 0) navItems[0].click();


    // --- Swiper Card Logic (Generic for Cars and Challenges) ---
    function createSwiper(container, items, createCardFn) {
        if (!container) return;
        container.innerHTML = ''; // Clear previous cards
        let currentItemIndex = 0;

        function appendNewCard() {
            if (currentItemIndex < items.length) {
                const cardElement = createCardFn(items[currentItemIndex], currentItemIndex);
                container.appendChild(cardElement);
                initializeCardDrag(cardElement, () => { // onSwipeOut callback
                    currentItemIndex++;
                    setTimeout(appendNewCard, 100); // Add slight delay for next card
                    updateCardStack(container);
                });
            } else {
                 // Optional: Show a message or reload
                const message = document.createElement('p');
                message.textContent = container === carSwiperContainer ? "No more cars for now. Check back later!" : "You've completed all challenges! Well done!";
                message.style.color = 'var(--text-muted)';
                container.appendChild(message);
            }
        }

        // Initial cards (e.g., show 2-3 stacked)
        for (let i = 0; i < Math.min(3, items.length); i++) {
            appendNewCard();
        }
        updateCardStack(container);
    }

    function initializeCardDrag(card, onSwipeOut) {
        let startX, startY, distX, distY, isDragging = false;
        const threshold = card.offsetWidth * 0.35;

        function dragStart(e) {
            isDragging = true;
            card.classList.add('dragging');
            const touch = e.type === 'touchstart' ? e.touches[0] : e;
            startX = touch.clientX;
            startY = touch.clientY;
            card.style.transition = 'none';
        }

        function dragMove(e) {
            if (!isDragging) return;
            e.preventDefault();
            const touch = e.type === 'touchmove' ? e.touches[0] : e;
            distX = touch.clientX - startX;
            distY = touch.clientY - startY;
            card.style.transform = `translate(${distX}px, ${distY}px) rotate(${distX / 20}deg)`;
        }

        function dragEnd() {
            if (!isDragging) return;
            isDragging = false;
            card.classList.remove('dragging');
            card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';

            if (Math.abs(distX) > threshold) {
                const direction = distX > 0 ? 1 : -1;
                card.style.transform = `translate(${direction * (card.offsetWidth + 100)}px, ${distY}px) rotate(${direction * 30}deg)`;
                card.style.opacity = '0';
                setTimeout(() => {
                    card.remove();
                    if (onSwipeOut) onSwipeOut(direction > 0); // Pass like/pass
                }, 500);
            } else {
                card.style.transform = 'translate(0,0) rotate(0deg)'; // Return to stack position
                updateCardStack(card.parentElement); // Recalculate stack
            }
            distX = 0; distY = 0;
        }

        card.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
        card.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchmove', dragMove, { passive: false });
        document.addEventListener('touchend', dragEnd);
    }
    
    function updateCardStack(container) {
        if (!container) return;
        const cards = container.querySelectorAll('.car-card, .challenge-question-card');
        cards.forEach((card, index) => {
            card.style.zIndex = cards.length - index;
            card.style.transform = `translateY(${index * -6}px) scale(${1 - index * 0.03})`;
            card.style.opacity = index < 3 ? 1 : 0; // Show top 3 cards
        });
    }

    // --- Car Swiper Specific ---
    function createCarCardElement(car) {
        const card = document.createElement('div');
        card.classList.add('car-card');
        const flag = Math.random() > 0.3 ? 'green' : 'red'; // 70% green

        card.innerHTML = `
            <div class="car-card-image ${car.imageClass}"></div>
            <div class="car-details">
                <h3>${car.name}</h3>
                <p class="model">${car.model}</p>
                <p><strong>Specialty:</strong> ${car.specialty}</p>
                <p><strong>Engine:</strong> ${car.engine}</p>
                <p><strong>Why Special:</strong> ${car.special}</p>
                <span class="car-flag ${flag}">${flag === 'green' ? 'Highly Recommended!' : 'Check Specs Carefully'}</span>
            </div>
            <p class="people-reviews"><strong>Reviews:</strong> "${car.reviews}"</p>
        `;
        return card;
    }
    if (carSwiperContainer) createSwiper(carSwiperContainer, carData, createCarCardElement);

    // --- Challenge Swiper Specific ---
    function createChallengeCardElement(challenge) {
        const card = document.createElement('div');
        card.classList.add('challenge-question-card');
        let optionsHTML = challenge.options.map(opt => `<button class="option">${opt}</button>`).join('');

        card.innerHTML = `
            <h4>${challenge.category}</h4>
            <p class="question-text">${challenge.text}</p>
            <div class="options">${optionsHTML}</div>
            <button class="btn btn-small btn-save-question" style="margin-top: auto; background-color: var(--accent-color); font-size: 0.8em;"><i class="fas fa-bookmark"></i> Save Question</button>
        `;
        card.querySelectorAll('.option').forEach(button => {
            button.addEventListener('click', () => {
                alert(`You selected: ${button.textContent}. Correct answer was: ${challenge.answer} (Simulation)`);
                // Simulate swipe after answer
                card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                card.style.transform = `translate(0, -200%) rotate(0deg)`;
                card.style.opacity = '0';
                setTimeout(() => {
                    card.remove();
                    // Manually trigger the swipe out logic for challenges if createSwiper's callback is not sufficient
                    const parentContainer = card.parentElement;
                    if (parentContainer && parentContainer.onSwipeOut) {
                         parentContainer.onSwipeOut(true); // true for 'answered'
                    } else { // Fallback if using a different structure
                        const nextCardIndex = Array.from(parentContainer.children).indexOf(card) +1; // This logic needs to be tied to the createSwiper logic more tightly
                        if (parentContainer.children.length > 0 && parentContainer.children[0] === card) {
                           // A bit hacky, ideally createSwiper handles this progression fully
                           if (challengeSwiperContainer.currentItemIndex !== undefined) challengeSwiperContainer.currentItemIndex++;
                           if (challengeSwiperContainer.appendNewCard !== undefined) challengeSwiperContainer.appendNewCard();
                           updateCardStack(parentContainer);
                        }
                    }
                }, 500);
            });
        });
        card.querySelector('.btn-save-question').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card swipe
            saveItemToGarage(`Challenge: "${challenge.text.substring(0,30)}..."`);
        });
        return card;
    }

    // Attach currentItemIndex and appendNewCard to the container itself for createSwiper to use
    if (challengeSwiperContainer) {
        challengeSwiperContainer.currentItemIndex = 0;
        challengeSwiperContainer.appendNewCard = function() { // Simplified append for challenges
            if (this.currentItemIndex < challengeQuestions.length) {
                const cardElement = createChallengeCardElement(challengeQuestions[this.currentItemIndex]);
                this.appendChild(cardElement);
                initializeCardDrag(cardElement, () => {
                    this.currentItemIndex++;
                    setTimeout(() => this.appendNewCard(), 100);
                    updateCardStack(this);
                });
            } else {
                const message = document.createElement('p');
                message.textContent = "You've completed all challenges! Well done!";
                message.style.color = 'var(--text-muted)';
                this.appendChild(message);
            }
        };
        // Initial cards
        for (let i = 0; i < Math.min(3, challengeQuestions.length); i++) {
             challengeSwiperContainer.appendNewCard();
        }
        updateCardStack(challengeSwiperContainer);
    }


    // --- 3D Viewer Logic ---
    const modelSearch = document.getElementById('modelSearch');
    const viewOptionsBtns = document.querySelectorAll('#viewer-3d .view-btn');
    const carViewImage = document.getElementById('carViewImage');
    const carPartsInfo = document.getElementById('carPartsInfo');
    const carPartListItems = document.querySelectorAll('#carPartsInfo li');

    if (modelSearch) modelSearch.addEventListener('input', (e) => {
        console.log(`Searching for: ${e.target.value}`); // Simulation
        // In a real app, filter car models and update viewer
        if (e.target.value.toLowerCase().includes("magnite")) {
            carViewImage.src = 'https://stimg.cardekho.com/images/carinteriorimages/930x620/Nissan/Magnite/106 Magnite/1683859729042/dashboard-59.jpg'; // Example image
        } else {
            carViewImage.src = 'placeholder_car_outer.png'; // Default or found model
        }
    });

    viewOptionsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewOptionsBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const view = btn.dataset.view;
            carPartsInfo.style.display = 'none';
            switch(view) {
                case 'outer': carViewImage.src = 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Nissan/Magnite/106 Magnite/1683859696169/front-left-side-47.jpg?tr=w-600'; break; // Sample outer view
                case 'inner': carViewImage.src = 'https://stimg.cardekho.com/images/carinteriorimages/930x620/Nissan/Magnite/106 Magnite/1683859729042/dashboard-59.jpg'; break; // Sample inner view
                case 'parts':
                    carViewImage.src = 'https://imgd.aeplcdn.com/0x0/n/cw/ec/40360/kiger-engine-shot-10.jpeg'; // Sample engine/parts view
                    carPartsInfo.style.display = 'block';
                    break;
                default: carViewImage.src = 'placeholder_car_outer.png';
            }
        });
    });
    carPartListItems.forEach(item => {
        item.addEventListener('click', () => alert(`Highlighting ${item.textContent} (Simulation)`));
    });

    // --- Recommendations Logic ---
    const shareRecBtn = document.querySelector('.btn-share-recommendation');
    const courseLinkInput = document.getElementById('courseLink');
    const myRecommendationsBtn = document.getElementById('myRecommendationsBtn');
    const myRecommendationsListDiv = document.getElementById('myRecommendationsList');
    let userRecommendations = [];

    if (shareRecBtn) shareRecBtn.addEventListener('click', () => {
        const link = courseLinkInput.value.trim();
        if (link) {
            alert(`Sharing "${link}" with AI Guide for review (Simulation).`);
            userRecommendations.push(link); // Save locally
            courseLinkInput.value = '';
             if (myRecommendationsListDiv.style.display === 'block') displayRecommendations(); // Refresh if visible
        } else {
            alert('Please enter a link to recommend.');
        }
    });
    if (myRecommendationsBtn) myRecommendationsBtn.addEventListener('click', () => {
        myRecommendationsListDiv.style.display = myRecommendationsListDiv.style.display === 'none' ? 'block' : 'none';
        if (myRecommendationsListDiv.style.display === 'block') displayRecommendations();
    });
    function displayRecommendations() {
        myRecommendationsListDiv.innerHTML = '<h4>Your Curated Learning Path:</h4>';
        if (userRecommendations.length === 0) {
            myRecommendationsListDiv.innerHTML += '<p>No recommendations shared yet.</p>'; return;
        }
        const ul = document.createElement('ul');
        userRecommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            ul.appendChild(li);
        });
        myRecommendationsListDiv.appendChild(ul);
    }


    // --- My Garage Logic ---
    const garageTabs = document.querySelectorAll('.garage-tab-btn');
    const garageContents = document.querySelectorAll('.garage-content');
    const savedItemsListUl = document.getElementById('savedItemsList');
    const userStoryTextarea = document.getElementById('userStory');
    const saveStoryBtn = document.querySelector('.btn-save-story');
    const displayedStoryDiv = document.getElementById('displayedStory');
    let savedGarageItems = [`Challenge: "Identify this engine component..." (Saved)`]; // Initial item

    function displaySavedItems() {
        savedItemsListUl.innerHTML = '';
        if (savedGarageItems.length === 0) {
             savedItemsListUl.innerHTML = '<li>No items saved yet.</li>'; return;
        }
        savedGarageItems.forEach(itemText => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-bookmark"></i> ${itemText}`;
            savedItemsListUl.appendChild(li);
        });
    }
    displaySavedItems(); // Initial display

    function saveItemToGarage(itemText) {
        savedGarageItems.push(itemText);
        alert(`"${itemText.substring(0,40)}..." saved to Your Garage!`);
        displaySavedItems(); // Refresh list
    }


    garageTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            garageTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const targetContentId = tab.dataset.tab;
            garageContents.forEach(content => {
                content.style.display = content.id === targetContentId ? 'block' : 'none';
                content.classList.toggle('active', content.id === targetContentId);
            });
        });
    });

    if (saveStoryBtn) saveStoryBtn.addEventListener('click', () => {
        const story = userStoryTextarea.value.trim();
        if (story) {
            displayedStoryDiv.textContent = story;
            displayedStoryDiv.style.display = 'block';
            alert('Your story has been saved (locally for this session)!');
        } else {
            alert('Please write your story first.');
        }
    });
    
    // --- Modal Logic ---
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const closeBtns = document.querySelectorAll('.close-btn');

    function openModal(modal) { if (modal) modal.style.display = 'block'; }
    function closeModal(modal) { if (modal) modal.style.display = 'none'; }

    if (loginBtn) loginBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(loginModal); });
    if (signupBtn) signupBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(signupModal); });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.dataset.modal;
            closeModal(document.getElementById(modalId));
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) closeModal(loginModal);
        if (event.target === signupModal) closeModal(signupModal);
    });

    // Prevent form submission for demo modals
    document.querySelectorAll('.modal form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Form submitted (Simulation)! In a real app, this would process login/signup.');
            closeModal(form.closest('.modal'));
        });
    });

}); // End DOMContentLoaded
