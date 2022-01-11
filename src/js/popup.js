// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['jquery3.6.js', 'exametopics.js'],
    });
  });
  
  // The body of this function will be executed as a content script inside the
  // current page
  function setPageBackgroundColor() {
    console.log("teste");
    chrome.scripting.executeScript({
      function: init,
    });
    // chrome.storage.sync.get("color", ({ color }) => {
    //   //document.body.style.backgroundColor = color;
    // });
  }


  function init() {
    $("#score").length === 0
      ? $("body").prepend("<div class='study_score' style='position:fixed; border-radius:10px; z-index: 99; left: 10px;top:200px; background-color:#CCC;'><a style='margin-left: 10px;'>Score:</a><span id='score'>0</span> <p> <button id='resetScore' style='margin-left: 10px; margin-right: 10px' class='btn btn-primary'>Reset</button></div>")
      : null;

  $(".multi-choice-item").click(function(e) {
    e.preventDefault();
    let score = 0;

    if(localStorage.getItem("study_score") === null) {
      localStorage.setItem("study_score", score);
    } else {
      score = localStorage.getItem("study_score");
    }

    if($(this).hasClass("correct-hidden")) {
      $(this).css("border", "2px solid GREEN");
      $(this).css("border-radius", "10px");
      score = Number(score) + Number(1);
      localStorage.setItem("study_score", score);
      $("#score").html(score);
    } else {
      $(this).css("border", "2px solid RED");
      $(this).css("border-radius", "10px");
    }

    $("#resetScore").click(function(e) {
      e.preventDefault();
      localStorage.removeItem("study_score");
    });
  });
}
