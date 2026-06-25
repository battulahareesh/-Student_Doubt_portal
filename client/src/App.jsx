import { useEffect, useMemo, useState } from "react";
import { createDoubt, deleteDoubt, getDoubts, toggleSolved } from "./api.jsx";
import "./App.css";

const topics = [
  "React",
  "Node",
  "Express",
  "MongoDB",
  "Mongoose",
  "Integration",
];

const initialForm = {
  studentName: "",
  topic: "React",
  question: "",
};

function App() {
  // State stores the data React needs to re-render this screen.
  const [doubts, setDoubts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // useMemo recalculates these counts only when the doubts list changes.
  const summary = useMemo(() => {
    const solved = doubts.filter((doubt) => doubt.isSolved).length;
    return {
      total: doubts.length,
      pending: doubts.length - solved,
      solved,
    };
  }, [doubts]);

  async function loadDoubts() {
    try {
      // Fetch the latest records from the Express API.
      setError("");
      setIsLoading(true);
      const data = await getDoubts();
      setDoubts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // This effect runs once when the component first appears on screen.
    let ignore = false;

    async function loadInitialDoubts() {
      try {
        const data = await getDoubts();
        if (!ignore) {
          setDoubts(data);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadInitialDoubts();

    return () => {
      // Prevents state updates if the component unmounts before the API responds.
      ignore = true;
    };
  }, []);

  function updateForm(event) {
    // One handler updates any form field by using the input's name.
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError("");
      setIsSubmitting(true);
      const savedDoubt = await createDoubt(form);
      // Add the saved doubt to the top of the list without refetching everything.
      setDoubts((current) => [savedDoubt, ...current]);
      setForm(initialForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggle(id) {
    try {
      setError("");
      const updatedDoubt = await toggleSolved(id);
      // Replace only the changed doubt, keeping the rest of the list as it is.
      setDoubts((current) =>
        current.map((doubt) => (doubt._id === id ? updatedDoubt : doubt)),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      setError("");
      await deleteDoubt(id);
      // Remove the deleted doubt from local state after the API confirms deletion.
      setDoubts((current) => current.filter((doubt) => doubt._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="app-shell">
      {/* Header area with page title and manual refresh action. */}
      <section className="toolbar">
        <div>
          <p className="eyebrow">MERN Integration Demo</p>
          <h1>Student Doubt Board</h1>
        </div>
        <button type="button" className="secondary-button" onClick={loadDoubts}>
          Refresh
        </button>
      </section>

      {/* Summary values are derived from the doubts array above. */}
      <section className="summary-grid" aria-label="Doubt summary">
        <article>
          <span>Total</span>
          <strong>{summary.total}</strong>
        </article>
        <article>
          <span>Pending</span>
          <strong>{summary.pending}</strong>
        </article>
        <article>
          <span>Solved</span>
          <strong>{summary.solved}</strong>
        </article>
      </section>

      {error ? <p className="status error">{error}</p> : null}

      <section className="workspace">
        {/* Controlled form: each input value comes from React state. */}
        <form className="doubt-form" onSubmit={handleSubmit}>
          <h2>Add a doubt</h2>

          <label>
            Student name
            <input
              name="studentName"
              value={form.studentName}
              onChange={updateForm}
              maxLength="60"
              required
            />
          </label>

          <label>
            Topic
            <select name="topic" value={form.topic} onChange={updateForm}>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </label>

          <label>
            Question
            <textarea
              name="question"
              value={form.question}
              onChange={updateForm}
              maxLength="300"
              rows="5"
              required
            />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save doubt"}
          </button>
        </form>

        <section className="doubt-list" aria-live="polite">
          {/* Render one card for each doubt returned by MongoDB. */}
          <div className="list-heading">
            <h2>Recent doubts</h2>
            <span>{isLoading ? "Loading..." : `${doubts.length} records`}</span>
          </div>

          {!isLoading && doubts.length === 0 ? (
            <p className="empty-state">No doubts added yet.</p>
          ) : null}

          {doubts.map((doubt) => (
            <article className="doubt-card" key={doubt._id}>
              <div className="card-head">
                <div>
                  <span className="topic">{doubt.topic}</span>
                  <h3>{doubt.studentName}</h3>
                </div>
                <span className={doubt.isSolved ? "badge solved" : "badge"}>
                  {doubt.isSolved ? "Solved" : "Pending"}
                </span>
              </div>

              <p>{doubt.question}</p>

              <div className="card-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => handleToggle(doubt._id)}
                >
                  Mark {doubt.isSolved ? "pending" : "solved"}
                </button>
                <button
                  type="button"
                  className="danger-button"
                  onClick={() => handleDelete(doubt._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

export default App;
