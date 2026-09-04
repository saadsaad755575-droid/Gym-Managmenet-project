const memberSearch = document.getElementById("memberSearch");
const membershipFilter=document.getElementById("membershipFilter");
const paymentFilter=document.getElementById("paymentFilter");
const memberTableBody=document.getElementById("memberTableBody");
const addmemberbtn = document.getElementById("addMemberBtn");

function filterMembers(){
    const searchText = memberSearch.value.toLowerCase().trim();
    const selectedMembership=membershipFilter.value;
    const selectedPayment=paymentFilter.value;
    const membershipElement = row.querySelector(".membership");
    let membershipStatus=membershipElement.innerText.toLowerCase().trim();


// Payment 
const paymentElement=row.querySelector("payment");
let paymentStatus="";
if (paymentElement){
    paymentStatus=paymentElement.innerText.toLowerCase().trim();
}

//  Search 
const matchesSeacrh=rowText.includes(searchText);
let matchesMembership=true;
if (selectedMembership==="active")
{
    matchesMembership=membershipElement.classList.contains("active");
}
else if (selectedMembership==="expired")
{
    matchesMembership=membershipElement.classList.contains("expired");

}
else if(selectedMembership==="pending")
{
    matchesMembership=membershipElement.classList.contains("pending");

}
//  payment Filter
let matchespayment=true;
if (selectedPayment==="paid"){
    matchespayment=paymentStatus==="paid";
}
else if (selectedPayment === "pending")
{
    matchespayment=paymentStatus==="pending";
}
// show / hide

if(matchesSeacrh && matchesMembership && matchespayment){
    row.style.display="";

}
else {
    row.style.display="none";
}
};

//===============
//SEARCH
//=====================
memberSearch.addEventListener("input",function(){
    filterMembers();

});
membershipFilter.addEventListener("change",function(){
    filterMembers();
});

paymentFilter.addEventListener("change",function(){
    filterMembers();
});
document.querySelectorAll(".view-btn");
    viewButtons.forEach(function(button){
        button.addEventListener("click",function(){
            const row=button.closest("tr");
            const memberName=row.querySelector(".member-info strong").innerText;
            alert("Member Profile "+ memberName);
        });
    });


    const editButtons=document.querySelectorAll(".edit-btn");
    editButtons.forEach(function(button){
        button.addEventListener("click",function(){
            const row=button.closest("tr");
            const memberName=row.querySelector(".member-info strong").innerText;
            alert("Edit Member"+ memberName);
        });
    });

    document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(function(button){
        button.addEventListener("click",function(){
            const row=button.closest("tr");
            const memberName=row.querySelector(".member-info strong").innerText;
            const confirmDelete=confirm("Are you sure you went to delete " + memberName +"?");
            if (confirmDelete){
                row.remove();
                alert(memberName + "has been delete");

            }
        });
    });
    //=============
    // ADD MEmber
    //===================
    addmemberbtn.addEventListener("click",function(){
        alert("Add Member from will open here");
    });