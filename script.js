// Main script for interactions, animations, date, form validation, and theme toggle

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const themeToggle = document.getElementById('themeToggle');
  const dateEl = document.getElementById('currentDate');
  const greetBtn = document.getElementById('greetBtn');
  const hero = document.querySelector('.hero');
  const contactForm = document.getElementById('contactForm');

  // 1) Date display (formatted)
  function formatDate(d){
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(d).toLocaleDateString('id-ID', options);
  }
  if(dateEl) dateEl.textContent = formatDate(new Date());

  // 2) Theme toggle (persist in localStorage)
  function setTheme(isDark){
    document.body.classList.toggle('dark', isDark);
    if(isDark) localStorage.setItem('theme','dark'); else localStorage.removeItem('theme');
    if(themeToggle) themeToggle.textContent = isDark ? '☀️ Terang' : '🌙 Gelap';
  }
  const saved = localStorage.getItem('theme') === 'dark';
  setTheme(saved);
  if(themeToggle) {
    themeToggle.addEventListener('click', () => setTheme(!document.body.classList.contains('dark')));
    themeToggle.classList.add('btn');
  }

  // 3) Simple hero animation (fade-in)
  if(hero){
    hero.classList.add('fade-in');
  }

  // 4) Greet button interaction
  if(greetBtn){
    greetBtn.addEventListener('click', () => {
      const name = prompt('Masukkan nama kamu:');
      const messageEl = document.getElementById('greetMessage');
      if(name && name.trim().length>0){
        messageEl.textContent = `Halo, ${name.trim()}! Selamat datang di website kami 😊`;
        messageEl.classList.add('fade-in');
      } else {
        messageEl.textContent = 'Kamu belum memasukkan nama!';
        messageEl.classList.add('fade-in');
      }
    });
  }

  // 5) Form validation (simple)
  if(contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('input[name="name"]').value.trim();
      const email = contactForm.querySelector('input[name="email"]').value.trim();
      const msg = contactForm.querySelector('textarea[name="message"]').value.trim();
      let errors = [];
      if(name.length < 2) errors.push('Nama minimal 2 karakter.');
      if(!/^\S+@\S+\.\S+$/.test(email)) errors.push('Email tidak valid.');
      if(msg.length < 6) errors.push('Pesan minimal 6 karakter.');
      const feedback = document.getElementById('formFeedback');
      if(errors.length){
        feedback.textContent = errors.join(' ');
        feedback.style.color = '#d9534f';
        feedback.classList.add('fade-in');
      } else {
        feedback.textContent = 'Terima kasih! Pesan terkirim (simulasi).';
        feedback.style.color = '#2e7d32';
        feedback.classList.add('fade-in');
        contactForm.reset();
      }
    });
  }

  // 6) Small accessible keyboard support: toggle theme with 't'
  document.addEventListener('keydown', (e) => {
    if(e.key.toLowerCase() === 't'){
      setTheme(!document.body.classList.contains('dark'));
    }
  });
});

// YouTube IFrame API loader + graceful fallback when embedding is blocked (multiple players)
(function(){
  // Array of video configurations (updated with new IDs)
  const videos = [
    { playerId: 'youtube-player-1', videoId: 'eEul5DUjkBc', fallbackId: 'youtube-fallback-1' },
    { playerId: 'youtube-player-2', videoId: 'v8r5w8bR0mE', fallbackId: 'youtube-fallback-2' },
    { playerId: 'youtube-player-3', videoId: 'T6iuKl76pgM', fallbackId: 'youtube-fallback-3' }
  ];

  function showYoutubeFallback(fallbackId, reason){
    try{
      const fallbackEl = document.getElementById(fallbackId);
      if(fallbackEl){
        const reasonEl = fallbackEl.querySelector('.reason');
        if(reasonEl) reasonEl.textContent = reason || '';
        fallbackEl.style.display = 'flex';
      }
      const playerEl = document.getElementById(videos.find(v => v.fallbackId === fallbackId).playerId);
      if(playerEl) playerEl.innerHTML = '';
    }catch(e){ /* ignore */ }
  }

  // Load the IFrame API script
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  tag.async = true;
  document.head.appendChild(tag);

  // API ready callback (must be global)
  window.onYouTubeIframeAPIReady = function(){
    videos.forEach(({ playerId, videoId, fallbackId }) => {
      try{
        const playerEl = document.getElementById(playerId);
        if(!playerEl) return showYoutubeFallback(fallbackId, 'Elemen pemutar tidak ditemukan.');
        new YT.Player(playerId, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: { rel: 0, modestbranding: 1 },
          events: {
            onError: function(e){
              let reason = 'Video tidak dapat diputar (kode: ' + e.data + ').';
              if(e.data === 153) reason = 'Error 153: Konfigurasi pemutar video tidak valid. Video mungkin dibatasi atau ID salah.';
              showYoutubeFallback(fallbackId, reason);
            }
          }
        });
      }catch(err){
        showYoutubeFallback(fallbackId, 'Gagal memuat pemutar YouTube.');
      }
    });
  };

  // If API fails to load in reasonable time, show fallback for all
  setTimeout(function(){
    if(typeof YT === 'undefined' || typeof YT.Player !== 'function'){
      videos.forEach(({ fallbackId }) => {
        showYoutubeFallback(fallbackId, 'Waktu tunggu pemutar habis.');
      });
    }
  }, 6000);
})();