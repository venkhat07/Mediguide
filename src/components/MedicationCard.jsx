export default function MedicationCard({ medicine }) {
  return (
    <div className="med-card">
      <div className="med-name">{medicine.name}</div>
      <div className="med-meta">
        <span>Dosage: {medicine.dosage}</span>
        <span>Frequency: {medicine.frequency}</span>
        <span>Duration: {medicine.duration}</span>
      </div>
      <div className="med-explain">{medicine.explanation}</div>
    </div>
  );
}
