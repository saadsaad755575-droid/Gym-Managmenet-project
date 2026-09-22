/*=======================
MEMBER NAVBAR JS
=======================*/

function initializeMemberNavbar(){
    const menuButton = 
    document.querySelector(".member-menu-btn");
    const memberSidebar=
    document.querySelector(".member-sidebar");
    const notificationButton =
    document.querySelector(".member-profile");
    /*===================================
    MOBILE MENU
    ===========================*/
    if (menuButton && memberSidebar){
        menuButton.addEventListener("click",()=>{
            memberSidebar.classList.toggle("show");
        });
    }
    /*=======================================
    CLOSE SIDEBAR ON OUTSIDE CLICK
    ===================================*/
    document.addEventListener("click", (event) =>{
        if(!memberSidebar || !menuButton)
            return;
        const clickedInsideSidebar=
        memberSidebar.contains(event.target);
        const clickedMenu=
        menuButton.contains(event.target);
        if(!clickedInsideSidebar && !clickedMenu)
        {
            memberSidebar.classList.remove("show");

        }
    });
    /*======================
    NOTIFICTION
    ============================*/
    if(notificationButton)
    {
        notificationButton.addEventListener.addEventListener("click",()=>{
            console.log("Member notifications opened");
        });
    }
    /*=======================
    Profile
    ========================*/
    if(profileButton){
        profileButton.addEventListener("click",()=>{
            console.log("Member profile clicked");
        });
    }
}