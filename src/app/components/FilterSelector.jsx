// src/app/components/SortSelector.jsx

export default function FilterSelector({ filterBy, onChange }) {
  return (
    <div className="mb-4 flex items-center space-x-2">
      <label className="block font-medium font-sans text-my-blue ">Sortér efter:</label>
      <select value={filterBy} onChange={(e) => onChange(e.target.value)} className="p-2 border rounded text-my-blue">
        <option value="artist">Hvid</option>
        <option value="title">Rød</option>
        <option value="year">Sort</option>
      </select>
    </div>
  );
}
