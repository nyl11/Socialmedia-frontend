
import './SortToggle.css';

const SortToggle = ({ sortBy, setSortBy }) => {
  return (
    <div className="sort-toggle">
      <button 
        onClick={() => setSortBy('new')}
        className={`sort-button ${sortBy === 'new' ? 'active' : ''}`}
      >
        Newest
      </button>

      <button
        onClick={() => setSortBy('top')}
        className={`sort-button ${sortBy === 'top' ? 'active' : ''}`}
      >
        Top Ranked
      </button>
    </div>
  );
};

export default SortToggle;
