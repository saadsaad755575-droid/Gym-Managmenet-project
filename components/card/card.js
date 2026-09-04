const dashboardCards=document.querySelectorAll(".dashboard-card");

dashboardCards.forEach(function(card){
    card.addEventListener("click", function(){
        const cardTitle=card.querySelector(".card-content p").innerText;
        const cardValue=card.querySelector(".card-content h2").innerText;
        console.log("card:",cardTitle);
        console.log("Value",cardValue);
    });
});
dashboardCards.forEach(function(card){
    card.classList.add("card-active");

});
card.addEventListener("mouseleave",function(){
    card.classList.remove("card-active");
});