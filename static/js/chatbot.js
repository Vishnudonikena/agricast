document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.getElementById('chat-button');
    const chatModal = document.getElementById('chat-modal');
    const closeButton = document.querySelector('.close-button');
    const sendButton = document.getElementById('send-message');
    const userInput = document.getElementById('user-message');
    const chatMessages = document.getElementById('chat-messages');
    const micButton = document.getElementById('mic');
    const voiceStopBtn = document.getElementById('voice-stop');
    const voiceStatus = document.querySelector('.voice-status');

    // Track currently playing audio so we can stop it when needed
    let currentAudio = null;
    let currentAudioURL = null;

    function stopCurrentAudio() {
        try {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                currentAudio = null;
            }
            if (currentAudioURL) {
                try { URL.revokeObjectURL(currentAudioURL); } catch (e) {}
                currentAudioURL = null;
            }
        } finally {
            if (voiceStopBtn) voiceStopBtn.style.display = 'none';
            if (voiceStatus) voiceStatus.textContent = '';
        }
    }

    // Voice recognition setup (create instance on demand for better permission handling)
    let recognition = null;
    let isRecording = false;

    function createRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return null;

        const r = new SpeechRecognition();
        r.continuous = false;
        r.interimResults = false;
        r.maxAlternatives = 1;
        r.lang = 'te-IN'; // Telugu default, change as needed

        r.onstart = () => {
            isRecording = true;
            if (voiceStatus) voiceStatus.textContent = 'Listening...';
            micButton.classList.add('recording');
            console.log('Speech recognition started');
        };

        r.onresult = (event) => {
            if (event.results && event.results.length > 0) {
                const text = event.results[0][0].transcript;
                console.log('Recognition result:', text);
                userInput.value = text;
                // stop recognition before sending to avoid overlap
                try { r.stop(); } catch (e) {}
                sendMessage();
            }
        };

        r.onerror = (event) => {
            console.error('Recognition error:', event.error || event);
            if (voiceStatus) voiceStatus.textContent = `Voice error: ${event.error || 'unknown'}`;
            isRecording = false;
            micButton.classList.remove('recording');
        };

        r.onend = () => {
            console.log('Recognition ended');
            isRecording = false;
            micButton.classList.remove('recording');
            if (voiceStatus) {
                // clear status after short delay so user sees it
                setTimeout(() => { if (!isRecording) voiceStatus.textContent = ''; }, 800);
            }
        };

        return r;
    }

    const speak = async (text) => {
        try {
            // Stop any previous audio before playing new
            stopCurrentAudio();

            const res = await fetch('/talk', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });

            if (!res.ok) throw new Error('TTS request failed');

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            currentAudioURL = url;
            currentAudio = new Audio(url);

            // Update UI
            if (voiceStopBtn) voiceStopBtn.style.display = 'block';
            if (voiceStatus) voiceStatus.textContent = 'Playing...';

            currentAudio.onended = () => {
                stopCurrentAudio();
            };

            currentAudio.onerror = () => {
                console.error('Audio playback error');
                stopCurrentAudio();
            };

            await currentAudio.play();
        } catch (err) {
            stopCurrentAudio();
            console.log("Audio playback failed", err);
        }
    };

    if (voiceStopBtn) {
        voiceStopBtn.addEventListener('click', () => {
            stopCurrentAudio();
        });
    }

    micButton.addEventListener('click', async () => {
        // create recognition instance if needed
        if (!recognition) {
            recognition = createRecognition();
            if (!recognition) {
                alert('Voice recognition not supported in your browser');
                return;
            }
        }

        if (!isRecording) {
            // show immediate feedback
            if (voiceStatus) voiceStatus.textContent = 'Preparing microphone...';

            // Try requesting microphone permission via getUserMedia to ensure browser prompts
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    // Immediately stop tracks; we only requested permission
                    stream.getTracks().forEach(t => t.stop());
                    console.log('Microphone permission granted');
                } catch (permErr) {
                    console.error('Microphone permission denied or error:', permErr);
                    if (voiceStatus) voiceStatus.textContent = 'Microphone permission denied';
                    return;
                }
            }

            try {
                recognition.start();
            } catch (e) {
                console.error('Failed to start recognition:', e);
                if (voiceStatus) voiceStatus.textContent = 'Failed to start microphone';
            }
        } else {
            try {
                recognition.stop();
            } catch (e) {
                console.warn('Error stopping recognition:', e);
            }
        }
    });

    // Chat modal open/close
    chatButton.addEventListener('click', () => chatModal.classList.add('open'));
    closeButton.addEventListener('click', () => chatModal.classList.remove('open'));

    const appendMessage = (type, content) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);

        if (type === 'bot') {
            messageDiv.innerHTML = (typeof marked !== 'undefined')
                ? marked.parse(content)
                : content;
        } else {
            messageDiv.textContent = content;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageDiv;
    };

    const sendMessage = async () => {
        const message = userInput.value.trim();
        if (!message) return;

        // Stop any previous audio when user sends a new message
        stopCurrentAudio();

        appendMessage('user', message);
        userInput.value = '';

        const loadingElem = appendMessage('bot', 'Typing...');

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) throw new Error('Network error');

            const data = await response.json();

            loadingElem.remove();
            appendMessage('bot', data.response);

            // voice reply
            speak(data.response);

        } catch (err) {
            console.error('Chat error:', err);
            loadingElem.remove();
            appendMessage('bot', 'Sorry, I encountered an error. Please try again.');
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    window.addEventListener('click', (e) => {
        if (!chatModal.contains(e.target) && !chatButton.contains(e.target)) {
            chatModal.classList.remove('open');
        }
    });
});
