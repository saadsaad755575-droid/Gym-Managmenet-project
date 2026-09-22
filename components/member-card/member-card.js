/*===========================
MEMBER CARD JS
==============================*/


/*====================================
UPDATE MEMBERSHIP STATUS
====================================*/
function updateMembershipStatus(
    status, type
){
    const statusElement =
    document.getElementById(
        "membershipStatus"
    );
    const typeElement = 
    document.getElementById(
        "membershipType"
    );
    if (statusElement){
        statusElement.textContent=status;

    }
    if(typeElement){
        typeElement.typeElement.textContent=type;
    }
}
/*===========================
UPDATE MEMBERSHIP EXPIREY
===========================*/
function
updateMembershipExpiry(
    days
){
    const expiryElement=
    document.getElementById("membershipExpiry");
    if(expiryElement){
        expiryElement.textContent=
        days +"Days";
    }

}
/*===========================
UPDATE TRAINER
==============================*/
function
updateAssignedTrainer(
    trainerName, specialization
)
{
    const trainerElement =
    document.getElementById(
        "assignedTrainer"
    );
    const specializationElement =
    document.getElementById("trainerSpecilization");
    if(trainerElement){
        trainerElement.textContent=trainerName;
    }
    if(specializationElement){
        specializationElement.textContent=specialization;
    }
}
/*============================
UPDATE ATTENDANCE
==============================*/
function updateAttendance(
    percentage
)
{
    const attendanceElement =
    document.getElementById("attendancePercentage");
    if(attendanceElement){
        attendanceElement.textContent=
        percentage + "%";
    }
}
/*================================
UPTADTE FEES
===================================*/
function updateFees(
    status, amount
)
{
    const feesSatusElement =
    document.getElementById("feeStatus");
    const feeAmountElement =
    document.getElementById("feeAmonut");
    if(feesSatusElement){
        feesSatusElement.textContent= status;
    }
    if(feeAmountElement){
        feeAmountElement.textContent=status;
    }
    if(feeAmountElement){
        feeAmountElement.textContent=
        "Rs." +amount;
    }
}
/*=========================
UPDATE PROGRESS
==========================*/
function updateProgress(
    percentage
){
    const progressElement=
    document.getElementById(
        "progressStatus"
    );
    if(progressElement){
        progressElement.textContent=percentage+"%";
    }
}
/*==========================
DEFAULT MEMBER CARD DATA
============================*/
function loadMemberCardData(){
    updateMembershipStatus(
        "Active","premium Membership"
    );
    updateMembershipExpiry(30);
    updateAssignedTrainer(
        "Ahmed Khan",
        "Fitness Trainer"
    );
    updateAttendance( 85);
    updateFees(
        "Paid",
    "5,000"
);
updateProgress(
    72
);
}
/*===============================
INITIALIZE MEMBER CARDS
================================*/
loadMemberCardData();