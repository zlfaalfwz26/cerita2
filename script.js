document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const clearBtn = document.getElementById('clear-btn');
    const chatBody = document.getElementById('chat-body');
    const starterArea = document.getElementById('starter-area');
    const backsound = document.getElementById('backsound');
    const soundBtn = document.getElementById('sound-btn');
    const soundLabel = document.getElementById('sound-label');
    const video = document.getElementById('bg-video');
    const videoBtn = document.getElementById('video-btn');
    const videoLabel = document.getElementById('video-label');
    const audioStatus = document.getElementById('audio-status');
    const composerNote = document.getElementById('composer-note');
    const initialMessage = chatBody.innerHTML;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activeRequest = null;

    function scrollConversation() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function appendMessage(text, sender, options = {}) {
        const message = document.createElement('div');
        message.classList.add('message', sender);
        if (options.error) message.classList.add('error');

        const meta = document.createElement('div');
        meta.className = 'message-meta';
        meta.textContent = sender === 'user' ? 'Kamu' : 'Cerita';

        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.textContent = text;

        message.append(meta, bubble);
        chatBody.appendChild(message);
        scrollConversation();
        return message;
    }

    function createTypingMessage() {
        const message = document.createElement('div');
        message.className = 'message ai';

        const meta = document.createElement('div');
        meta.className = 'message-meta';
        meta.textContent = 'Cerita sedang merangkai jawaban';

        const bubble = document.createElement('div');
        bubble.className = 'bubble typing-bubble';
        bubble.setAttribute('aria-label', 'Sedang mengetik');

        for (let i = 0; i < 3; i += 1) {
            bubble.appendChild(document.createElement('span'));
        }

        message.append(meta, bubble);
        chatBody.appendChild(message);
        scrollConversation();
        return message;
    }

    function setSending(isSending) {
        sendBtn.disabled = isSending;
        sendBtn.querySelector('span').textContent = isSending ? 'Mengirim…' : 'Kirim';
        composerNote.textContent = isSending
            ? 'Kamu tetap boleh menyiapkan cerita berikutnya.'
            : 'Enter untuk mengirim · Shift + Enter untuk baris baru';
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text || activeRequest) return;

        appendMessage(text, 'user');
        chatInput.value = '';
        chatInput.style.height = 'auto';
        starterArea.classList.add('is-hidden');

        const controller = new AbortController();
        const typingMessage = createTypingMessage();
        activeRequest = { controller, typingMessage };
        setSending(true);

        try {
            const response = await fetch('chat.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
                signal: controller.signal
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || `Permintaan gagal (${response.status}).`);
            }

            if (data.error) {
                throw new Error(data.error);
            }

            const reply = data.choices?.[0]?.message?.content;
            if (typeof reply !== 'string' || !reply.trim()) {
                throw new Error('Balasan belum tersedia. Coba kirim ceritamu sekali lagi.');
            }

            typingMessage.remove();
            appendMessage(reply.trim(), 'ai');
        } catch (error) {
            typingMessage.remove();
            if (error.name !== 'AbortError') {
                console.error('Gagal mengirim cerita:', error);
                appendMessage(
                    error.message || 'Cerita belum terkirim. Periksa koneksi lalu coba lagi.',
                    'ai',
                    { error: true }
                );
            }
        } finally {
            if (activeRequest?.controller === controller) {
                activeRequest = null;
                setSending(false);
                chatInput.focus();
            }
        }
    }

    function resetConversation() {
        if (activeRequest) {
            activeRequest.controller.abort();
            activeRequest = null;
        }

        chatBody.innerHTML = initialMessage;
        starterArea.classList.remove('is-hidden');
        chatInput.value = '';
        chatInput.style.height = 'auto';
        setSending(false);
        chatInput.focus();
    }

    function updateVideoControl() {
        const isPaused = video.paused;
        videoBtn.setAttribute('aria-pressed', String(!isPaused));
        videoLabel.textContent = isPaused ? 'Putar suasana' : 'Jeda suasana';
        videoBtn.querySelector('svg').innerHTML = isPaused
            ? '<path d="M8 5v14l11-7z"/>'
            : '<path d="M8 5h3v14H8zm5 0h3v14h-3z"/>';
    }

    soundBtn.addEventListener('click', async () => {
        if (!backsound.paused) {
            backsound.pause();
            soundBtn.setAttribute('aria-pressed', 'false');
            soundLabel.textContent = 'Nyalakan suara';
            audioStatus.textContent = 'Suara latar dimatikan.';
            return;
        }

        try {
            await backsound.play();
            soundBtn.setAttribute('aria-pressed', 'true');
            soundLabel.textContent = 'Matikan suara';
            audioStatus.textContent = 'Suara latar dinyalakan.';
        } catch (error) {
            console.error('Suara latar tidak dapat diputar:', error);
            audioStatus.textContent = 'Suara latar tidak dapat diputar. Coba lagi atau lanjutkan tanpa suara.';
        }
    });

    videoBtn.addEventListener('click', async () => {
        if (video.paused) {
            try {
                await video.play();
            } catch (error) {
                console.error('Video suasana tidak dapat diputar:', error);
                audioStatus.textContent = 'Video suasana tidak dapat diputar di perangkat ini.';
            }
        } else {
            video.pause();
        }
        updateVideoControl();
    });

    video.addEventListener('play', updateVideoControl);
    video.addEventListener('pause', updateVideoControl);

    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();
        sendMessage();
    });

    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = `${Math.min(chatInput.scrollHeight, 150)}px`;
    });

    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            chatForm.requestSubmit();
        }
    });

    starterArea.addEventListener('click', (event) => {
        const starter = event.target.closest('.starter-chip');
        if (!starter) return;

        chatInput.value = starter.textContent.trim();
        chatInput.dispatchEvent(new Event('input', { bubbles: true }));
        chatInput.focus();
    });

    clearBtn.addEventListener('click', resetConversation);

    if (reducedMotion.matches) {
        video.pause();
    }
    updateVideoControl();

    reducedMotion.addEventListener?.('change', (event) => {
        if (event.matches) {
            video.pause();
        }
    });
});
