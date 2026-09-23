//=====================
// MEMBER SIDEBAR JS
//=====================


//========================
// LOAD MEMBER NAME
//==========================
function loadMemberSidebarProfile()
{
    const memberNameElement=
    document.getElementById("sidebarMemberName");
    if(!memberNameElement){
        return;
    }
    // Get logged-in member
    const loggedInMember = JSON.parse(
        localStorage.getItem("loggedInMember")
    );
    if(loggedInMember && loggedInMember.name)
    {
        memberNameElement.testContent=
        loggedInMember.name;
    }
}
//==========================
// ACTIVE MENU
//===========================
function setActiveMemberMenu()
{
    const menuItem=
    document.querySelectorAll(".member-menu-item");
    const currentPage = 
    window.location.pathname.split("/")
    .pop();
    menuItem.forEach(function(item){
        const link=item.getAttribute("href");
        if(!link || link === "#"){
            return;
        }
        const linkPage=link.split("/").pop();
        item.classList.remove("active");
        if (linkPage === currentPage || (
            currentPage==="" && linkPage === "member.html"
        )
    ){
        item.classList.add("active");
    }
    });
}
//===================================
// Member Logout
//=================================
function setMemberLogout(){
    const logoutButton =
    document.getElementById("member Logout");
    if(!logoutButton){
        return;
    }
    logoutButton.addEventListener("click"
        ,function(event){
            event.preventDefault();
            const confirmLogout = confirm("Are you sure you went to logout ");
            if(!confirmLogout)
                {
                    return;
                }
// Remove member Login data
         localStorage.removeItem("loggedInMember");


// Redirect to login
     window.location.href="../../Login/login.html";
            }
            );
        }
    
//========================
// INITSLIZE MEMBER SIDEBAR
//=============================
function initializeMemberSidebar(){
    loadMemberSidebarProfile();
    setActiveMemberMenu();
    setMemberLogout();

}
//================================
// RUN SIDEBAR JS
//=============================
initializeMemberSidebar();