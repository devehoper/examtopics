//remove cookies to allow navigate further pages
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
let multiAnswerCounter = 0;

/**
 * html elements for score board
 */
let inputMinScore = 'Min % to pass: <input type="number" id="scoreToPass" min="0" max="100" placeholder="% to pass" value="' + minScore + '"/> %';
let manualQuestion = '<textarea id="manualQuestion" placeholder="NotePad for manual questions"></textarea>';
let manualScore = '<p><button class="btn btn-success" id="incrementScore">Increment Score</button> <p> <button class="btn btn-danger" id="decrementScore">Decrement Score</button>';
let status = '<div>Status: <span id="status" class="pass">Pass</span></div>';
let resetButton = "<button id='resetScore' class='btn btn-primary'>Reset</button>";
let htmlScore = "<span id='score'>" + score + "</span>";
let htmlTotalQuestions = "<span id='totalQuestions'>" + totalQuestions + "</span>";
let html = "<div class='study_score' ><a style='margin-left: 10px;'>Score:</a>"
         + htmlScore + " / " + htmlTotalQuestions + "<p>" + inputMinScore + "<p>" + manualQuestion + manualScore + status + "<p> " + resetButton + "</div>";

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
    if($(this).hasClass("correct-hidden") && $(this).parent().find(".incorrect-hidden").length == 0) {
        if(
            $(this).parent().find(".correct-hidden").length > 1
        ) {
            $(this).addClass("clicked");
            $(this).css("border", "2px solid GREEN");
            $(this).css("border-radius", "10px");
            if(
                !$(this).parent().hasClass("answered") 
                && $(this).parent().find(".clicked").length == $(this).parent().find(".correct-hidden").length
            ) {
                incrementScore();
                $(this).parent().addClass("answered");
            }
        } else {
            // if user havent answered this question before
            if(!$(this).hasClass("clicked")){
                $(this).css("border", "2px solid GREEN");
                $(this).css("border-radius", "10px");
                incrementScore();
            }
        }
        
        $(this).addClass("clicked");

    } else { //User choser wrong answer
        if($(this).hasClass("correct-hidden")) {
            $(this).css("border", "2px solid GREEN");
        } else {
            $(this).addClass("incorrect-hidden");
            $(this).css("border", "2px solid RED");
        }
        $(this).css("border-radius", "10px");
        $(this).addClass("clicked");
        
    }
    calculateScore();
});


// Resets user score
$("#resetScore").click(function(e) {
    e.preventDefault();
    localStorage.setItem("study_score", 0);
    localStorage.setItem("totalQuestions", 0);
    score = 0;
    totalQuestions = 0;
    $("#score").html(0);
    $("#totalQuestions").html(0);
    $(".multi-choice-item").css("border", "none");
    $(".clicked").removeClass("clicked");
    $(".incorrect-hidden").removeClass("incorrect-hidden");
    $(".answered").removeClass("answered");
    
});

$("#incrementScore").click(function(e) {
    e.preventDefault();
    incrementScore();
});

$("#decrementScore").click(function(e) {
    e.preventDefault();
    decrementScore();
});

function setScore() {
    $("#score").html(score);
    localStorage.setItem("study_score", score);
    calculateScore();
}
function incrementScore() {
    // cannot set condition if score < totalquestions because we have manual questions that cant be validated
    score++;
    totalQuestions++;
    $("#totalQuestions").html(totalQuestions);
    localStorage.setItem("totalQuestions", totalQuestions);
    localStorage.setItem("study_score", score);
    setScore();
}

function decrementScore() {
    if(score > 0) {
        score--;
        setScore();
    }
}

// Remove cookies
function removeCookie(sKey, sPath, sDomain) {
    document.cookie = encodeURIComponent(sKey) + 
                  "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + 
                  (sDomain ? "; domain=" + sDomain : "") + 
                  (sPath ? "; path=" + sPath : "");
}

//Calculates user score according to % to pass the exame
function calculateScore() {
    let scoreToPass = Number($("#scoreToPass").val());
    let score = Number($("#score").html());
    let totalQuestions = Number($("#totalQuestions").html());

    if(score >= (scoreToPass / 100) * totalQuestions) {
        $("#status").removeClass("fail");
        $("#status").addClass("pass");
        $("#status").html("Pass");
    } else {
        $("#status").addClass("fail");
        $("#status").removeClass("pass");
        $("#status").html("Fail");        
    }
}

// Update score % needed to pass
$("#scoreToPass").on('change', function(e) {
    localStorage.setItem("minScore", $(this).val());
    calculateScore();
});