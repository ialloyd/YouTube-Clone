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

const apiKey = "AIzaSyAwNbvqR87lDcFomqHiTxomOqbsJD4meJo";
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
    const channelProfilePic = await getChannelProfilePic(snippet.channelId);
    const videoDetails = await getVideoDetails(video.id.videoId);
    const formattedViewCount = formatViewCount(
      videoDetails.statistics.viewCount
    );
    const videoElement = document.createElement("div");
    videoElement.className = "video";
    videoElement.innerHTML = `<img src="${snippet.thumbnails.high.url}">
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
            <span>${timeSincePosted(
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

async function getChannelProfilePic(channelId) {
  let url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&fields=items%2Fsnippet%2Fthumbnails&key=${apiKey}`;
  const response = await fetch(url, { method: "GET" });
  const result = await response.json();
  //console.log(result.items[0].snippet.thumbnails.default.url);
  return result.items[0].snippet.thumbnails.default.url;
}

async function getVideoDetails(videoId) {
  let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;
  const response = await fetch(url, { method: "GET" });
  const result = await response.json();
  //console.log(result);
  return result.items[0];
}

function timeSincePosted(dateString) {
  console.log(dateString);
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const months = Math.round(days / 30);
  const years = Math.round(days / 365);

  if (seconds < 60) {
    return `${seconds} seconds`;
  } else if (minutes < 60) {
    return `${minutes} minutes`;
  } else if (hours < 24) {
    return `${hours} hours`;
  } else if (days < 7) {
    return `${days} days`;
  } else if (weeks < 4) {
    return `${weeks} weeks`;
  } else if (months < 12) {
    return `${months} months`;
  } else {
    return `${years} years`;
  }
}

function formatViewCount(viewCount) {
  if (viewCount >= 1e6) {
    return (viewCount / 1e6).toFixed(1) + "M";
  } else if (viewCount >= 1e3) {
    return (viewCount / 1e3).toFixed(1) + "K";
  } else {
    return viewCount.toString();
  }
}

function navigateToVideo(videoId) {
  document.cookie = `id=${videoId}; path=video.html`;
  window.location.href = "video.html";
}