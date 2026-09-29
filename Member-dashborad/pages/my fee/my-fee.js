

/* ========================================
   MEMBER MY FEES JS
======================================== */


document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadComponent(
            "member-sidebar",
            "../../../components/member-sidebar/member-sidebar.html"
        );


        loadComponent(
            "member-navbar",
            "../../../components/member-navbar/member-navbar.html"
        );


        loadMyFees();

    }
);



/* ========================================
   STORAGE KEYS
======================================== */

const MEMBER_STORAGE_KEY ="gymMembers";

const MEMBERSHIP_STORAGE_KEY = "gymMemberships";

const PAYMENT_STORAGE_KEY = "gymPayments";



/* ========================================
   LOAD COMPONENT
======================================== */

function loadComponent(
    containerId,filePath
) {

    const container =document.getElementById(containerId);


    if (!container) {

        console.error(
            "Container not found:", containerId
        );

        return;

    }


    fetch(filePath)

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Failed to load: " + filePath
                );
            }

            return response.text();

        })

        .then(function (data) {

            container.innerHTML = data;


            /* ==============================
               SIDEBAR
            ============================== */

            if (
                containerId === "member-sidebar" &&
                typeof initializeMemberSidebar === "function"
            ) {

                initializeMemberSidebar();

            }


            /* ==============================
               NAVBAR
            ============================== */

            if (
                containerId === "member-navbar" &&
                typeof initMemberNavbar === "function"
            ) {

                initMemberNavbar();

            }

        })

        .catch(function (error) {

            console.error(error);


            container.innerHTML = `

                <p style="
                    color:#f5b900; padding:20px;">

                    Component could not be loaded.

                </p>`;

        });

}



/* ========================================
   GET CURRENT MEMBER ID
======================================== */

function getCurrentMemberId() {

    return localStorage.getItem(
        "loggedInMemberId"
    );

}



/* ========================================
   GET MEMBERSHIPS
======================================== */

function getMemberships() {

    try {

        return JSON.parse(
            localStorage.getItem(
                MEMBERSHIP_STORAGE_KEY
            )
        ) || [];

    }

    catch (error) {

        console.error(
            "Invalid membership data:",error
        );

        return [];

    }

}



/* ========================================
   GET PAYMENTS
======================================== */

function getPayments() {

    try {

        return JSON.parse(
            localStorage.getItem(
                PAYMENT_STORAGE_KEY
            )
        ) || [];

    }

    catch (error) {

        console.error(
            "Invalid payment data:",error
        );

        return [];

    }

}



/* ========================================
   LOAD MY FEES
======================================== */

function loadMyFees() {

    const currentMemberId = getCurrentMemberId();


    /* ==============================
       MEMBER LOGIN CHECK
    ============================== */

    if (!currentMemberId) {

        console.warn("No logged-in member found.");

        showNoFeeData();

        return;

    }


    console.log(
        "Current Member ID:",currentMemberId
    );


    const memberships = getMemberships();


    const payments =getPayments();


    /* ==============================
       FIND MEMBER MEMBERSHIP
    ============================== */

    const memberMemberships =
        memberships.filter(
            function (membership) {

                return String(
                    membership.memberId || ""
                )
                .trim().toLowerCase()===
                String(
                    currentMemberId
                )
                .trim().toLowerCase();

            }
        );


    /* ==============================
       FIND MEMBER PAYMENTS
    ============================== */

    const memberPayments =
        payments.filter(
            function (payment) {

                return String(
                    payment.memberId || ""
                )
                .trim().toLowerCase()===
                String(
                    currentMemberId
                )
                .trim().toLowerCase();

            }
        );


    console.log("My Memberships:",memberMemberships);


    console.log( "My Payments:", memberPayments );


    /* ==============================
       CURRENT MEMBERSHIP
    ============================== */

    const currentMembership =
        memberMemberships.length > 0
            ? memberMemberships[
                memberMemberships.length - 1
            ]: null;


    /* ==============================
       RENDER MEMBERSHIP
    ============================== */

    renderMembership(
        currentMembership
    );


    /* ==============================
       RENDER PAYMENTS
    ============================== */

    renderPaymentHistory(
        memberPayments
    );


    /* ==============================
       CALCULATE TOTAL PAID
    ============================== */

    const totalPaid = memberPayments.reduce(
            function (total, payment) {

                const status =
                    String(
                        payment.status || ""
                    )
                    .trim().toLowerCase();


                if (status === "paid") {

                    return total +
                        Number( payment.amount);

                }


                return total;

            }, 0
        );


    /* ==============================
       TOTAL MEMBERSHIP FEE
    ============================== */

    const membershipFee =currentMembership
            ? Number(
                currentMembership.price
            ) || 0: 0;


    /* ==============================
       REMAINING
    ============================== */

    const remaining =Math.max(
            membershipFee - totalPaid,0
        );


    /* ==============================
       PAYMENT STATUS
    ============================== */

    let paymentStatus = currentMembership
            ? currentMembership.paymentStatus: "";


    if (!paymentStatus && memberPayments.length > 0) {

        const latestPayment =memberPayments[
                memberPayments.length - 1
            ];


        paymentStatus =latestPayment.status || "";

    }


    /* ==============================
       SUMMARY
    ============================== */

    setText(
        "membershipFee",
        formatCurrency(membershipFee)
    );


    setText(
        "totalPaid",
        formatCurrency(totalPaid)
    );


    setText(
        "remainingAmount",
        formatCurrency(remaining)
    );


    setStatus(
        "paymentStatus",
        paymentStatus
    );


    /* ==============================
       ALERT
    ============================== */

    handleFeeAlert(
        paymentStatus,remaining
    );

}



/* ========================================
   RENDER MEMBERSHIP
======================================== */

function renderMembership(
    membership
) {

    if (!membership) {

        setText(
            "membershipPlan","No Membership"
        );


        setText(
            "detailMembershipPlan", "-"
        );


        setText(
            "detailDuration", "-"
        );


        setText(
            "detailTotalFee", "Rs. 0"
        );


        setStatus(
            "detailMembershipStatus", "-"
        );


        return;

    }


    setText(
        "membershipPlan",
        membership.plan || "Membership"
    );


    setText(
        "detailMembershipPlan",
        membership.plan || "-"
    );


    setText(
        "detailDuration",
        membership.duration || "-"
    );


    setText(
        "detailTotalFee",
        formatCurrency(
            Number(membership.price) || 0
        )
    );


    setStatus(
        "detailMembershipStatus",
        membership.paymentStatus || "-"
    );

}



/* ========================================
   RENDER PAYMENT HISTORY
======================================== */

function renderPaymentHistory(
    payments
) {

    const tableBody =
        document.getElementById(
            "paymentHistoryBody"
        );


    if (!tableBody) return;


    tableBody.innerHTML = "";


    if (
        !payments ||
        payments.length === 0
    ) {

        tableBody.innerHTML = `

            <tr class="empty-payment-row">

                <td colspan="6">

                    <i class="fa-solid fa-receipt"></i>

                    <span>
                        No payment history found.
                    </span>

                </td>

            </tr>`;

        return;

    }


    payments.forEach(
        function (payment) {

            const row =document.createElement("tr");


            const paymentId = payment.id || "-";


            const membership = payment.membership || "-";


            const amount =
                Number(payment.amount
                ) || 0;


            const paymentDate = payment.paymentDate || "-";


            const dueDate =  payment.dueDate || "-";


            const status =
                String(
                    payment.status || "-"
                )
                .trim()  .toLowerCase();


            const statusText =
                getStatusText(status);


            row.innerHTML = `

                <td>

                    <span class="payment-id">

                        #${paymentId}

                    </span>

                </td>


                <td>

                    ${membership}

                </td>


                <td>

                    <span class="payment-amount">

                        ${formatCurrency(amount)}

                    </span>

                </td>


                <td>

                    ${paymentDate}

                </td>


                <td>

                    ${dueDate}

                </td>


                <td>

                    <span
                        class="payment-status ${status}">

                        ${statusText}

                    </span>

                </td>`;


            tableBody.appendChild(row);

        }
    );

}



/* ========================================
   STATUS TEXT
======================================== */

function getStatusText(
    status
) {

    const normalizedStatus =
        String(status)
            .trim() .toLowerCase();


    if (normalizedStatus === "paid") {

        return "Paid";

    }


    if (normalizedStatus === "pending") {

        return "Pending";

    }


    if (normalizedStatus === "overdue") {

        return "Overdue";

    }


    if (!normalizedStatus) {

        return "-";

    }


    return normalizedStatus
        .charAt(0).toUpperCase() +
        normalizedStatus.slice(1);

}



/* ========================================
   SET STATUS
======================================== */

function setStatus(
    elementId,
    status
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) return;


    const normalizedStatus =
        String(status || "")
            .trim().toLowerCase();


    element.classList.remove(
        "paid", "pending",  "overdue"
    );


    if (
        normalizedStatus === "paid" ||
        normalizedStatus === "pending" ||
        normalizedStatus === "overdue"
    ) {

        element.classList.add(
            normalizedStatus
        );

    }


    element.textContent =
        getStatusText(status);

}



/* ========================================
   FEE ALERT
======================================== */

function handleFeeAlert(
    status,
    remaining
) {

    const alertBox =
        document.getElementById(
            "feeAlert"
        );


    const alertTitle =
        document.getElementById(
            "feeAlertTitle"
        );


    const alertMessage =
        document.getElementById(
            "feeAlertMessage"
        );


    if (
        !alertBox || !alertTitle ||
        !alertMessage
    ) {

        return;

    }


    const normalizedStatus =
        String(status || "")
            .trim()  .toLowerCase();


    /* ==============================
       OVERDUE
    ============================== */

    if (normalizedStatus === "overdue") {

        alertBox.style.display = "flex";

        alertTitle.textContent = "Payment Overdue";

        alertMessage.textContent =
            "Your membership payment is overdue. Please contact the gym administration.";

        return;

    }


    /* ==============================
       PENDING
    ============================== */

    if (normalizedStatus === "pending") {

        alertBox.style.display = "flex";

        alertTitle.textContent ="Payment Pending";

        alertMessage.textContent =
            "Your membership payment is currently pending.";

        return;

    }


    /* ==============================
       REMAINING BALANCE
    ============================== */

    if (remaining > 0) {

        alertBox.style.display = "flex";

        alertTitle.textContent ="Remaining Fee";

        alertMessage.textContent =
            "You have an outstanding membership balance.";

        return;

    }


    /* ==============================
       NO ALERT
    ============================== */

    alertBox.style.display = "none";

}



/* ========================================
   FORMAT CURRENCY
======================================== */

function formatCurrency(
    amount
) {

    const value =
        Number(amount) || 0;


    return (
        "Rs. " +value.toLocaleString("en-PK")
    );

}



/* ========================================
   SET TEXT
======================================== */

function setText(
    elementId, value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) return;


    element.textContent = value ?? "-";

}



/* ========================================
   NO FEE DATA
======================================== */

function showNoFeeData() {

    setText(
        "membershipFee","Rs. 0"
    );


    setText(
        "totalPaid", "Rs. 0"
    );


    setText(
        "remainingAmount","Rs. 0"
    );


    setStatus(
        "paymentStatus","-"
    );


    setText(
        "membershipPlan", "No Membership"
    );


    setText(
        "detailMembershipPlan",  "-"
    );


    setText(
        "detailDuration", "-"
    );


    setText(
        "detailTotalFee","Rs. 0"
    );


    setStatus(
        "detailMembershipStatus","-"
    );

}
