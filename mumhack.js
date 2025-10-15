// --- Dashboard Demo Data & Logic ---
const demoComplaints = [
	{
		id: 1,
		title: 'Potholes on Main Street',
		desc: 'Large potholes causing traffic and accidents near Andheri East.',
		upvotes: 12,
		advice: ''
	},
	{
		id: 2,
		title: 'Overflowing Garbage Bins',
		desc: 'Garbage bins not cleared regularly in Bandra West.',
		upvotes: 9,
		advice: ''
	},
	{
		id: 3,
		title: 'Broken Streetlights',
		desc: 'Several streetlights not working in Dadar area.',
		upvotes: 7,
		advice: ''
	}
];

function renderDashboard() {
	// Sort by upvotes descending
	demoComplaints.sort((a, b) => b.upvotes - a.upvotes);
	const icons = ['🛣️', '🗑️', '💡', '🚰', '🌳', '🏚️'];
	const list = document.getElementById('dashboard-list');
	list.innerHTML = '';
	demoComplaints.forEach((c, idx) => {
		const icon = icons[idx % icons.length];
		list.innerHTML += `
		<div class="dashboard-card">
			<div class="dashboard-title"><span class="dash-icon">${icon}</span> ${c.title}</div>
			<div class="dashboard-desc">${c.desc}</div>
			<div class="dashboard-upvotes">
				<button class="upvote-btn" onclick="upvoteComplaint(${c.id})" title="Upvote"><span style='font-size:1.3rem;'>▲</span></button> ${c.upvotes} Upvotes
			</div>
			<div class="dashboard-advice" id="advice-${c.id}">${c.advice ? c.advice : '<button onclick=\"getAdvice(' + c.id + ')\">Get AI Advice</button>'}</div>
		</div>`;
	});
}

function upvoteComplaint(id) {
	const complaint = demoComplaints.find(c => c.id === id);
	if (complaint) {
		complaint.upvotes++;
		renderDashboard();
	}
}

function getAdvice(id) {
	const adviceDiv = document.getElementById('advice-' + id);
	adviceDiv.innerHTML = 'AI is thinking...';
	// Simulate AI API call
	setTimeout(() => {
		const advice = generateAdvice(id);
		adviceDiv.innerHTML = advice;
		const complaint = demoComplaints.find(c => c.id === id);
		if (complaint) complaint.advice = advice;
	}, 1200);
}

function generateAdvice(id) {
	// Simulated AI advice
	if (id === 1) return 'Advice: Report potholes to the municipal helpline and use the FixMyCity app for faster action. Temporary signage can help prevent accidents.';
	if (id === 2) return 'Advice: Contact your local ward office for garbage clearance. Encourage community participation in cleanliness drives.';
	if (id === 3) return 'Advice: File a complaint with the electricity board. Use reflective tape on poles as a temporary safety measure.';
	return 'Advice: Please contact your local authorities for more information.';
}
// --- Complaint Form Logic ---
function previewPhoto(event) {
	const file = event.target.files[0];
	const preview = document.getElementById('photo-preview');
	if (file) {
		const reader = new FileReader();
		reader.onload = function(e) {
			preview.src = e.target.result;
			preview.style.display = 'block';
		};
		reader.readAsDataURL(file);
	} else {
		preview.src = '';
		preview.style.display = 'none';
	}
}

function startVoiceInput() {
	const status = document.getElementById('voice-status');
	const result = document.getElementById('voice-result');
	result.style.display = 'block';
	status.textContent = 'Listening...';
	if ('webkitSpeechRecognition' in window) {
		const recognition = new webkitSpeechRecognition();
		recognition.lang = 'en-IN'; // Change to 'hi-IN' for Hindi, etc.
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;
		recognition.onresult = function(event) {
			result.value = event.results[0][0].transcript;
			status.textContent = 'Voice captured!';
		};
		recognition.onerror = function() {
			status.textContent = 'Voice recognition error.';
		};
		recognition.start();
	} else {
		status.textContent = 'Speech recognition not supported in this browser.';
	}
}

function submitComplaint(e) {
	e.preventDefault();
	document.getElementById('complaint-form').reset();
	document.getElementById('photo-preview').style.display = 'none';
	document.getElementById('voice-result').style.display = 'none';
	document.getElementById('voice-status').textContent = '';
	document.getElementById('complaint-success').style.display = 'block';
	setTimeout(() => {
		document.getElementById('complaint-success').style.display = 'none';
	}, 2500);
}

// --- Government Schemes Logic ---
function checkSchemes(e) {
	e.preventDefault();
	const age = parseInt(document.getElementById('age').value);
	const gender = document.getElementById('gender').value;
	const occupation = document.getElementById('occupation').value;
	const income = parseInt(document.getElementById('income').value);
	const state = document.getElementById('state').value.trim();
	// Simulate eligibility logic (replace with real API/AI)
	let schemes = [];
	if (age >= 18 && age <= 25 && occupation === 'student') {
		schemes.push({
			title: 'National Scholarship Scheme',
			desc: 'Financial aid for students pursuing higher education.',
			phone: '1800-111-1111'
		});
	}
	if (income < 300000) {
		schemes.push({
			title: 'PM Awas Yojana',
			desc: 'Affordable housing for low-income families.',
			phone: '1800-123-4567'
		});
	}
	if (gender === 'female' && age >= 18 && age <= 40) {
		schemes.push({
			title: 'Mahila Samman Yojana',
			desc: 'Empowering women through financial support.',
			phone: '1800-222-3333'
		});
	}
	if (state.toLowerCase() === 'maharashtra') {
		schemes.push({
			title: 'Maharashtra State Skill Development',
			desc: 'Skill training and job placement for youth.',
			phone: '1800-444-5555'
		});
	}
	// Default if no schemes
	if (schemes.length === 0) {
		schemes.push({
			title: 'No schemes found',
			desc: 'Sorry, we could not find any schemes for your profile.',
			phone: ''
		});
	}
	// Render results
	const resultDiv = document.getElementById('schemes-result');
	resultDiv.innerHTML = '';
	schemes.forEach(s => {
		resultDiv.innerHTML += `<div class="scheme-card">
			<div class="scheme-title">${s.title}</div>
			<div>${s.desc}</div>
			${s.phone ? `<div>Helpline: <span class="scheme-phone" onclick="callScheme('${s.phone}')">${s.phone}</span>
			<button class='call-btn' onclick="callScheme('${s.phone}')">Call</button></div>` : ''}
		</div>`;
	});
	resultDiv.style.display = 'block';
}

function callScheme(phone) {
	alert('Dialing ' + phone + ' (simulated)');
}

function startSchemeVoiceBot() {
	const status = document.getElementById('scheme-voice-status');
	status.textContent = 'Listening...';
	if ('webkitSpeechRecognition' in window) {
		const recognition = new webkitSpeechRecognition();
		recognition.lang = 'en-IN';
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;
		recognition.onresult = function(event) {
			const userQuery = event.results[0][0].transcript;
			status.textContent = 'Processing...';
			// Call AI API (replace with your backend or OpenAI endpoint)
			fetchAIResponse(userQuery, function(aiResponse) {
				status.textContent = 'Bot: ' + aiResponse;
				speak(aiResponse);
			});
		};
		recognition.onerror = function() {
			status.textContent = 'Voice recognition error.';
		};
		recognition.start();
	} else {
		status.textContent = 'Speech recognition not supported in this browser.';
	}

	// Placeholder for AI API call (replace with your real API)
	function fetchAIResponse(userQuery, callback) {
		// Example: fetch('/api/ai', { method: 'POST', body: JSON.stringify({query: userQuery}) })
		//   .then(res => res.json()).then(data => callback(data.answer));
		setTimeout(() => {
			callback('This is a sample answer about government schemes.');
		}, 1500);
	}

	// Text-to-Speech for bot response
	function speak(text) {
		if ('speechSynthesis' in window) {
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = 'en-IN';
			speechSynthesis.speak(utterance);
		}
	}
}

// Navigation between sections
function showSection(section) {
	const sections = ['home', 'dashboard', 'about', 'terms', 'privacy'];
	sections.forEach(sec => {
		document.getElementById(sec + '-section').classList.add('hidden');
		const navLink = document.querySelector(`nav ul li a[href="#${sec}"]`);
		if (navLink) navLink.classList.remove('active');
	});
	document.getElementById(section + '-section').classList.remove('hidden');
	const navLink = document.querySelector(`nav ul li a[href="#${section}"]`);
	if (navLink) navLink.classList.add('active');
	if (section === 'dashboard') renderDashboard();
}

// Tab switching with animation
function switchTab(tab) {
	const tabs = ['responsibility', 'scheme'];
	tabs.forEach(t => {
		document.getElementById(t).classList.remove('active');
		document.getElementById('tab-' + (t === 'responsibility' ? 'resp' : 'scheme')).classList.remove('active');
	});
	document.getElementById(tab).classList.add('active');
	document.getElementById('tab-' + (tab === 'responsibility' ? 'resp' : 'scheme')).classList.add('active');
}

// Profile icon click
function openProfile() {
	alert('Profile feature coming soon!');
}

// Default: show home section
document.addEventListener('DOMContentLoaded', function() {
	showSection('home');
	switchTab('responsibility');
	renderDashboard();
});
