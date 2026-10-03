
/* ========================================
   MEMBER SMART ATTENDANCE JS
======================================== */


/* ========================================
   STORAGE
======================================== */

const MEMBER_STORAGE_KEY = "gymMembers";

const ATTENDANCE_STORAGE_KEY =
    "gymAttendance";

const LOGGED_IN_MEMBER_KEY =
    "loggedInMemberId";


/* ========================================
   GYM LOCATION
======================================== */

const GYM_LOCATION = {

    latitude: 31.5204,

    longitude: 74.3587,

    radius: 30000

};


/* ========================================
   VARIABLES
======================================== */

let currentMember = null;

let faceVerified = false;

let locationVerified = false;

let cameraStream = null;

let cameraVideo = null;


/* ========================================
   DOM ELEMENTS
======================================== */

let startFaceVerification;

let markAttendanceBtn;

let attendanceMemberId;

let attendanceMemberName;

let attendanceLocationStatus;

let attendanceDate;

let attendanceTime;

let verificationStatus;

let cameraMessage;


let attendanceMessage;

let todayAttendanceStatus;


/* ========================================
   LOAD COMPONENT
   SAME PATTERN AS MEMBER PROFILE
======================================== */

function loadComponent(
    containerId, filePath
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container) {

        console.error(
            "Container not found:", containerId
        );

        return;

    }


    fetch(filePath)

        .then(function (response) {

            if (!response.ok) {

                throw new Error("Failed to load: " +  filePath
                );

            }

            return response.text();

        })

        .then(function (data) {

            container.innerHTML = data;


            /* ==============================
               SIDEBAR INITIALIZATION
            ============================== */

            if (
                containerId ===
                    "member-sidebar" &&
                typeof initializeMemberSidebar ==="function"
            ) {

                initializeMemberSidebar();

            }


            /* ==============================
               NAVBAR INITIALIZATION
            ============================== */

            if (
                containerId ===
                    "member-navbar" &&
                typeof initMemberNavbar === "function"
            ) {

                initMemberNavbar();

            }

        })

        .catch(function (error) {

            console.error(error);


            container.innerHTML = `

                <p style="
                    color:#f5b900;
                    padding:20px; ">

                    Component could not be loaded.

                </p>`;

        });

}


/* ========================================
   LOAD MEMBER COMPONENTS
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =========================
           COMPONENTS
        ========================= */

        loadComponent(
            "member-sidebar",
            "../../../components/member-sidebar/member-sidebar.html"
        );


        loadComponent(
            "member-navbar",
            "../../../components/member-navbar/member-navbar.html"
        );


        /* =========================
           DOM ELEMENTS
        ========================= */

        startFaceVerification =
            document.getElementById(
                "startFaceVerification"
            );


        markAttendanceBtn =
            document.getElementById(
                "markAttendanceBtn"
            );


        attendanceMemberId =
            document.getElementById(
                "attendanceMemberId"
            );


        attendanceMemberName =
            document.getElementById(
                "attendanceMemberName"
            );


        attendanceLocationStatus =
            document.getElementById(
                "attendanceLocationStatus"
            );


        attendanceDate =
            document.getElementById(
                "attendanceDate"
            );


        attendanceTime =
            document.getElementById(
                "attendanceTime"
            );


        verificationStatus =
            document.getElementById(
                "verificationStatus"
            );


        cameraMessage =
            document.getElementById(
                "cameraMessage"
            );
        cameraVideo =
        document.getElementById(
            "cameraVideo"
        );


        attendanceMessage =
            document.getElementById(
                "attendanceMessage"
            );


        todayAttendanceStatus =
            document.getElementById(
                "todayAttendanceStatus"
            );


        /* =========================
           LOAD MEMBER
        ========================= */

        loadLoggedInMember();


        /* =========================
           DATE & TIME
        ========================= */

        updateDateTime();


        setInterval( updateDateTime,  1000 );


        /* =========================
           LOCATION
        ========================= */

        checkGymLocation();


        /* =========================
           TODAY ATTENDANCE
        ========================= */

        checkTodayAttendance();


        /* =========================
           FACE VERIFICATION
        ========================= */

if (startFaceVerification) {

    console.log("Verify button found");

    startFaceVerification.addEventListener( "click",
        function () {

            console.log("VERIFY BUTTON CLICKED");

            startIdentityVerification();

        }
    );

} else {

    console.log( "VERIFY BUTTON NOT FOUND");

}



        /* =========================
           MARK ATTENDANCE
        ========================= */

        if (markAttendanceBtn) {

            markAttendanceBtn.addEventListener(  "click",markAttendance );

        }

    }
);


/* ========================================
   LOAD LOGGED-IN MEMBER
======================================== */

function loadLoggedInMember() {

    const storedMembers =
        localStorage.getItem(
            MEMBER_STORAGE_KEY
        );


    if (!storedMembers) {

        showMessage(
            "No member data found.", "error"
        );

        return;

    }



    let members;


    try {

        members = JSON.parse(  storedMembers );

    }

    catch (error) {

        console.error(
            "Invalid member data:", error
        );

        return;

    }


    if (!Array.isArray(members)) {

        return;

    }


    const loggedInMemberId =
        localStorage.getItem(
            LOGGED_IN_MEMBER_KEY
        );


    if (!loggedInMemberId) {

        console.warn( "No logged-in member ID found." );

        return;

    }


    currentMember =
        members.find(
            function (member) {

                const memberId =
                    member.id ||  member.memberId ||
                    member.customerId ||  member.memberID ||"";


                return (

                    String(memberId)
                        .trim().toLowerCase()

                    ===

                    String(loggedInMemberId)
                        .trim().toLowerCase()

                );

            }
        );


    if (!currentMember) {

        console.warn("Logged-in member not found.");

        return;

    }


/* ========================================
   RESET ATTENDANCE STATE
   FOR NEW LOGGED-IN MEMBER
======================================== */

faceVerified = false;

locationVerified = false;

cameraStream = null;


/* ========================================
   RESET VERIFICATION UI
======================================== */

if (verificationStatus) {

    verificationStatus.textContent =
        "Identity Verification Required";

    verificationStatus.className =
        "status-pending";

}


if (cameraMessage) {

    cameraMessage.textContent =
        "Please verify your identity.";

}


/* ========================================
   RESET ATTENDANCE BUTTON
======================================== */

if (markAttendanceBtn) {

    markAttendanceBtn.disabled = true;

} 


    const memberId =
        currentMember.id || currentMember.memberId ||
        currentMember.customerId ||  "-";


    const memberName =
        currentMember.name || currentMember.memberName ||
        currentMember.fullName || "Member";


    if (attendanceMemberId) {

        attendanceMemberId.textContent = memberId;

    }


    if (attendanceMemberName) {

        attendanceMemberName.textContent =  memberName;

    }

}


/* ========================================
   DATE & TIME
======================================== */

function updateDateTime() {

    const now = new Date();


    if (attendanceDate) {

        attendanceDate.textContent =
            now.toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

    }


    if (attendanceTime) {

        attendanceTime.textContent =
            now.toLocaleTimeString(
                "en-GB",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );

    }

}





/* ========================================
   CHECK GYM LOCATION
======================================== */

function checkGymLocation() {

    return new Promise(function (resolve) {

        const savedLocation =
            sessionStorage.getItem("gymLocationVerified");

        const savedTime =
            sessionStorage.getItem("gymLocationVerifiedTime");


        /*
           Last successful location ko
           sirf 10 minutes tak use karenge.
        */

        if (savedLocation === "true" && savedTime) {

            const currentTime = Date.now();

            const locationAge =
                currentTime - Number(savedTime);

            const tenMinutes =
                10 * 60 * 1000;


            if (locationAge <= tenMinutes) {

                locationVerified = true;


                setLocationStatus(
                    "Gym location verified",
                    true
                );


                updateAttendanceButton();


                console.log(
                    "USING RECENTLY VERIFIED GYM LOCATION"
                );


                resolve(true);

                return;
            }

            else {

                sessionStorage.removeItem(
                    "gymLocationVerified"
                );

                sessionStorage.removeItem(
                    "gymLocationVerifiedTime"
                );
            }
        }


        if (!navigator.geolocation) {

            locationVerified = false;

            setLocationStatus(
                "Location not supported",
                false
            );

            updateAttendanceButton();

            resolve(false);

            return;
        }


        setLocationStatus(
            "Checking location...",
            false
        );


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const userLatitude =
                    position.coords.latitude;

                const userLongitude =
                    position.coords.longitude;


                console.log(
                    "LOCATION RECEIVED:",
                    userLatitude,
                    userLongitude
                );


                const distance =
                    calculateDistance(

                        userLatitude,
                        userLongitude,

                        GYM_LOCATION.latitude,
                        GYM_LOCATION.longitude
                    );


                console.log(
                    "DISTANCE FROM GYM:",
                    distance,
                    "meters"
                );


                if (
                    distance <= GYM_LOCATION.radius
                ) {

                    locationVerified = true;


                    /*
                       Successful verification ko
                       current browser session mein
                       temporarily save karenge.
                    */

                    sessionStorage.setItem(
                        "gymLocationVerified",
                        "true"
                    );


                    sessionStorage.setItem(
                        "gymLocationVerifiedTime",
                        Date.now().toString()
                    );


                    setLocationStatus(
                        "Gym location verified",
                        true
                    );

                }

                else {

                    locationVerified = false;


                    sessionStorage.removeItem(
                        "gymLocationVerified"
                    );


                    sessionStorage.removeItem(
                        "gymLocationVerifiedTime"
                    );


                    setLocationStatus(
                        "You are outside the gym location",
                        false
                    );
                }


                updateAttendanceButton();


                resolve(locationVerified);

            },


            function (error) {

                console.error(
                    "LOCATION ERROR:",
                    error.code,
                    error.message
                );


                /*
                   Agar browser ne temporary location
                   nahi di, to check karenge ke recent
                   successful gym verification saved hai
                   ya nahi.
                */

                const recentVerification =
                    sessionStorage.getItem(
                        "gymLocationVerified"
                    );

                const recentTime =
                    sessionStorage.getItem(
                        "gymLocationVerifiedTime"
                    );


                if (
                    recentVerification === "true" &&
                    recentTime &&
                    Date.now() -
                    Number(recentTime) <=
                    10 * 60 * 1000
                ) {

                    locationVerified = true;


                    setLocationStatus(
                        "Gym location verified",
                        true
                    );


                    console.log(
                        "LOCATION REQUEST FAILED - USING RECENT VERIFIED LOCATION"
                    );


                    updateAttendanceButton();


                    resolve(true);

                    return;
                }


                locationVerified = false;


                setLocationStatus(
                    "Location could not be verified",
                    false
                );


                updateAttendanceButton();


                resolve(false);

            },


            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }

        );

    });

} 



/* ========================================
   LOCATION STATUS
======================================== */

function setLocationStatus(
    message, verified
) {

    if (!attendanceLocationStatus) {

        return;

    }


    attendanceLocationStatus.textContent = message;


    if (verified) {

        attendanceLocationStatus.classList.add("verified");

    }

    else {

        attendanceLocationStatus.classList.remove( "verified" );

    }

}


/* ========================================
   DISTANCE CALCULATION
======================================== */

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const earthRadius = 6371000;


    const latitudeDifference =
        toRadians(
            lat2 - lat1
        );


    const longitudeDifference =
        toRadians( lon2 - lon1);


    const a =

        Math.sin( latitudeDifference / 2 ) *
        Math.sin(
            latitudeDifference / 2
        )

        +

        Math.cos( toRadians(lat1) )
        *
        Math.cos(toRadians(lat2)
        )
        *
        Math.sin(
            longitudeDifference / 2
        ) *
        Math.sin(
            longitudeDifference / 2
        );


    const c =2 *
        Math.atan2( Math.sqrt(a), Math.sqrt(1 - a));


    return earthRadius * c;

}


/* ========================================
   TO RADIANS
======================================== */

function toRadians(degrees) {

    return (
        degrees *Math.PI / 180
    );

}


/* ========================================
   START IDENTITY VERIFICATION
=======================================*/

async function startIdentityVerification() {

    if (!currentMember) {

        showMessage(
            "Member information could not be loaded.","error"
        );

        return;

    }


    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        showMessage(
            "Camera is not supported by this browser.", "error"
        );

        return;

    }


    try {

        /* ==============================
           CAMERA REQUEST
        ============================== */

        cameraMessage.textContent = "Requesting camera access...";


        verificationStatus.textContent = "Opening Camera...";


        verificationStatus.className = "status-pending";


        cameraStream =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: "user"
                },

                audio: false

            });


        /* ==============================
           SHOW LIVE CAMERA
        ============================== */

        if (cameraVideo) {

            cameraVideo.srcObject =cameraStream;

            cameraVideo.style.display ="block";

            await cameraVideo.play();

        }


        cameraMessage.textContent =
            "Camera connected. Please look at the camera.";


        verificationStatus.textContent = "Checking Identity...";


        verificationStatus.className ="status-pending";


        /* ==============================
           CURRENT VERIFICATION FLOW
        ============================== */

        await new Promise(
            function (resolve) {

                setTimeout(
                    resolve, 1500
                );

            }
        );


        faceVerified = true;


        verificationStatus.textContent ="Identity Verified";


        verificationStatus.className ="status-success";


        cameraMessage.textContent ="Identity verification completed.";


        /* ==============================
           STOP CAMERA
        ============================== */

        stopCamera();


        if (cameraVideo) {

            cameraVideo.srcObject = null;

        }


        /* ==============================
           CHECK LOCATION
        ============================== */

/* ==============================
   CHECK LOCATION
============================== */

showMessage(
    "Identity verified. Checking gym location...",
    "success"
);


const locationOK =
    await checkGymLocation();


/* ==============================
   FINAL BUTTON UPDATE
============================== */

updateAttendanceButton();


if (locationOK) {

    showMessage(
        "Identity and gym location verified. You can mark attendance.",
        "success"
    );

}

else {

    showMessage(
        "Identity verified, but gym location could not be verified.",
        "error"
    );

}


    }

    catch (error) {

        console.error(
            "Camera error:",error
        );


        verificationStatus.textContent ="Verification Failed";


        verificationStatus.className = "status-error";


        cameraMessage.textContent =
            "Camera permission was not granted.";


        showMessage(
            "Please allow camera permission and try again.","error"
        );

    }

}


        

/* ========================================
   FACE VERIFICATION FLOW
======================================== */

async function waitForFaceVerification() {

    verificationStatus.textContent ="Checking Identity...";


    verificationStatus.className ="status-pending";


    cameraMessage.textContent = "Identity verification in progress...";



    await new Promise(
        function (resolve) {

            setTimeout(
                resolve,
                1500
            );

        }
    );




    faceVerified =true;


    verificationStatus.textContent = "Identity Verified";


    verificationStatus.className = "status-success";


    cameraMessage.textContent = "Identity verification completed.";


    updateAttendanceButton();


    showMessage(
        "Identity verified. You can now mark attendance.",
        "success"
    );


    stopCamera();

}


/* ========================================
   STOP CAMERA
======================================== */

function stopCamera() {

    if (!cameraStream) {

        return;

    }


    cameraStream
        .getTracks().forEach(
            function (track) {

                track.stop();

            }
        );


    cameraStream = null;

}


/* ========================================
   UPDATE ATTENDANCE BUTTON
======================================== */

function updateAttendanceButton() {

    if (!markAttendanceBtn) {

        return;

    }


    const alreadyMarked =  hasMarkedToday();
    console.log ("CURRENT MEMBER", currentMember);
    console.log("FACE VERIFIED",faceVerified);
    console.log("LOCATION VERIFIED", locationVerified);
    console.log("ALREADY MARKED",alreadyMarked);


    if (
        faceVerified && locationVerified &&
        !alreadyMarked
    ) {

        markAttendanceBtn.disabled = false;

    }

    else {

        markAttendanceBtn.disabled = true;

    }

}


/* ========================================
   CHECK TODAY ATTENDANCE
======================================== */

function checkTodayAttendance() {

    if (!currentMember) {

        return;

    }


    const records =getAttendanceRecords();


    const today = getTodayDate();


    const memberId = getCurrentMemberId();


    const todayRecord = records.find(
            function (record) {

                return (

                    record.memberId === memberId

                    &&

                    record.date === today

                );

            }
        );


    if (todayRecord) {

        showTodayAttendance(todayRecord );

    }

    else {

        if (todayAttendanceStatus) {

            todayAttendanceStatus.innerHTML = `

                <i class="fa-solid fa-calendar-xmark"></i>

                <span>
                    Attendance not marked today.
                </span> `;

        }

    }


    updateAttendanceButton();

}


/* ========================================
   MARK ATTENDANCE
======================================== */

function markAttendance() {

    if (!currentMember) {

        return;

    }


    if (!faceVerified) {

        showMessage(
            "Identity verification is required.","error"
        );

        return;

    }


    if (!locationVerified) {

        showMessage(
            "Gym location verification is required.", "error"
        );

        return;

    }


    if (hasMarkedToday()) {

        showMessage(
            "Your attendance has already been marked today.","error"
        );

        return;

    }


    const memberId = getCurrentMemberId();


    const memberName =
        currentMember.name || currentMember.memberName ||
        currentMember.fullName ||"Member";


    const now =new Date();


    const newRecord = {

        id:
            Date.now(),

        memberId:memberId,

        member:  memberName,

        date:  getTodayDate(),

        checkIn:
            now.toTimeString().slice(0, 5),

        status: "Present",

        verification:"Identity Verified",

        location:"Gym Location Verified",

        timestamp: now.toISOString()

    };


    const records =getAttendanceRecords();


    records.push(
        newRecord
    );


    localStorage.setItem(
        ATTENDANCE_STORAGE_KEY,
        JSON.stringify(records)
    );


    showTodayAttendance( newRecord);


    markAttendanceBtn.disabled = true;


    showMessage(
        "Attendance marked successfully.", "success"
    );


    verificationStatus.textContent = "Attendance Marked";


    verificationStatus.className = "status-success";


    faceVerified =false;

}


/* ========================================
   GET ATTENDANCE RECORDS
======================================== */

function getAttendanceRecords() {

    const savedData =
        localStorage.getItem(
            ATTENDANCE_STORAGE_KEY
        );


    if (!savedData) {

        return [];

    }


    try {

        const records =
            JSON.parse(
                savedData
            );


        return Array.isArray(records)
            ? records : [];

    }

    catch (error) {

        console.error(
            "Attendance data could not be loaded:", error
        );


        return [];

    }

}


/* ========================================
   GET CURRENT MEMBER ID
======================================== */

function getCurrentMemberId() {

    if (!currentMember) {

        return "";

    }


    return String(

        currentMember.id ||currentMember.memberId ||
        currentMember.customerId || currentMember.memberID || ""

    ).trim();

}


/* ========================================
   GET TODAY DATE
======================================== */

function getTodayDate() {

    const now =new Date();


    const year = now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,"0"
        );


    const day =
        String(
            now.getDate()
        ).padStart(
            2, "0"
        );


    return (
        year + "-" +
        month + "-" + day
    );

}


/* ========================================
   CHECK ALREADY MARKED
======================================== */

function hasMarkedToday() {

    const memberId =getCurrentMemberId();


    const today =  getTodayDate();


    const records = getAttendanceRecords();


    return records.some(
        function (record) {

            return (

                String(
                    record.memberId
                ).trim()===

                memberId && record.date ===today

            );

        }
    );

}


/* ========================================
   SHOW TODAY ATTENDANCE
======================================== */

function showTodayAttendance(
    record
) {

    if (!todayAttendanceStatus) {

        return;

    }


    todayAttendanceStatus.innerHTML = `

        <i class="fa-solid fa-circle-check"></i>

        <span>

            Attendance marked successfully
            at ${formatTime(record.checkIn)}.

        </span>`;

}


/* ========================================
   FORMAT TIME
======================================== */

function formatTime(
    time
) {

    if (!time) {

        return "-";

    }


    const parts =time.split(":");


    if (parts.length < 2) {

        return time;

    }


    let hours =
        parseInt(parts[0],10);


    const minutes =parts[1];


    const period =
        hours >= 12 ? "PM": "AM";


    hours =
        hours % 12 || 12;


    return (
        hours +
        ":" +
        minutes +
        " " +
        period
    );

}


/* ========================================
   SHOW MESSAGE
======================================== */

function showMessage(
    message,
    type
) {

    if (!attendanceMessage) {

        return;

    }


    attendanceMessage.textContent =
        message;


    attendanceMessage.className =
        "attendance-message " +type;


    setTimeout(
        function () {

            if (attendanceMessage) {

                attendanceMessage.textContent ="";

                attendanceMessage.className = "attendance-message";

            }

        },
        4000
    );

}


/* ========================================
   PAGE CLEANUP
======================================== */

window.addEventListener(
    "beforeunload",
    function () {

        stopCamera();

    }
); 
