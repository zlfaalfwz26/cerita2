<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#edf0e7">
    <meta name="description" content="Ruang tenang untuk bercerita, ditemani tanpa dihakimi.">
    <title>ruang untuk bercerita</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="site-header">
        <a class="wordmark" href="./" aria-label="Cerita, beranda">
            <span class="wordmark-mark" aria-hidden="true">c.</span>
            <span>Cerita</span>
        </a>

        <div class="ambience-controls" aria-label="Kontrol suasana">
            <button class="text-control" id="sound-btn" type="button" aria-label="Suara latar" aria-pressed="false">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Zm4 4a4 4 0 0 1 0 6m2-9a7 7 0 0 1 0 12"/></svg>
                <span id="sound-label">Nyalakan suara</span>
            </button>
            <button class="text-control" id="video-btn" type="button" aria-label="Gerakan suasana" aria-pressed="true">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                <span id="video-label">Jeda suasana</span>
            </button>
        </div>
    </header>

    <main class="workspace">
        <section class="welcome" aria-labelledby="page-title">
            <div class="welcome-copy">
                <h1 id="page-title">Kerahkan penatmu disini.</h1>
                <p class="intro">Tarik napas sebentar. Kamu boleh mulai dari mana saja, aku disini ko</p>
            </div>

            <figure class="atmosphere">
                <video id="bg-video" autoplay muted loop playsinline aria-label="Suasana tenang untuk menemani waktu bercerita">
                    <source src="video/video.mp4" type="video/mp4">
                </video>
                <figcaption>
                    <span>Tersenyumlah sejenak</span>
    
                </figcaption>
            </figure>

            <p class="privacy-note">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.6 2.9 8.4 7 10 4.1-1.6 7-5.4 7-10V6l-7-3Zm-3 9 2 2 4-4"/></svg>
                <span>Datamu aman di sini.</span>
            </p>
        </section>

        <section class="conversation" aria-labelledby="conversation-title">
            <div class="conversation-heading">
                <div>
                    <h2 id="conversation-title">Ruang dengar</h2>
                    <p class="conversation-subtitle"><span class="presence-dot" aria-hidden="true"></span> Siap menemanimu</p>
                </div>
                <button id="clear-btn" class="reset-btn" type="button" title="Mulai cerita baru">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8m0-5v5h5"/></svg>
                    <span>Mulai baru</span>
                </button>
            </div>

            <div class="chat-body" id="chat-body" role="log" aria-live="polite" aria-relevant="additions">
                <div class="message ai">
                    <div class="message-meta">Cerita <span aria-hidden="true">·</span> sekarang</div>
                    <div class="bubble">Halo. Aku di sini. Apa yang sedang terasa paling berat hari ini?</div>
                </div>
            </div>

            <div class="starter-area" id="starter-area">
                <p class="starter-prompt">Kalau sulit memulai, pilih salah satu:</p>
                <div class="starter-list">
                    <button class="starter-chip" type="button">Belakangan ini aku merasa…</button>
                    <button class="starter-chip" type="button">Ada hal yang belum bisa kulepaskan.</button>
                    <button class="starter-chip" type="button">Aku cuma ingin didengarkan.</button>
                </div>
            </div>

            <form class="chat-form" id="chat-form">
                <label class="visually-hidden" for="chat-input">Tulis ceritamu</label>
                <textarea id="chat-input" rows="1" placeholder="Tulis apa pun yang ada di pikiranmu…" autocomplete="off"></textarea>
                <button id="send-btn" class="send-btn" type="submit" aria-label="Kirim cerita">
                    <span>Kirim</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
                </button>
            </form>
            <p class="composer-note" id="composer-note">Enter untuk mengirim <span aria-hidden="true">·</span> Shift + Enter untuk baris baru</p>
            <p class="audio-status visually-hidden" id="audio-status" aria-live="polite"></p>
        </section>
    </main>

    <audio id="backsound" loop preload="none">
        <source src="audio/leberch-sad-piano-music-501447.mp3" type="audio/mpeg">
    </audio>

    <footer class="site-footer">
        <span>Tempatnya Cerita <span aria-hidden="true">©</span> 2026</span>
    </footer>

    <script src="script.js"></script>
</body>
</html>
