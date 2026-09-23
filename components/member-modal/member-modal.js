/*=====================
MEMBER MODAL JS
======================*/

/*=========================
GET MODAL ELEMENTS
==========================*/
const memberModal =
document.getElementById("memberModal");
const memberModalClose =
document.getElementById("memberModalClose");
const memberModalCancel =
document.getElementById("memberModalCancel");
const memberModalSave =
document.getElementById("memberModalSave");

/*=======================
OPEN MEMBER MODAL
===========================*/
function
openMemberModal(loadMemberCardData={}){

    /*  MEMBER NAME*/
    const modalMemberName =
    document.getElementById(
        "modalMemberName"
    );
    if(modalMemberName){
        modalMemberName.textContent=
        loadMemberCardData.name || "Member Name";
    }

    /* MEMBER ID */
     const modalMemberId =
     document.getElementById("modalMemberId");
     if(modalMemberId){
        modalMemberId.textContent =
        loadMemberCardData.id || "Member ID";
     }
     /* TRAINER */
     const modalTrainerName =
     document.getElementById(
        "modalTrainerName"
     );
     if(modalTrainerName){
        modalTrainerName.textContent =
        loadMemberCardData.trainer || "Not Assigned";
     }
     /* FITNESS GOAL */
     const modalFitnessGoal =
     document.getElementById(
        "modalFitnessGoal");
        if(modalFitnessGoal){
            modalFitnessGoal.textContent=
            loadMemberCardData.goal || "Not Set";

        }
        /* MEMBERSHIP */
        const modalMembership=
        document.getElementById("modalMembership");
        if (modalMembership){
            modalMembership.textContent = 
            memberData.membership || "Not Availble";
        }
        /* ATTENDANCE */
        const modalAttendance =
        document.getElementById(
            "modalAttendance"
        );
        if(modalAttendance){
            modalAttendance.textContent=
            memberData.attendance ? memberData.attendance + "%" : "0%";
        }
        /* SHOW MODAL */

        if(memberModal){
            memberModal.classList.add("show");
        } 
}
/*=======================
CLOSE MEMBER MODAL
===========================*/
function closeMemberModal(){
    if (memberModal){
        memberModal.classList.remove("show");
    }
}

/*============================
CLOSE BUTTON
================================*/
if (memberModalClose){
    memberModalClose.addEventListener(
        "click",function(){
            closeMemberModal();
        }
    );
}
/*======================================
CANCEL CLOSE BUTTON
======================================*/
if(memberModalCancel)
{
    memberModalCancel.addEventListener(
        "click",function(){
            closeMemberModal();
        }
    );
}
/*===========================
DONE BUTTON 
==============================*/
if (memberModalSave){
    memberModalSave.addEventListener("click",function(){
        closeMemberModal();
    }
);
}
/*=================================
CLOSE ON OVERLAY CLICK
=======================================*/
if(memberModal){
    memberModal.addEventListener(
        "click",function(event){
            if(event.target === memberModal){
                closeMemberModal();
            }
        }
    );
}