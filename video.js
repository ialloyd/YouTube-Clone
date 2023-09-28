let prevButton = document.querySelector("#prev-button");
let nextButton = document.querySelector("#next-button");
let content = document.querySelector(".scroll-container");

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
  });
  