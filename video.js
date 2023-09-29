let prevButton = document.querySelector("#prev-button");
let nextButton = document.querySelector("#next-button");
let content = document.querySelector(".scroll-container");
let leftSection = document.getElementsByClassName('left')[0];
const apiKey = "AIzaSyAwNbvqR87lDcFomqHiTxomOqbsJD4meJo";
const baseUrl = `https://www.googleapis.com/youtube/v3`;

prevButton.addEventListener("click", () => {
  content.scrollLeft -= 100;
});

nextButton.addEventListener("click", () => {
  content.scrollLeft += 100;
});

window.addEventListener("load", () => {
  let videoId = document.cookie.split("=")[1];
  if (YT) {
    new YT.Player("video-placeholder", {
      height: "350",
      width: "700",
      videoId,
    });
  }
  addDatatoUI(videoId);
});

async function addDatatoUI(videoId) {
  console.log(videoId)
  const videoDetails = await getVideoDetails(videoId);
  // console.log(videoDetails)

  const channelDetails = await getChannelDetails(videoDetails.items[0].snippet.channelId);
  // console.log(channelDetails)
  const comments = await loadComments(videoId);
  console.log(comments)
  leftSection.innerHTML += ` <h3>${videoDetails.items[0].snippet.title}</h3>
  <div class="channel">
      <div><img
              src=${channelDetails.items[0].snippet.thumbnails.default.url}
              alt="">
          <div>
              <h4>${channelDetails.items[0].snippet.title}</h4>
              <p>${formatCount(channelDetails.items[0].statistics.subscriberCount)} subscribers</p>
          </div>
      </div>
      <div id="subscribe">Subscribe</div>
      <div class="like-dislike">
          <div class="like"><span class="material-symbols-outlined">
                  thumb_up
              </span>
              <span>${formatCount(videoDetails.items[0].statistics.likeCount)}</span>
          </div>
          <div>
              <span class="material-symbols-outlined">
                  thumb_down
              </span>
          </div>
      </div>
      <div class="share">
          <span class="material-symbols-outlined">
              forward
          </span>
          <span>Share</span>
      </div>
      <div class="more">
          <span class="material-symbols-outlined">
              more_horiz
          </span>
      </div>
  </div>
  <div class="desc">
      ${formatCount(videoDetails.items[0].statistics.viewCount)} views ${formatTime(videoDetails.items[0].snippet.publishedAt)} ago 
      ${videoDetails.items[0].snippet.description}
  </div>
  <div class="comments-header">
      <p>${formatCount(videoDetails.items[0].statistics.commentCount)} Comments</p>
      <div><span class="material-symbols-outlined">
              sort
          </span>
          <p>Sort by</p>
      </div>
  </div>

  <div class="add-comment">
      <img src="data:image/jpeg;base64,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"
          alt="">
      <p>Add a comment ...</p>
  </div>`

  addComments(comments);

}

function addComments(comments) {

  const container = document.createElement('div');
  container.className = 'comments'

  for (let comment of comments) {

    const cmnt = document.createElement('div');
    cmnt.id = 'comment';

    cmnt.innerHTML = `<img src='${comment.snippet.topLevelComment.snippet.authorProfileImageUrl}'
                        alt="">
                    <div>
                        <p id="username">@${comment.snippet.topLevelComment.snippet.authorDisplayName} <span>${formatTime(comment.snippet.topLevelComment.snippet.publishedAt)} ago</span></p>
                        <p>${comment.snippet.topLevelComment.snippet.textDisplay}</p>

                        <div class="comment-like-dislike">
                            <span class="material-symbols-outlined">
                                thumb_up
                            </span>
                            <span>${formatCount(comment.snippet.topLevelComment.snippet.likeCount)}</span>
                            <span class="material-symbols-outlined">
                                thumb_down
                            </span>
                            <span>Reply</span>
                        </div>
                    </div>`

    container.appendChild(cmnt);

  }

  leftSection.appendChild(container);

}

async function getChannelDetails(channelId) {

  let url = `${baseUrl}/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
  const response = await fetch(url, { method: "GET" });
  const result = await response.json();
  // console.log(result);
  return result;
}

async function getVideoDetails(videoId) {

  let url = `${baseUrl}/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;
  const response = await fetch(url, { method: "GET" });
  const result = await response.json();
  // console.log(result);
  return result;
}

async function loadComments(videoId) {
  let url = `${baseUrl}/commentThreads?part=snippet&videoId=${videoId}&maxResults=10&key=${apiKey}`;
  const response = await fetch(url, { method: "GET" });
  const result = await response.json();
  console.log(result.items);
  return result.items;
}


function formatCount(count) {
  if (count >= 1000000000) {
    return (count / 1000000000).toFixed(1) + 'B';
  } else if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count;
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
