import React, { useState } from "react";
import Card from "./components/Card";
import Button from "./components/Button";

export default function App() {
  const [ageGroup, setAgeGroup] = useState("");
  const [history, setHistory] = useState([]);
  const [symptoms, setSymptoms] = useState({
    edema: false,
    fatigue: false,
    nausea: false,
    breathlessness: false,
    flankPain: false,
    urineOutput: ""
  });
  const [labs, setLabs] = useState({
    creatinine: "",
    egfr: "",
    proteinuria: "",
    potassium: "",
    hemoglobin: ""
  });
  const [diagnosis, setDiagnosis] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [warnings, setWarnings] = useState([]);

  const handleEvaluate = () => {
    let result = "";
    let suggest = [];
    let meds = [];
    let warns = [];
    const eGFR = parseFloat(labs.egfr);
    const proteinuria = labs.proteinuria;
    const potassium = parseFloat(labs.potassium);
    const hemoglobin = parseFloat(labs.hemoglobin);

    if (eGFR < 60) {
      result = "Chronic Kidney Disease";
      if (eGFR < 15) result += " (Stage G5 - ESRD)";
      else if (eGFR < 30) result += " (Stage G4)";
      else if (eGFR < 45) result += " (Stage G3b)";
      else result += " (Stage G3a)";
      suggest.push("Repeat eGFR in 3 months", "Check urine ACR", "Renal Ultrasound");
      if (!(history.includes("Hyperkalemia"))) {
        meds.push("Start ACEi/ARB if proteinuric");
      }
      meds.push("Avoid NSAIDs");
      if (potassium > 5.5) {
        warns.push("Avoid ACEi/ARB due to hyperkalemia risk");
      }
    }

    if (proteinuria === "Nephrotic Range" && symptoms.edema) {
      result = "Nephrotic Syndrome";
      suggest.push("24h Urine Protein", "Serum Albumin", "Renal Biopsy Evaluation");
      meds.push("Start corticosteroids if minimal change suspected", "Use furosemide for edema");
    }

    if (history.includes("Diabetes") && eGFR < 60 && proteinuria !== "None") {
      result = "Likely Diabetic Nephropathy";
      suggest.push("HbA1c", "Urine ACR", "Ophthalmology referral");
      if (eGFR > 30) meds.push("Use SGLT2 inhibitor");
      else warns.push("Avoid SGLT2 inhibitor (eGFR < 30)");
    }

    if (labs.potassium > 5.5) {
      meds.push("Restrict dietary K+", "Consider patiromer/sodium polystyrene");
      warns.push("Avoid spironolactone and ACEi/ARB due to high K+");
    }

    if (hemoglobin < 10 && eGFR < 45) {
      suggest.push("Evaluate for anemia", "Check iron studies");
      meds.push("Start ESA if iron sufficient");
    }

    if (!result) {
      result = "No clear renal diagnosis";
      suggest.push("Monitor annually", "Ensure proper hydration");
    }

    setDiagnosis(result);
    setSuggestions(suggest);
    setMedications(meds);
    setWarnings(warns);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">NephroGuide</h1>
      <Button onClick={handleEvaluate}>Evaluate</Button>

      {diagnosis && (
        <Card>
          <p><strong>Diagnosis:</strong> {diagnosis}</p>
          {suggestions.length > 0 && (
            <>
              <strong>Recommendations:</strong>
              <ul>{suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </>
          )}
          {medications.length > 0 && (
            <>
              <strong>Medications:</strong>
              <ul>{medications.map((m, i) => <li key={i}>{m}</li>)}</ul>
            </>
          )}
          {warnings.length > 0 && (
            <>
              <strong className="text-red-600">Warnings:</strong>
              <ul className="text-red-600">{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </>
          )}
        </Card>
      )}
    </div>
  );
}