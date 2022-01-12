removeCookie("_gid");
removeCookie("sessionid");
removeCookie("_ga");
removeCookie("csrftoken");

/**
 * Global variables
 */
let totalQuestions = localStorage.getItem("totalQuestions") != null ? localStorage.getItem("totalQuestions") : 0;
let score = localStorage.getItem("study_score") != null ? localStorage.getItem("study_score") : 0;
let minScore = localStorage.getItem("minScore") != null ? localStorage.getItem("minScore") : localStorage.setItem("minScore", 50);

/**
 * html elements for score board
 */
let inputMinScore = 'Min % to pass:<p><input type="number" id="scoreToPass" min="0" max="100" placeholder="% to pass" value="' + minScore + '"/> %';
let status = '<div>Status: <span id="status" class="pass">Pass</span></div>';
let resetButton = "<button id='resetScore' class='btn btn-primary'>Reset</button>";
let htmlScore = "<span id='score'>" + score + "</span>";
let htmlTotalQuestions = "<span id='totalQuestions'>" + totalQuestions + "</span>";
let html = "<div class='study_score' ><a style='margin-left: 10px;'>Score:</a>"
         + htmlScore + " / " + htmlTotalQuestions + "<p>" + inputMinScore + status + "<p> " + resetButton + "</div>";

//check if score its already on screen, if not then place it
$("#score").length === 0
    ? $("body").prepend(html)
    : null;

//everytime user clicks on a answer
$(".multi-choice-item").click(function(e) {
    e.preventDefault();
    // Sets Score
    if(localStorage.getItem("study_score") === null) {
        localStorage.setItem("study_score", score);
    } else {
        score = localStorage.getItem("study_score");
    }

    //Sets totalQuestions
    if(localStorage.getItem("totalQuestions") === null) {
        localStorage.setItem("totalQuestions", totalQuestions);
    } else {
        totalQuestions = localStorage.getItem("totalQuestions");
    }

    // if question wasn't answered yet
    let notAnswered = $(this).parent().find(".clicked").length === 0 ? true : false;
    if(notAnswered) {
        totalQuestions = Number(totalQuestions) + Number(1);
        localStorage.setItem("totalQuestions", totalQuestions);
        $("#totalQuestions").html(totalQuestions);
    }

    // User chosed correct answer
    if($(this).hasClass("correct-hidden")) {
        // if user havent answered this question before
        $(this).addClass("clicked");
        if(notAnswered) {
            $(this).css("border", "2px solid GREEN");
            score = Number(score) + Number(1)
        }
        
        $(this).css("border", "2px solid GREEN");
        $(this).css("border-radius", "10px");
        localStorage.setItem("study_score", score);
        $("#score").html(score);
    } else { //User choser wrong answer
        $(this).addClass("clicked");
        $(this).css("border", "2px solid RED");
        $(this).css("border-radius", "10px");        
    }
    calculateScore();
    $($(this)).parent().parent().parent().find(".reveal-solution").click();

});


// Resets user score
$("#resetScore").click(function(e) {
    e.preventDefault();
    localStorage.setItem("study_score", 0);
    localStorage.setItem("totalQuestions", 0);
    score, totalQuestions = 0;
    $("#score").html(0);
    $("#totalQuestions").html(0);
    $(".multi-choice-item").css("border", "none");
    $(".clicked").removeClass("clicked");
});

// Remove cookies
function removeCookie(sKey, sPath, sDomain) {
    document.cookie = encodeURIComponent(sKey) + 
                  "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + 
                  (sDomain ? "; domain=" + sDomain : "") + 
                  (sPath ? "; path=" + sPath : "");
}

//Calculates user score
function calculateScore() {
    let scoreToPass = Number($("#scoreToPass").val());
    let score = Number($("#score").html());
    let totalQuestions = Number($("#totalQuestions").html());

    if(score >= (scoreToPass / 100)* totalQuestions) {
        $("#status").removeClass("fail");
        $("#status").addClass("pass");
        $("#status").html("Pass");
    } else {
        $("#status").addClass("fail");
        $("#status").removeClass("pass");
        $("#status").html("Fail");        
    }
}

//Update score % needed to pass
$("#scoreToPass").on('change', function(e) {
    localStorage.setItem("minScore", $(this).val());    
});