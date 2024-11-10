"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const form = document.getElementById("resume-form");
const resumePage = document.getElementById("resumePage");
const resumePhoto = document.getElementById("resumePhoto");
const resumeName = document.getElementById("resumeName");
const resumeEmail = document.getElementById("resumeEmail");
const resumePhone = document.getElementById("resumePhone");
const resumeEducation = document.getElementById("resumeEducation");
const resumeExperience = document.getElementById("resumeExperience");
const resumeSkills = document.getElementById("resumeSkills");
const editButton = document.getElementById("editButton");
const backButton = document.getElementById("backButton");
const shareLinkButton = document.getElementById("shareLinkButton");
const downloadPdf = document.getElementById("download-pdf");
const resumeContent = document.getElementById("resumeContent");
// Form submission
form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    event.preventDefault(); // prevent page reload
    //  Collect input values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const education = document.getElementById("education").value;
    const experience = document.getElementById("experience").value;
    const skills = document.getElementById("skills").value;
    const photoInput = document.getElementById("photo");
    const photoFile = photoInput.files ? photoInput.files[0] : null;
    let photoBase64 = '';
    if (photoFile) {
        photoBase64 = yield fileToBase64(photoFile);
        localStorage.setItem("resumePhoto", photoBase64);
        resumePhoto.src = photoBase64;
    }
    //  Generate Dynamically Resume content
    (_a = document.querySelector(".container")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
    resumePage.classList.remove("hidden");
    resumeName.textContent = name;
    resumeEmail.textContent = `Email: ${email}`;
    resumePhone.textContent = `Phone: ${phone}`;
    resumeEducation.textContent = education;
    resumeExperience.textContent = experience;
    resumeSkills.textContent = skills;
    // shareable link
    const querParams = new URLSearchParams({
        name: name,
        email: email,
        phone: phone,
        education: education,
        experience: experience,
        skills: skills
    });
    const url = `${window.location.origin}? ${querParams.toString()}`;
    shareLinkButton.addEventListener("click", () => {
        navigator.clipboard.writeText(url);
        alert("Link is copied");
    });
    window.history.replaceState(null, "", `${querParams.toString()}`);
}));
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
// Edit button functionality added
editButton.addEventListener("click", () => {
    var _a;
    updateResumeForm();
    (_a = document.querySelector(".container")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
    resumePage.classList.add("hidden");
});
// Update Resume Form
function updateResumeForm() {
    var _a, _b;
    document.getElementById("name").value = resumeName.textContent || "";
    document.getElementById("email").value = ((_a = resumeEmail.textContent) === null || _a === void 0 ? void 0 : _a.replace("Email:", "")) || "";
    document.getElementById("phone").value = ((_b = resumePhone.textContent) === null || _b === void 0 ? void 0 : _b.replace("Phone:", "")) || "";
    document.getElementById("experience").value = resumeExperience.textContent || "";
    document.getElementById("education").value = resumeEducation.textContent || "";
    document.getElementById("skills").value = resumeSkills.textContent || "";
}
downloadPdf.addEventListener("click", () => {
    if (typeof html2pdf === "undefined") {
        alert("Error:html2pdf liberary is not loaded.");
        return;
    }
    const options = {
        margin: 0.5,
        filename: "resume.pdf",
        image: {
            type: "jpg",
            quality: 1.0
        },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };
    // download PDF
    html2pdf()
        .from(resumeContent)
        .set(options)
        .save()
        .catch((error) => {
        console.error("PDF error", error);
    });
});
window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name") || "";
    const email = params.get("email") || "";
    const phone = params.get("phone") || "";
    const education = params.get("education") || "";
    const skills = params.get("skills") || "";
    const experience = params.get("experience") || "";
    if (name || email || phone || education || experience || skills) {
        resumeName.textContent = name;
        resumeEmail.textContent = `Email: ${email}`;
        resumePhone.textContent = `Phone: ${phone}`;
        resumeEducation.textContent = education;
        resumeExperience.textContent = experience;
        resumeSkills.textContent = skills;
        const savePhoto = localStorage.getItem("resumePhoto");
        if (savePhoto) {
            resumePhoto.src = savePhoto;
        }
    }
});
resumePhoto.style.width = "150px"; // Adjust width as per your requirement
resumePhoto.style.height = "150px";
resumePhoto.style.objectFit = "cover";
resumePhoto.style.borderRadius = "50%"; // circular image
resumePhoto.style.display = "block";
resumePhoto.style.margin = "0 auto";
