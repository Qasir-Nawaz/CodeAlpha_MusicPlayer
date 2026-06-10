// Controls automation (Bina HTML ko chhede, icons ki classes se elements dhoondna)
const playPauseBtn = document.getElementById('play-pause') || document.querySelector('.fa-play')?.parentElement || document.querySelector('.fa-pause')?.parentElement;
const prevBtn = document.getElementById('prev') || document.querySelector('.fa-step-backward')?.parentElement;
const nextBtn = document.getElementById('next') || document.querySelector('.fa-step-forward')?.parentElement;

// ⚡ Charon buttons jo kaam nahi kar rahe thay:
const shuffleBtn = document.getElementById('shuffle') || document.querySelector('.fa-random')?.parentElement;
const repeatBtn = document.getElementById('repeat') || document.querySelector('.fa-redo')?.parentElement;
const minimizeBtn = document.getElementById('minimize') || document.querySelector('.fa-chevron-down')?.parentElement; 
const menuBtn = document.getElementById('menu') || document.querySelector('.fa-bars')?.parentElement;         

// Sizing panel items
const trackArt = document.getElementById('track-art') || document.querySelector('.track-details img');
const trackTitle = document.getElementById('track-title') || document.querySelector('.track-details h2');
const trackArtist = document.getElementById('track-artist') || document.querySelector('.track-details p');
const progressBar = document.getElementById('progress-bar') || document.querySelector('input[type="range"]');
const currentTimeDisplay = document.getElementById('current-time') || document.querySelector('.progress-container span:first-child');
const totalDurationDisplay = document.getElementById('total-duration') || document.querySelector('.progress-container span:last-child');

let currentAudio = new Audio();

// 🔥 5 Gaano Ki Playlist (Sequence: song1.mp3 to song5.mp3)
const songList = [
    { title: "sofi song", artist: "Sufi Track 1", path: "song1.mp3" },
    { title: "sofi song", artist: "Sufi Track 2", path: "song2.mp3" },
    { title: "sofi song", artist: "Sufi Track 3", path: "song3.mp3" },
    { title: "sofi song", artist: "Sufi Track 4", path: "song4.mp3" },
    { title: "sofi song", artist: "Sufi Track 5", path: "song5.mp3" }
];

let songIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

loadSong(songList[songIndex]);

function loadSong(song) {
    if (trackTitle) trackTitle.innerText = song.title;
    if (trackArtist) trackArtist.innerText = song.artist;
    currentAudio.src = song.path;
    currentAudio.load(); 
}

function togglePlay() {
    if (currentAudio.paused) {
        currentAudio.play()
            .then(() => {
                isPlaying = true;
                if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            })
            .catch(err => console.log("Playback error:", err));
    } else {
        currentAudio.pause();
        isPlaying = false;
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);

function nextSong() {
    if (isShuffle) {
        songIndex = Math.floor(Math.random() * songList.length);
    } else {
        songIndex = (songIndex + 1) % songList.length;
    }
    loadSong(songList[songIndex]);
    if (isPlaying) currentAudio.play().catch(e => console.log(e));
}
if (nextBtn) nextBtn.addEventListener('click', nextSong);

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        songIndex = (songIndex - 1 + songList.length) % songList.length;
        loadSong(songList[songIndex]);
        if (isPlaying) currentAudio.play().catch(e => console.log(e));
    });
}

// ⚡ FIX: 4 Buttons Ka Click Logic Bina HTML Badle
if (minimizeBtn) minimizeBtn.addEventListener('click', () => alert("Minimize functionality active!"));
if (menuBtn) menuBtn.addEventListener('click', () => alert("Playlist menu opened!"));

if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => { 
        isShuffle = !isShuffle; 
        shuffleBtn.style.color = isShuffle ? '#00e1ff' : '#ffffff'; 
    });
}
if (repeatBtn) {
    repeatBtn.addEventListener('click', () => { 
        isRepeat = !isRepeat; 
        repeatBtn.style.color = isRepeat ? '#00e1ff' : '#ffffff'; 
    });
}

// ⚡ SLIDER FIX: Khenchnay se gaana aage peeshe karne ka logic
currentAudio.addEventListener('timeupdate', () => {
    if (currentAudio.duration && progressBar) {
        progressBar.value = (currentAudio.currentTime / currentAudio.duration) * 100;
        
        let cMins = Math.floor(currentAudio.currentTime / 60);
        let cSecs = Math.floor(currentAudio.currentTime % 60);
        if (currentTimeDisplay) currentTimeDisplay.innerText = `${cMins}:${cSecs < 10 ? '0' : ''}${cSecs}`;

        let tMins = Math.floor(currentAudio.duration / 60);
        let tSecs = Math.floor(currentAudio.duration % 60);
        if (totalDurationDisplay) totalDurationDisplay.innerText = `${tMins}:${tSecs < 10 ? '0' : ''}${tSecs}`;
    }
});

if (progressBar) {
    progressBar.addEventListener('change', () => {
        if (currentAudio.duration) {
            currentAudio.currentTime = (progressBar.value / 100) * currentAudio.duration;
        }
    });
}

currentAudio.addEventListener('ended', () => {
    if (isRepeat) {
        currentAudio.currentTime = 0;
        currentAudio.play().catch(e => console.log(e));
    } else {
        nextSong();
    }
});