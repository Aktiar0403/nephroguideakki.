import React, { useState } from "react";
import Select from "react-select";
import Accordion from "./components/Accordion";
import Button from "./components/Button";

export default function App() {
  const [patientProfile, setPatientProfile] = useState({
    name: "",
    age: "",
    gender: "",
    location: ""
  });

  const [medicalHistory, setMedicalHistory] = useState({
    diabetes: false,
    hypertension: false,
    diabetesDuration: "",
    hypertensionDuration: "",
    nsaidUse: false,
    pastStoneDisease: false,
    familyCKD: false,
    tb: false,
    hiv: false,
    hepatitis: false
  });

  const [symptoms, setSymptoms] = useState({
    edema: false,
    fatigue: false,
    nausea: false,
    vomiting: false,
    breathlessness: false,
    decreasedUrineOutput: false,
    flankPain: false,
    hematuria: false
  });

  const [physicalExam, setPhysicalExam] = useState({
    sbp: "",
    dbp: "",
    weight: "",
    volumeStatus: ""
  });

  const [labs, setLabs] = useState({
    creatinine: "",
    egfr: "",
    potassium: "",
    hemoglobin: "",
    urinalysisProtein: "",
    urinalysisBlood: "",
    acr: "",
    spotProteinCreatinine: "",
    urineProtein24h: ""
  });

  const [imaging, setImaging] = useState({
    ultrasoundFindings: "",
    notes: ""
  });

  const [takingMedicines, setTakingMedicines] = useState(false);
  const [medicinesList, setMedicinesList] = useState([
    { name: "", duration: "" }
  ]);

  const [diagnosis, setDiagnosis] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [patientSummary, setPatientSummary] = useState("");

  const medicineOptions = [
    {
      label: "🩺 Hypertension Medicines",
      options: [
        { value: "Enalapril", label: "Enalapril (ACEi)" },
        { value: "Ramipril", label: "Ramipril (ACEi)" },
        { value: "Lisinopril", label: "Lisinopril (ACEi)" },
        { value: "Losartan", label: "Losartan (ARB)" },
        { value: "Valsartan", label: "Valsartan (ARB)" },
        { value: "Amlodipine", label: "Amlodipine (CCB)" },
        { value: "Nifedipine", label: "Nifedipine (CCB)" },
        { value: "Hydrochlorothiazide", label: "Hydrochlorothiazide (Thiazide)" },
        { value: "Chlorthalidone", label: "Chlorthalidone (Thiazide)" },
        { value: "Furosemide", label: "Furosemide (Loop Diuretic)" },
        { value: "Spironolactone", label: "Spironolactone (Aldosterone Antagonist)" }
      ],
    },
{
      label: "🩹 Diabetes Medicines",
      options: [
        { value: "Metformin", label: "Metformin" },
        { value: "Glimepiride", label: "Glimepiride" },
        { value: "Insulin", label: "Insulin" },
        { value: "SGLT2 Inhibitor", label: "SGLT2 Inhibitor (e.g. Empagliflozin)" },
        { value: "DPP4 Inhibitor", label: "DPP4 Inhibitor (e.g. Sitagliptin)" },
        { value: "GLP1 Agonist", label: "GLP1 Agonist (e.g. Liraglutide)" }
      ],
    },
    {
      label: "💊 Painkillers (NSAIDs etc.)",
      options: [
        { value: "Ibuprofen", label: "Ibuprofen (⚠️ Avoid in CKD)" },
        { value: "Diclofenac", label: "Diclofenac (⚠️ Avoid in CKD)" },
        { value: "Indomethacin", label: "Indomethacin (⚠️ Avoid in CKD)" },
        { value: "Paracetamol", label: "Paracetamol (Safe)" },
        { value: "Tramadol", label: "Tramadol (Use with caution)" }
      ],
    },
    {
      label: "⚠️ Kidney-impacting Medicines",
      options: [
        { value: "PPI", label: "PPI (Omeprazole, Pantoprazole)" },
        { value: "NSAIDs", label: "NSAIDs (e.g. Ibuprofen, Diclofenac)" },
        { value: "Aminoglycosides", label: "Aminoglycosides (Gentamicin, Amikacin)" },
        { value: "Vancomycin", label: "Vancomycin" },
        { value: "Tenofovir", label: "Tenofovir" },
        { value: "Cisplatin", label: "Cisplatin (Nephrotoxic Chemo)" },
        { value: "Contrast Dye", label: "Contrast Dye (IV Contrast)" }
      ],
    },
    {
      label: "Other / Supportive",
      options: [
        { value: "Potassium Binder", label: "Potassium Binder" },
        { value: "Calcium Channel Blocker", label: "Calcium Channel Blocker" },
        { value: "Statin", label: "Statin" },
        { value: "Phosphate Binder", label: "Phosphate Binder" },
        { value: "Other", label: "Other" }
      ],
    },
  ];

// ---------------------------
  // Diagnostic Logic
  function askAkI() {
    let result = "";
    let suggest = [];
    let meds = [];
    let warns = [];

    const eGFR = parseFloat(labs.egfr);
    const proteinuria = parseFloat(labs.urineProtein24h);
    const potassium = parseFloat(labs.potassium);
    const hemoglobin = parseFloat(labs.hemoglobin);
    const acr = parseFloat(labs.acr);

    if (!isNaN(eGFR)) {
      if (eGFR >= 90) result = "Normal Kidney Function";
      else if (eGFR >= 60) result = "Mildly Reduced Function (Stage 2)";
      else if (eGFR >= 45) result = "CKD Stage 3a";
      else if (eGFR >= 30) result = "CKD Stage 3b";
      else if (eGFR >= 15) result = "CKD Stage 4";
      else result = "CKD Stage 5 (ESRD)";

      if (eGFR < 60) {
        suggest.push(
          "Regular eGFR monitoring every 3–6 months",
          "Avoid nephrotoxins",
          "Assess blood pressure control"
        );
      }
    }

    if (proteinuria > 3500 && symptoms.edema) {
      result = "Possible Nephrotic Syndrome";
      suggest.push(
        "Check serum albumin",
        "Consider renal biopsy if unexplained",
        "Manage edema with diuretics"
      );
      meds.push("Loop diuretic for edema");
    }

    if (medicalHistory.diabetes && eGFR < 60 && (acr > 30 || proteinuria > 150)) {
      result = "Likely Diabetic Kidney Disease";
      suggest.push(
        "Tight glucose control",
        "Annual ACR monitoring",
        "Eye screening for retinopathy"
      );
      if (eGFR >= 30 && potassium <= 5.5) {
        meds.push("ACEi/ARB if potassium normal");
      } else if (potassium > 5.5) {
        warns.push("Avoid ACEi/ARB due to hyperkalemia risk");
      }
    }

    if (medicalHistory.hypertension && eGFR < 60 && proteinuria < 1000) {
      result = "Possible Hypertensive Nephrosclerosis";
      suggest.push(
        "Optimize BP to <130/80",
        "Regular urinalysis monitoring"
      );
      meds.push("ACEi/ARB if potassium normal");
    }
if (potassium > 5.5) {
      warns.push(
        "Hyperkalemia detected: recommend dietary K+ restriction and review medications"
      );
      meds.push("Consider potassium binders if persistent");
    }

    if (hemoglobin < 10 && eGFR < 45) {
      suggest.push(
        "Check iron studies",
        "Consider erythropoiesis-stimulating agents if iron replete"
      );
    }

    meds.push("Avoid NSAIDs");

    if (imaging.ultrasoundFindings) {
      switch (imaging.ultrasoundFindings) {
        case "Increased echogenicity":
        case "Small shrunken kidneys":
          result = result || "Chronic Kidney Disease (Ultrasound suggestive)";
          suggest.push("Chronic structural changes noted on ultrasound");
          break;
        case "Hydronephrosis":
          result = result || "Possible Obstructive Uropathy";
          suggest.push("Consider further imaging (CT/IVP)", "Assess for urinary obstruction");
          break;
        case "Asymmetry (one small)":
          suggest.push("Possible reflux nephropathy or chronic vascular disease");
          break;
        case "Cystic disease":
          result = result || "Possible Polycystic Kidney Disease";
          suggest.push("Consider family history, genetic counseling");
          break;
        case "Obstructive calculi":
          result = result || "Possible Obstructive Nephropathy (Stones)";
          suggest.push("Assess for hydronephrosis", "Consider urological referral");
          break;
        default:
          break;
      }
    }

    setDiagnosis(result);
    setSuggestions(suggest);
    setMedications(meds);
    setWarnings(warns);
  }

  // ---------------------------
  // Patient Summary
  function generatePatientSummary() {
    const historyItems = Object.entries(medicalHistory)
      .filter(([k, v]) => v === true || (typeof v === "string" && v.trim() !== ""))
      .map(([k, v]) =>
        typeof v === "boolean" ? `${k.replace(/([A-Z])/g, " $1")}` : `${k.replace(/([A-Z])/g, " $1")}: ${v}`
      )
      .join("\n");

    const symptomItems = Object.entries(symptoms)
      .filter(([k, v]) => v === true)
      .map(([k]) => k.replace(/([A-Z])/g, " $1"))
      .join("\n");

    const labItems = Object.entries(labs)
      .filter(([_, v]) => v.trim() !== "")
      .map(([k, v]) => `${k.replace(/([A-Z])/g, " $1")}: ${v}`)
      .join("\n");

    const medicinesItems = takingMedicines
      ? medicinesList
          .filter(m => m.name || m.duration)
          .map(m => `- ${m.name} (${m.duration})`)
          .join("\n")
      : "No current medicines";

    let summary = `👤 Patient Profile
Name: ${patientProfile.name}
Age: ${patientProfile.age}
Gender: ${patientProfile.gender}
Location: ${patientProfile.location}

🩺 Medical History
${historyItems || "No significant history"}

💊 Current Medicines
${medicinesItems}

🩹 Symptoms
${symptomItems || "No reported symptoms"}

🧪 Lab Results
${labItems || "No lab results entered"}

🖼️ Imaging
Ultrasound Findings: ${imaging.ultrasoundFindings || "Not provided"}
Additional Notes: ${imaging.notes || "None"}

🧭
Determine the medical condition, diagnose, prescribe medicine and suggest further tests if required.
`;

    setPatientSummary(summary);
  }

  function copySummary() {
    navigator.clipboard.writeText(patientSummary);
    alert("Patient data copied to clipboard!");
  }

  function openChatGPTWithSummary() {
    if (!patientSummary) {
      alert("Please generate the patient summary first!");
      return;
    }
    const encoded = encodeURIComponent(patientSummary);
    const chatURL = `https://chat.openai.com/?prompt=${encoded}`;
    window.open(chatURL, "_blank");
  }
}

export default App;