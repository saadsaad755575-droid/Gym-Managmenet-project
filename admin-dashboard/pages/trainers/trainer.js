const trainerSearch=document.getElementById("trainerSearch");
const statusFilter=document.getElementById("statusFilter");
const trainerTableBody=document.getElementById("trainerTableBody");
//========================
//Search +Status Filter
//=====================
function FilterTrainers(){
    const SearchText=trainerSearch.ariaValueMax.toLowerCase().trim();
    const selectorStatus=ststus.value;
    const rows=trainerTableBody.querySelectorAll("tr");
    rows.forEach(function(row){
        const rowText=row.innerText.toLowerCase();
        const StatusElement=row.querySelector
    })
}