// src / app / components / SortSelector.jsx;

export default function SortSelector({ sortBy, onChange }) {
  return (
    <div className="mb-4 flex items-center space-x-2">
      <label className="block font-medium font-sans text-my-blue">Sortér efter:</label>
      <select value={sortBy} onChange={(e) => onChange(e.target.value)} className="p-2 border text-my-blue">
        <option value="artist">Kunstnernavn</option>
        <option value="title">Titel</option>
        <option value="year-asc">Ældste først</option>
        <option value="year-desc">Nyeste først</option>
      </select>
    </div>
  );
}
