const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const trackArt = document.getElementById('track-art');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalDurationDisplay = document.getElementById('total-duration');

// Main Audio Object jisme gane chalenge
let currentAudio = new Audio();

// Aapke Chune Hue 10 Superhit Songs Ki List
const songList = [
    { title: "Bhula Dena Mujhe", artist: "Mustafa Zahid (Aashiqui 2)", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500", path: "song1.mp3" },
    { title: "Majboor (Aankhon Aankhon)", artist: "Sheheryar Rehan & Zoha Waseem", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=500", path: "song2.mp3" },
    { title: "Tu Hi Das De", artist: "Simiran Kaur Dhadli", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=500", path: "song3.mp3" },
    { title: "Mi Amor", artist: "Sharn (Trending Beats)", image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=500", path: "song4.mp3" },
    { title: "Kahani Suno 2.0", artist: "Kaifi Khalil", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=500", path: "song5.mp3" },
    { title: "Pasoori", artist: "Ali Sethi & Shae Gill", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=500", path: "song6.mp3" },
    { title: "Tum Tum", artist: "Asim Azhar (Acoustic)", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?q=80&w=500", path: "song7.mp3" },
    { title: "Baarishein", artist: "Anuv Jain", image: "https://images.unsplash.com/photo-1437419764061-2473afe69fc2?q=80&w=500", path: "song8.mp3" },
    { title: "Excuses", artist: "AP Dhillon", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=500", path: "song9.mp3" },
    { title: "Samjho Na", artist: "Aditya Rikhari", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=500", path: "song10.mp3" }
];

let songIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// Pehle gane ko tayar (load) karo
loadSong(songList[songIndex]);

function loadSong(song) {
    trackTitle.innerText = song.title;
    trackArtist.innerText = song.artist;
    trackArt.src = song.image;
    currentAudio.src = song.path;
    currentAudio.load(); // Gana sahi se backend par load karne ke liye
}

// Play & Pause karne ka dhabba logic
function togglePlay() {
    if (currentAudio.paused) {
        currentAudio.play().then(() => {
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(err => {
            alert("Jaani pehle page par kahin bhi ek click karo, phir Play dabao!");
            console.log("Autoplay blocked:", err);
        });
    } else {
        currentAudio.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

playPauseBtn.addEventListener('click', togglePlay);

// Agla gana chalane ke liye
function nextSong() {
    songIndex = isShuffle ? Math.floor(Math.random() * songList.length) : (songIndex + 1) % songList.length;
    loadSong(songList[songIndex]);
    if (isPlaying) currentAudio.play().catch(e => console.log(e));
}
nextBtn.addEventListener('click', nextSong);

// Pichla gana chalane ke liye
function prevSong() {
    songIndex = (songIndex - 1 + songList.length) % songList.length;
    loadSong(songList[songIndex]);
    if (isPlaying) currentAudio.play().catch(e => console.log(e));
}
prevBtn.addEventListener('click', prevSong);

// Progress bar aur timing chalane ke liye
currentAudio.addEventListener('timeupdate', () => {
    if (currentAudio.duration) {
        progressBar.value = (currentAudio.currentTime / currentAudio.duration) * 100;
        
        let cMins = Math.floor(currentAudio.currentTime / 60);
        let cSecs = Math.floor(currentAudio.currentTime % 60);
        currentTimeDisplay.innerText = `${cMins}:${cSecs < 10 ? '0' : ''}${cSecs}`;

        let tMins = Math.floor(currentAudio.duration / 60);
        let tSecs = Math.floor(currentAudio.duration % 60);
        totalDurationDisplay.innerText = `${tMins}:${tSecs < 10 ? '0' : ''}${tSecs}`;
    }
});

// Slider manually check karne par gana jump ho
progressBar.addEventListener('input', () => {
    if (currentAudio.duration) {
        currentAudio.currentTime = (progressBar.value / 100) * currentAudio.duration;
    }
});

// Gana end hone par automatic handle karein
currentAudio.addEventListener('ended', () => {
    isRepeat ? (currentAudio.currentTime = 0, currentAudio.play()) : nextSong();
});

// Shuffle aur Repeat toggles
shuffleBtn.addEventListener('click', () => { isShuffle = !isShuffle; shuffleBtn.classList.toggle('active', isShuffle); });
repeatBtn.addEventListener('click', () => { isRepeat = !isRepeat; repeatBtn.classList.toggle('active', isRepeat); });