const reuableButton=document.querySelectorAll(".reusable-button");
reuableButton.forEach(function(button){
    button.addEventListener("click",function(){
        console.log("Button clicked");
    });
});