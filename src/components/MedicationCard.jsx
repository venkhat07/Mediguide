export default function MedicationCard({ medicine }) {
  if (!medicine) return null;
  const isString = typeof medicine === 'string';
  const name = isString ? medicine : (medicine.name || 'Prescription Medication');
  const dosage = !isString && medicine.dosage ? medicine.dosage : 'As Prescribed';
  const frequency = !isString && medicine.frequency ? medicine.frequency : 'As Directed';
  const duration = !isString && medicine.duration ? medicine.duration : 'Standard course';
  const explanation = !isString && medicine.explanation ? medicine.explanation : 'Take as advised by your healthcare team.';

  return (
    <div className="med-card">
      <div className="med-name">{name}</div>
      <div className="med-meta">
        <span>Dosage: {dosage}</span>
        <span>Frequency: {frequency}</span>
        <span>Duration: {duration}</span>
      </div>
      <div className="med-explain">{explanation}</div>
    </div>
  );
}
