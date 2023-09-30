let prevButton = document.querySelector("#prev-button");
let nextButton = document.querySelector("#next-button");
let content = document.querySelector(".scroll-container");
let leftSection = document.getElementsByClassName('left')[0];
let rightSection = document.getElementsByClassName('right')[0];
const apiKey = "AIzaSyDvo2p4xMEI3GC-PWH02_0OAIN1h88k4rE";
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
      playerVars: {
        autoplay: 1,
        modestbranding: 1,
      }
    });
  }
  addDatatoUI(videoId);
});

async function addDatatoUI(videoId) {
  // console.log(videoId)
  const videoDetails = await getVideoDetails(videoId);
  // // console.log(videoDetails)
  const channelDetails = await getChannelDetails(videoDetails.items[0].snippet.channelId);
  // console.log(channelDetails)
  searchForRelatedContent(channelDetails.items[0].snippet.title);

  const comments = await loadComments(videoId);
  // console.log(comments)
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
      <b>${formatCount(videoDetails.items[0].statistics.viewCount)} views</b> <b>${formatTime(videoDetails.items[0].snippet.publishedAt)} ago</b> 
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
      <img src="resources/download (1).jpg"
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

    const image = document.createElement('img');
    image.src = `${comment.snippet.topLevelComment.snippet.authorProfileImageUrl}`;

    const inner = document.createElement('div');

    inner.innerHTML = `<p id="username">@${comment.snippet.topLevelComment.snippet.authorDisplayName} <span>${formatTime(comment.snippet.topLevelComment.snippet.publishedAt)} ago</span></p>
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
                        </div>`

    if (comment.snippet.totalReplyCount) {

      addCommentReplies(inner, comment.snippet.topLevelComment.id)

    }

    container.appendChild(cmnt);
    cmnt.appendChild(image);
    cmnt.appendChild(inner);

  }

  leftSection.appendChild(container);

}

async function searchForRelatedContent(searchString) {

  let url = `${baseUrl}/search?key=${apiKey}&q=${searchString}&part=snippet&type=video&maxResults=20`;
  const response = await fetch(url, { method: "GET" });
  const result = await response.json();
  displayVideos(result);

}

async function displayVideos(result) {
  // console.log(result.items)
  for (let item of result.items) {
    const container = document.createElement('div')
    container.className = 'video-container';
    const videoDetails = await getVideoDetails(item.id.videoId);
    console.log(videoDetails);
    container.innerHTML = `<img src="${item.snippet.thumbnails.medium.url}"
  alt="">
<div class="video-desc">
  <h5>${item.snippet.title}</h5>
  <div>
      <p>${item.snippet.channelTitle}</p>
      <span class="material-symbols-outlined">
          check_circle
      </span>
  </div>
  <div class="video-stat">
      <p>${formatCount(videoDetails.items[0].statistics.viewCount)} views </p>
      <span>•</span>
      <p>${formatTime(videoDetails.items[0].snippet.publishedAt)} ago</p>
  </div>
</div>`

    rightSection.appendChild(container);

  }

}

async function addCommentReplies(inner, cmntId) {

  let commentReplies = await loadCommentReplies(cmntId);

  const btn = document.createElement('button');
  btn.textContent = 'Replies';
  btn.className = 'replies-btn';
  btn.addEventListener('click', () => {

    if (document.getElementsByClassName('comment-replies')[0].style.display === 'none') {

      document.getElementsByClassName('comment-replies')[0].style.display = ''

    }
    else {

      document.getElementsByClassName('comment-replies')[0].style.display = 'none'

    }

  })

  const replies = document.createElement('div');
  replies.className = 'comment-replies';
  replies.style.display = 'none';
  commentReplies.items.forEach(reply => {

    const container = document.createElement('div');
    container.id = 'comment';

    container.innerHTML = `<img src='${reply.snippet.authorProfileImageUrl}'
    alt="">
<div>
    <p id="username">@${reply.snippet.authorDisplayName} <span>${formatTime(reply.snippet.publishedAt)} ago</span></p>
    <p>${reply.snippet.textDisplay}</p>

    <div class="comment-like-dislike">
        <span class="material-symbols-outlined">
            thumb_up
        </span>
        <span>${formatCount(reply.snippet.likeCount)}</span>
        <span class="material-symbols-outlined">
            thumb_down
        </span>
        <span>Reply</span>
    </div>
</div>`

    replies.appendChild(container);

  })

  inner.appendChild(btn);
  inner.appendChild(replies);

}

async function loadCommentReplies(cmntId) {

  let url = `${baseUrl}/comments?part=snippet&parentId=${cmntId}&maxResults=10&key=${apiKey}`;
  const response = await fetch(url, { method: "GET" });
  const result = await response.json();
  // console.log(result);
  return result;

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
  // console.log(result.items);
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
  else if (!count) {
    return 0;
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