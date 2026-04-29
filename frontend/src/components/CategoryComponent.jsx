import { useNavigate } from "react-router-dom";

const CATEGORIES = ["Design & Tech", "Film", "Arts", "Games"];

export default function CategoryComponent() {
  const navigate = useNavigate();
  return (
    <div className="category">
      {CATEGORIES.map((cat, idx) => (
        <div
          key={idx}
          className="categoryItem"
          onClick={() => navigate("/discover", { state: { category: idx } })}
        >
          {cat}
        </div>
      ))}
    </div>
  );
}
