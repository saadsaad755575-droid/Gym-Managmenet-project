
// ========================================
// MEMBER STORAGE
// ========================================

const MEMBER_STORAGE_KEY = "gymMembers";


// ========================================
// LOAD CSS
// ========================================

function loadCSS(href, id) {

    if (!document.getElementById(id)) {

        const link = document.createElement("link");

        link.id = id;
        link.rel = "stylesheet";
        link.href = href;

        document.head.appendChild(link);
    }
}


// ========================================
// LOAD COMPONENTS
// ========================================

async function loadComponents() {

    try {

        // =========================
        // FONT AWESOME
        // =========================

        loadCSS(
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
            "font-awesome-css"
        );


        // =========================
        // SIDEBAR
        // =========================

        const sidebar =
            document.getElementById("sidebar");

        if (sidebar) {

            const sidebarResponse =
                await fetch(
                    "/components/sidebar/sidebar.html"
                );

            if (!sidebarResponse.ok) {

                throw new Error(
                    "Sidebar could not be loaded."
                );
            }

            const sidebarHTML =
                await sidebarResponse.text();

            const sidebarDocument =
                new DOMParser().parseFromString(
                    sidebarHTML,
                    "text/html"
                );

            const sidebarElement =
                sidebarDocument.querySelector(
                    ".sidebar"
                );

            if (sidebarElement) {

                sidebarElement
                    .querySelectorAll("img")
                    .forEach(function (img) {

                        const src =
                            img.getAttribute("src");

                        if (
                            src &&
                            src.includes("../../assets/")
                        ) {

                            img.src =
                                "/assets/" +
                                src.split("../../assets/")[1];
                        }

                    });

                sidebar.innerHTML =
                    sidebarElement.outerHTML;
            }

            loadCSS(
                "/components/sidebar/sidebar.css",
                "sidebar-component-css"
            );
        }


        // =========================
        // NAVBAR
        // =========================

        const navbar =
            document.getElementById("navbar");

        if (navbar) {

            const navbarResponse =
                await fetch(
                    "/components/navbar/navbar.html"
                );

            if (!navbarResponse.ok) {

                throw new Error(
                    "Navbar could not be loaded."
                );
            }

            const navbarHTML =
                await navbarResponse.text();

            const navbarDocument =
                new DOMParser().parseFromString(
                    navbarHTML,
                    "text/html"
                );

            const navbarElement =
                navbarDocument.querySelector(
                    ".navbar"
                );

            if (navbarElement) {

                const profileImage =
                    navbarElement.querySelector("img");

                if (profileImage) {

                    const src =
                        profileImage.getAttribute("src");

                    if (
                        src &&
                        src.includes("../../assets/")
                    ) {

                        profileImage.src =
                            "/assets/" +
                            src.split("../../assets/")[1];
                    }
                }

                navbar.innerHTML =
                    navbarElement.outerHTML;
            }

            loadCSS(
                "/components/navbar/navbar.css",
                "navbar-component-css"
            );
        }

    }

    catch (error) {

        console.error(
            "Component loading error:",
            error
        );
    }
}


// ========================================
// GET SAVED MEMBERS
// ========================================

function getSavedMembers() {

    const savedMembers =
        localStorage.getItem(
            MEMBER_STORAGE_KEY
        );

    if (!savedMembers) {
        return [];
    }

    try {

        return JSON.parse(savedMembers);

    }

    catch (error) {

        console.error(
            "Could not read members from localStorage:",
            error
        );

        return [];
    }
}


// ========================================
// SAVE MEMBERS
// ========================================

function saveMembers(members) {

    localStorage.setItem(
        MEMBER_STORAGE_KEY,
        JSON.stringify(members)
    );
}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ========================================
// GET NEXT MEMBER ID
// ========================================

function getNextMemberId() {

    const savedMembers =
        getSavedMembers();

    if (savedMembers.length === 0) {

        return "#M004";
    }

    let highestNumber = 3;

    savedMembers.forEach(function (member) {

        const number =
            parseInt(
                String(member.id)
                    .replace("#M", ""),
                10
            );

        if (
            !isNaN(number) &&
            number > highestNumber
        ) {

            highestNumber = number;
        }

    });

    return "#M" +
        String(
            highestNumber + 1
        ).padStart(3, "0");
}


// ========================================
// CREATE MEMBER ROW
// ========================================

function createMemberRow(member) {

    const newRow =
        document.createElement("tr");

    newRow.dataset.memberId =
        member.id;

    newRow.innerHTML = `

        <td>
            ${escapeHTML(member.id)}
        </td>

        <td>

            <div class="member-info">

                <div class="member-icon">

                    <i class="fa-solid fa-user"></i>

                </div>

                <div>

                    <strong>
                        ${escapeHTML(member.name)}
                    </strong>

                    <small>
                        Regular Member
                    </small>

                </div>

            </div>

        </td>

        <td>

            <span>
                ${escapeHTML(member.phone)}
            </span>

            <small class="email">
                ${escapeHTML(member.email)}
            </small>

        </td>

        <td>

            <span class="membership pending">
                ${escapeHTML(member.membership)}
            </span>

        </td>

        <td class="assigned-trainer">
            ${escapeHTML(
                member.trainer || "Not Assigned"
            )}
        </td>

        <td>

            <span class="payment pending">
                ${escapeHTML(member.payment)}
            </span>

        </td>

        <td>
            ${escapeHTML(member.joinDate)}
        </td>

        <td>

            <span class="member-status active">
                ${escapeHTML(
                    member.status || "Active"
                )}
            </span>

        </td>

        <td>

            <button
                class="action-btn view-btn"
                title="View"
            >
                <i class="fa-solid fa-eye"></i>
            </button>

            <button
                class="action-btn edit-btn"
                title="Edit"
            >
                <i class="fa-solid fa-pen"></i>
            </button>

            <button
                class="action-btn delete-btn"
                title="Delete"
            >
                <i class="fa-solid fa-trash"></i>
            </button>

            <button
                class="action-btn assign-trainer-btn"
                title="Assign Trainer"
            >
                <i class="fa-solid fa-user-check"></i>
            </button>

        </td>
    `;

    return newRow;
}


// ========================================
// LOAD SAVED MEMBERS
// ========================================

function loadSavedMembers() {

    const tableBody =
        document.getElementById(
            "memberTableBody"
        );

    if (!tableBody) {
        return;
    }

    const savedMembers =
        getSavedMembers();

    savedMembers.forEach(function (member) {

        const existingRow =
            tableBody.querySelector(
                `tr[data-member-id="${member.id}"]`
            );

        if (!existingRow) {

            const row =
                createMemberRow(member);

            tableBody.appendChild(row);
        }

    });
}


// ========================================
// FILTER MEMBERS
// ========================================

function filterMembers() {

    const searchInput =
        document.getElementById("memberSearch");

    const membershipFilter =
        document.getElementById(
            "membershipFilter"
        );

    const paymentFilter =
        document.getElementById(
            "paymentFilter"
        );

    const tableBody =
        document.getElementById(
            "memberTableBody"
        );

    if (
        !searchInput ||
        !membershipFilter ||
        !paymentFilter ||
        !tableBody
    ) {
        return;
    }

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedMembership =
        membershipFilter.value;

    const selectedPayment =
        paymentFilter.value;

    const rows =
        tableBody.querySelectorAll("tr");

    rows.forEach(function (row) {

        const rowText =
            row.innerText.toLowerCase();

        const membershipElement =
            row.querySelector(".membership");

        let matchesMembership = true;

        if (
            selectedMembership !== "all" &&
            membershipElement
        ) {

            matchesMembership =
                membershipElement.classList.contains(
                    selectedMembership
                );
        }

        const paymentElement =
            row.querySelector(".payment");

        let matchesPayment = true;

        if (
            selectedPayment !== "all" &&
            paymentElement
        ) {

            matchesPayment =
                paymentElement.classList.contains(
                    selectedPayment
                );
        }

        const matchesSearch =
            rowText.includes(searchText);

        row.style.display =
            matchesSearch &&
            matchesMembership &&
            matchesPayment
                ? ""
                : "none";
    });
}


// ========================================
// VIEW MEMBER
// ========================================

function viewMember(row) {

    if (!row) {
        return;
    }

    const memberId =
        row.dataset.memberId;

    if (memberId) {

        const savedMembers =
            getSavedMembers();

        const member =
            savedMembers.find(function (item) {

                return item.id === memberId;

            });

        if (member) {

            alert(
                "Member Profile\n\n" +

                "Member ID: " +
                member.id +

                "\nName: " +
                member.name +

                "\nPhone: " +
                member.phone +

                "\nEmail: " +
                member.email +

                "\nMembership: " +
                member.membership +

                "\nTrainer: " +
                (member.trainer || "Not Assigned") +

                "\nPayment: " +
                member.payment +

                "\nJoin Date: " +
                member.joinDate +

                "\nStatus: " +
                (member.status || "Active")
            );

            return;
        }
    }


    // =========================
    // HARD-CODED MEMBER
    // =========================

    const nameElement =
        row.querySelector(
            ".member-info strong"
        );

    const memberName =
        nameElement
            ? nameElement.innerText.trim()
            : "Member";

    const idElement =
        row.querySelector("td:first-child");

    const memberIdText =
        idElement
            ? idElement.innerText.trim()
            : "N/A";

    const trainerCell =
        row.querySelector(
            ".assigned-trainer"
        ) ||
        row.querySelectorAll("td")[4];

    const trainer =
        trainerCell
            ? trainerCell.innerText.trim()
            : "Not Assigned";

    alert(
        "Member Profile\n\n" +

        "Member ID: " +
        memberIdText +

        "\nName: " +
        memberName +

        "\nTrainer: " +
        trainer
    );
}


// ========================================
// EDIT MEMBER
// ========================================

function editMember(row) {

    if (!row) {
        return;
    }

    const memberId =
        row.dataset.memberId;

    if (!memberId) {

        alert(
            "This member cannot be edited."
        );

        return;
    }

    const savedMembers =
        getSavedMembers();

    const memberIndex =
        savedMembers.findIndex(
            function (member) {

                return member.id === memberId;

            }
        );

    if (memberIndex === -1) {

        alert(
            "Member data not found."
        );

        return;
    }

    const member =
        savedMembers[memberIndex];


    const updatedName =
        prompt(
            "Enter Member Name:",
            member.name
        );

    if (!updatedName) {
        return;
    }


    const updatedPhone =
        prompt(
            "Enter Phone Number:",
            member.phone
        );

    if (!updatedPhone) {
        return;
    }


    const updatedEmail =
        prompt(
            "Enter Email:",
            member.email
        );

    if (!updatedEmail) {
        return;
    }


    member.name =
        updatedName.trim();

    member.phone =
        updatedPhone.trim();

    member.email =
        updatedEmail.trim();

    savedMembers[memberIndex] =
        member;

    saveMembers(
        savedMembers
    );


    const newRow =
        createMemberRow(member);

    row.replaceWith(
        newRow
    );

    alert(
        member.name +
        " has been updated successfully!"
    );

    filterMembers();
}


// ========================================
// DELETE MEMBER
// ========================================

function deleteMember(row) {

    if (!row) {
        return;
    }

    const memberId =
        row.dataset.memberId;

    const nameElement =
        row.querySelector(
            ".member-info strong"
        );

    const memberName =
        nameElement
            ? nameElement.innerText.trim()
            : "this member";


    if (!memberId) {

        alert(
            "This member is part of the original HTML data."
        );

        return;
    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete " +
            memberName +
            "?"
        );

    if (!confirmDelete) {
        return;
    }


    const savedMembers =
        getSavedMembers();

    const updatedMembers =
        savedMembers.filter(
            function (member) {

                return member.id !== memberId;

            }
        );

    saveMembers(
        updatedMembers
    );

    row.remove();

    alert(
        memberName +
        " has been deleted."
    );
}


// ========================================
// ASSIGN TRAINER
// ========================================

function assignTrainer(row) {

    if (!row) {
        return;
    }


    const memberId =
        row.dataset.memberId;


    const trainerCell =
        row.querySelector(
            ".assigned-trainer"
        ) ||
        row.querySelectorAll("td")[4];


    const currentTrainer =
        trainerCell &&
        trainerCell.innerText.trim() !== "Not Assigned"
            ? trainerCell.innerText.trim()
            : "";


    const trainerName =
        prompt(
            "Enter Trainer Name:",
            currentTrainer
        );


    if (trainerName === null) {
        return;
    }


    const trimmedTrainer =
        trainerName.trim();


    if (trimmedTrainer === "") {

        alert(
            "Trainer name cannot be empty."
        );

        return;
    }


    // ========================================
    // LOCALSTORAGE MEMBER
    // ========================================

    if (memberId) {

        const savedMembers =
            getSavedMembers();

        const memberIndex =
            savedMembers.findIndex(
                function (member) {

                    return member.id === memberId;

                }
            );


        if (memberIndex !== -1) {

            savedMembers[memberIndex].trainer =
                trimmedTrainer;

            saveMembers(
                savedMembers
            );

            if (trainerCell) {

                trainerCell.textContent =
                    trimmedTrainer;
            }

            alert(
                savedMembers[memberIndex].name +
                " has been assigned to " +
                trimmedTrainer +
                "."
            );

            return;
        }
    }


    // ========================================
    // HARD-CODED MEMBER
    // ========================================

    if (trainerCell) {

        trainerCell.textContent =
            trimmedTrainer;
    }


    alert(
        "Trainer " +
        trimmedTrainer +
        " has been assigned successfully."
    );
}


// ========================================
// SETUP MEMBER ACTIONS
// ========================================

function setupMemberActions() {

    const tableBody =
        document.getElementById(
            "memberTableBody"
        );

    if (!tableBody) {
        return;
    }


    tableBody.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest("button");

            if (!button) {
                return;
            }


            const row =
                button.closest("tr");

            if (!row) {
                return;
            }


            // =========================
            // VIEW
            // =========================

            if (
                button.classList.contains(
                    "view-btn"
                )
            ) {

                viewMember(row);
            }


            // =========================
            // EDIT
            // =========================

            else if (
                button.classList.contains(
                    "edit-btn"
                )
            ) {

                editMember(row);
            }


            // =========================
            // DELETE
            // =========================

            else if (
                button.classList.contains(
                    "delete-btn"
                )
            ) {

                deleteMember(row);
            }


            // =========================
            // ASSIGN TRAINER
            // =========================

            else if (
                button.classList.contains(
                    "assign-trainer-btn"
                )
            ) {

                assignTrainer(row);
            }

        }
    );
}


// ========================================
// ADD MEMBER
// ========================================

function setupAddMemberButton() {

    const addMemberBtn =
        document.getElementById(
            "addMemberBtn"
        );

    if (!addMemberBtn) {
        return;
    }


    addMemberBtn.addEventListener(
        "click",
        function () {


            const memberName =
                prompt(
                    "Enter Member Name:"
                );

            if (!memberName) {
                return;
            }


            const phone =
                prompt(
                    "Enter Phone Number:"
                );

            if (!phone) {
                return;
            }


            const email =
                prompt(
                    "Enter Email:"
                );

            if (!email) {
                return;
            }


            const tableBody =
                document.getElementById(
                    "memberTableBody"
                );

            if (!tableBody) {
                return;
            }


            const memberId =
                getNextMemberId();


            const joinDate =
                new Date().toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            const newMember = {

                id:
                    memberId,

                name:
                    memberName.trim(),

                phone:
                    phone.trim(),

                email:
                    email.trim(),

                membership:
                    "Basic",

                trainer:
                    "Not Assigned",

                payment:
                    "Pending",

                joinDate:
                    joinDate,

                status:
                    "Active"
            };


            const savedMembers =
                getSavedMembers();


            savedMembers.push(
                newMember
            );


            saveMembers(
                savedMembers
            );


            const newRow =
                createMemberRow(
                    newMember
                );


            tableBody.appendChild(
                newRow
            );


            alert(
                memberName +
                " has been added successfully!"
            );


            filterMembers();

        }
    );
}


// ========================================
// START MEMBER PAGE
// ========================================

async function startMemberPage() {

    await loadComponents();

    loadSavedMembers();


    // =========================
    // SEARCH
    // =========================

    const searchInput =
        document.getElementById(
            "memberSearch"
        );

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterMembers
        );
    }


    // =========================
    // MEMBERSHIP FILTER
    // =========================

    const membershipFilter =
        document.getElementById(
            "membershipFilter"
        );

    if (membershipFilter) {

        membershipFilter.addEventListener(
            "change",
            filterMembers
        );
    }


    // =========================
    // PAYMENT FILTER
    // =========================

    const paymentFilter =
        document.getElementById(
            "paymentFilter"
        );

    if (paymentFilter) {

        paymentFilter.addEventListener(
            "change",
            filterMembers
        );
    }


    // =========================
    // ACTION BUTTONS
    // =========================

    setupMemberActions();


    // =========================
    // ADD MEMBER BUTTON
    // =========================

    setupAddMemberButton();
}


// ========================================
// START
// ========================================

startMemberPage();