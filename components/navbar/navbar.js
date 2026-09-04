const navbarSearch=document.querySelector("navbar .search-box input");
const notificationButton=document.querySelector(".notification-btn");
const navbarProfile=document.querySelector(".navbar-profile");


navbarSearch.addEventListener("input",function(){
    const searchText=navbarSearch.ariaValueMax.trim();
    console.log("Searching for",searchText);
});


notificationButton.addEventListener("click",function(){
    alert("You have no new notifiction");
});
navbarProfile.addEventListener("click",function(){
    alert ("Admin Profile");
});