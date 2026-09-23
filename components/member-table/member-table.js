

/* ========================================
   MEMBER TABLE JAVASCRIPT
======================================== */


/* ========================================
   GET TABLE ELEMENTS
======================================== */

const memberTableBody =
    document.getElementById("memberTableBody" );

const memberTableEmpty = document.getElementById("memberTableEmpty" );

const memberViewAll =document.getElementById( "memberViewAll" );


/* ========================================
   CHECK TABLE DATA
======================================== */

function checkMemberTable() {

    if (!memberTableBody) {
        return;
    }


    const rows = memberTableBody.querySelectorAll("tr");


    if (rows.length === 0) {

        if (memberTableEmpty) {
        memberTableEmpty.style.display ="flex";

        }

    } else {

        if (memberTableEmpty) {
            memberTableEmpty.style.display ="none";

        }

    }

}


/* ========================================
   VIEW BUTTONS
======================================== */

function setupMemberTableActions() {

    const viewButtons =
        document.querySelectorAll(
            ".member-table-action");


    viewButtons.forEach(function (button) {

        button.addEventListener(
            "click", function () {
      const row =button.closest("tr");
       if (!row) {
                    return;
                }
                const cells =
                    row.querySelectorAll("td");


                const date =
                    cells[0]?.textContent.trim();


                const activity =
                    cells[1]?.textContent.trim();


                const trainer =
                    cells[2]?.textContent.trim();


                const status =
                    cells[3]?.textContent.trim();


                console.log("Activity Details:",
                    {
                        date: date, activity: activity,
                        trainer: trainer,status: status
                    }
                );

            }
        );

    });

}


/* ========================================
   VIEW ALL BUTTON
======================================== */

if (memberViewAll) {

    memberViewAll.addEventListener(
        "click",
        function () {

            console.log("All member activities opened.");

        }
    );

}


/* ========================================
   INITIALIZE MEMBER TABLE
======================================== */

checkMemberTable();

setupMemberTableActions();
