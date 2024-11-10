declare const html2pdf: any;

const form = document.getElementById("resume-form") as HTMLFormElement;
const resumePage = document.getElementById("resumePage") as HTMLElement;
const resumePhoto = document.getElementById("resumePhoto") as HTMLImageElement;
const resumeName = document.getElementById("resumeName") as HTMLHeadingElement;
const resumeEmail = document.getElementById(
  "resumeEmail"
) as HTMLHeadingElement;
const resumePhone = document.getElementById(
  "resumePhone"
) as HTMLHeadingElement;
const resumeEducation = document.getElementById(
  "resumeEducation"
) as HTMLHeadingElement;
const resumeExperience = document.getElementById(
  "resumeExperience"
) as HTMLHeadingElement;
const resumeSkills = document.getElementById(
  "resumeSkills"
) as HTMLHeadingElement;
const editButton = document.getElementById("editButton") as HTMLButtonElement;
const backButton = document.getElementById("backButton") as HTMLButtonElement;
const shareLinkButton = document.getElementById(
  "shareLinkButton"
) as HTMLButtonElement;
const downloadPdf = document.getElementById(
  "download-pdf"
) as HTMLButtonElement;
const resumeContent = document.getElementById(
  "resumeContent"
) as HTMLDivElement;

// Form submission

form.addEventListener("submit", async (event: Event) => {
  event.preventDefault(); // prevent page reload

  //  Collect input values
  const name = (document.getElementById("name") as HTMLInputElement).value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const phone = (document.getElementById("phone") as HTMLInputElement).value;
  const education = (document.getElementById("education") as HTMLInputElement)
    .value;
  const experience = (document.getElementById("experience") as HTMLInputElement)
    .value;
  const skills = (document.getElementById("skills") as HTMLInputElement).value;
  const photoInput = document.getElementById("photo") as HTMLInputElement;

  const photoFile = photoInput.files ? photoInput.files[0] : null;
  let photoBase64 = "";

  if (photoFile) {
    photoBase64 = await fileToBase64(photoFile);

    localStorage.setItem("resumePhoto", photoBase64);
    resumePhoto.src = photoBase64;
  }

  //  Generate Dynamically Resume content

  document.querySelector(".container")?.classList.add("hidden");
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
    skills: skills,
  });

  const url = `${window.location.origin}? ${querParams.toString()}`;
  shareLinkButton.addEventListener("click", () => {
    navigator.clipboard.writeText(url);
    alert("Link is copied");
  });

  window.history.replaceState(null, "", `${querParams.toString()}`);
});

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Edit button functionality added
editButton.addEventListener("click", () => {
  updateResumeForm();

  document.querySelector(".container")?.classList.remove("hidden");
  resumePage.classList.add("hidden");
});

// Update Resume Form
function updateResumeForm() {
  (document.getElementById("name") as HTMLInputElement).value =
    resumeName.textContent || "";
  (document.getElementById("email") as HTMLInputElement).value =
    resumeEmail.textContent?.replace("Email:", "") || "";
  (document.getElementById("phone") as HTMLInputElement).value =
    resumePhone.textContent?.replace("Phone:", "") || "";
  (document.getElementById("experience") as HTMLInputElement).value =
    resumeExperience.textContent || "";
  (document.getElementById("education") as HTMLInputElement).value =
    resumeEducation.textContent || "";
  (document.getElementById("skills") as HTMLInputElement).value =
    resumeSkills.textContent || "";
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
      quality: 1.0,
    },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  // download PDF
  html2pdf()
    .from(resumeContent)
    .set(options)
    .save()
    .catch((error: Error) => {
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
