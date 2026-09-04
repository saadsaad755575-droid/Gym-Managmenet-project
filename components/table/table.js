const tableButtons=document.querySelectorAll("table-actions button");
tableButtons.forEach(function(button){
    button.addEventListener("click",function(){
        const row=button.closest("tr");
        const memberName=row.querySelector(".member-info span").innerText;
        const action=button.getAttribute("title");
        if(action === "View"){
            alert(
                "Member Profile:" +
                memberName
            );
        }
        else if(action === "Edit"){
            alert(
                "Edit Member"+
                memberName
            );
        }
        else if(action === "Delete"){
            const confirmDelete=confirm("Are you sure you went to delete" + memberName+ "?");
            if (confirmDelete)
            {
                row.remove();
                alert(memberName+"has been delete");
            }
        }
    });
});