const modal=document.querySelector(".modal");
const cancelButton=document.querySelector(".modal-cancel");
const submitButton=document.querySelector(".modal-submit");
function openModal(){
    modal.classList.add("active");
}
function closeModal(){
    modal.classList.remove("active");

}
if(cancelButton){
    cancelButton.addEventListener("click",function(){
        closeModal();
    });
}
if(modal){
    modal.addEventListener("click",function(event){
        if (event.target === modal){
            closeModal();
        }
    });
}
document.addEventListener("keydown", function(event){
    if (event.key === "Escape"){
        closeModal();
    }
});