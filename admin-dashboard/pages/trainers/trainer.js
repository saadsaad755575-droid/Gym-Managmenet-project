const trainerSearch=document.getElementById("trainerSearch");
const statusFilter=document.getElementById("statusFilter");
const trainerTableBody=document.getElementById("trainerTableBody");
//========================
//Search +Status Filter
//=====================
function FilterTrainers(){
    const searchText=trainerSearch.ariaValueMax.toLowerCase().trim();
    const selectorStatus=ststus.value;
    const rows=trainerTableBody.querySelectorAll("tr");
    rows.forEach(function(row){
        const rowText=row.innerText.toLowerCase();
        const StatusElement=row.querySelector(".status");
        let trainerStatus="";
        if(StatusElement){
            trainerStatus=StatusElement.innerText.toLowerCase().trim();
        }
        // Search check
        const matchesSearch=rowText.includes(searchText);
        let matchStatus=true;
        if(selectorStatus==="available")
        {
            matchStatus=trainerStatus.includes("available");
        }
        else if(selectorStatus==="limited"){
            matchStatus=trainerStatus.includes("limited");

        }
        else if(selectorStatus==="assigned")
        {
            matchStatus=trainerStatus.includes("assigend");
        }
        if(matchesSearch && matchStatus){
            row.style.display="";
        }
        else{
            row.style.display="none";
        }
    });
}

//====================
//Search Event
//=====================
trainerSearch.addEventListener("input",FilterTrainers);
statusFilter.addEventListener("change",FilterTrainers);
FilterTrainers();