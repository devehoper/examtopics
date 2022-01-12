let txtScore = localStorage.getItem("study_score") != null ? localStorage.getItem("study_score") : 0;
$("#score").length === 0
? $("body").prepend("<div class='study_score' style='position:fixed; border-radius:10px; z-index: 99; left: 10px;top:200px; background-color:#CCC;'><a style='margin-left: 10px;'>Score:</a><span id='score'>" + txtScore + "</span> <p> <button id='resetScore' style='margin-left: 10px; margin-right: 10px' class='btn btn-primary'>Reset</button></div>")
    : null;

$(".multi-choice-item").css("cursor", "pointer");

$(".multi-choice-item").click(function(e) {
    e.preventDefault();
    let score = 0;

        if(localStorage.getItem("study_score") === null) {
            localStorage.setItem("study_score", score);
        } else {
            score = localStorage.getItem("study_score");
        }

        if($(this).hasClass("correct-hidden")) {
            if($(this).parent().find(".clicked").length == 0
            ) {
                $(this).css("border", "2px solid GREEN");
                $(this).css("border-radius", "10px");
                score = Number(score) + Number(1)
                $(this).addClass("clicked");
            }
            localStorage.setItem("study_score", score);
            $("#score").html(score);
        } else {
            $(this).css("border", "2px solid RED");
            $(this).css("border-radius", "10px");
            $(this).addClass("clicked");
        }
});

$("#resetScore").click(function(e) {
    e.preventDefault();
    localStorage.setItem("study_score", 0);
    $("#score").html(0);
    $(".multi-choice-item").css("border", "none");
});