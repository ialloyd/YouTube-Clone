window.addEventListener('load', () => {
  getSearchResults('');
});

let prevButton = document.querySelector("#prev-button");
let nextButton = document.querySelector("#next-button");
let content = document.querySelector(".scroll-container");

prevButton.addEventListener("click", () => {
  content.scrollLeft -= 100;
});

nextButton.addEventListener("click", () => {
  content.scrollLeft += 100;
});

const apiKey = "AIzaSyDvo2p4xMEI3GC-PWH02_0OAIN1h88k4rE";
const baseUrl = `https://www.googleapis.com/youtube/v3`;

const searchButton = document.getElementById("search");
const searchInput = document.getElementById("search-input");
const container = document.getElementById("video-grid");

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const searchString = searchInput.value;
    getSearchResults(searchString);
  }
});

searchButton.addEventListener("click", () => {
  let searchString = searchInput.value.trim();
  if (searchString === "") {
    return;
  }
  getSearchResults(searchString);
});

async function getSearchResults(searchString) {
  let url = `${baseUrl}/search?key=${apiKey}&q=${searchString}&part=snippet&type=video&maxResults=20`;
  const response = await fetch(url, { method: "GET" });
  const result = await response.json();
  //console.log(result);
  container.innerHTML = '';
  addDataOntoUI(result.items);
}

async function addDataOntoUI(videosList) {
  for (const video of videosList) {
    const { snippet } = video;
    const channelProfilePic = await getChannelDetails(snippet.channelId);
    const videoDetails = await getVideoDetails(video.id.videoId);
    const formattedViewCount = formatCount(
      videoDetails.statistics.viewCount
    );
    const videoElement = document.createElement("div");
    videoElement.className = "video";
    videoElement.innerHTML = `<img src="${snippet.thumbnails.medium.url}">
        <div class='video-top'>
          <img src="${channelProfilePic}">
          <p>${snippet.title}</p>
        </div>
        <div class='video-bottom'>
        <div class="channel">
          <p>${snippet.channelTitle}</p>
          <span class="material-symbols-outlined">
            check_circle
          </span>
        </div>
          <div class="text-with-dot">
            <span>${formattedViewCount} views</span>
            <span>•</span> 
            <span>${formatTime(
      videoDetails.snippet.publishedAt
    )} ago</span>
          </div>
        </div>`;

    videoElement.addEventListener("click", () => {
      navigateToVideo(video.id.videoId);
    });
    container.appendChild(videoElement);
  }
}

async function getChannelDetails(channelId) {

  let url = `${baseUrl}/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
  const response = await fetch(url, { method: "GET" });
  const result = await response.json();
  console.log(result);
  return result.items[0].snippet.thumbnails.high.url;
}

async function getVideoDetails(videoId) {

  let url = `${baseUrl}/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;
  const response = await fetch(url, { method: "GET" });
  const result = await response.json();
  console.log(result);
  return result.items[0];
}

function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30.44);
  const years = Math.round(days / 365.25);

  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  } else if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (days < 30.44) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  } else if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
}

function formatCount(count) {
  if (count >= 1000000000) {
    return (count / 1000000000).toFixed(1) + 'B';
  } else if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  else if (!count) {
    return 0;
  }
  return count;
}

async function navigateToVideo(videoId) {

  document.cookie = `id=${videoId}; path=video.html`;
  window.location.href = "video.html";
}