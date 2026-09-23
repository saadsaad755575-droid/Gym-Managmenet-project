/*=========================
MEMBER DASHBOARD JS
===========================*/
document.addEventListener(
    "DOMContentLoaded" , ()=> {
        /*==============================
        LOAD MEMBAR SIDEBAR
        ============================*/
        loadComponenet(
            "member-sidebar",
            "../components/member-sidebar/member-sidebar.html"
        );
        /*===========================
        LOAD MEMBER NAVBAR
        ==========================*/
        loadComponenet(
            "member-navbar",
            "../components/member-navbar/member-navbar.html"
        );


         /*================================
    LOAD MEMBER TABLE
    =================================*/
    loadComponenet(
        "member-table",
        "../components/member-table/member-table.html"
    );


    
         /*================================
    LOAD MEMBER MODAL
    =================================*/
    loadComponenet(
        "member-modal",
        "../components/member-modal/member-modal.html"
    );

    });


        /*===========================
    LOAD COMPOMTES FUMCTION
    =============================*/
    function
    loadComponenet(containerId, filePath)
    {
        const container =
        document.getElementById(containerId);


        /*=======================
        CHECK CONTAINER
        ===============================*/
        if (! container){
            console.error("container not found" ,
                containerId
            );
            return
        }

        /*===============================
        FETCH COMPONENT
        ===============================*/
        fetch(filePath)
        .then(response => {
            if(!response.ok){
                throw new
                Error(`Failed to load :${filePath}`);
            }
            return response.text();

        })
        /*===============================
          INSERT COMPONENT
          ============================*/
          .then(data =>{
            container.innerHTML =data;


            /*==================== 
            INITIALIZE SAIDEBAR
            ===========================*/
            if(containerId === "member-sidebar"  && 
                typeof initializeMemberSidebar === "function")
                {
                    initializeMemberSidebar();
                }
        /*==========================
        INITIALIZE NAVBAR
        ============================*/
        if(containerId === "member-navbar" && 
            typeof
            initMemberNavbar === "function")
            {
                intitMemberNavbar();
            }

            /*==================================
            INITIALIZE CARD
            ==================================*/
            if(containerId === "member-cards" &&
                typeof
                intitMemberCard === "function")
                {
                    intitMemberCard();
                }

                /*==============================
                INIYIALIZE TABLE
                ================================*/
                if(containerId === "member-table" &&
                    typeof
                    intitMemberTable ==="function"
                )
                {
                    intitMemberTable();
                }


                /*===========================
                INTIIALIZE MODAL
                ==============================*/
                if(containerId === "member-modal" &&
                    typeof
                    intitMemberModal === "function"
                ){
                    initMemberModal();
                }

          })
       /*=============================
       ERROR HANDLING
       ================================*/
       .catch(error => {
        console.error(error);
        container.innerHTML=
        `<p style=" color : #f5b900;
        padding:20px;">
        Component could not be loaded.
        </p>`;

       });
    }