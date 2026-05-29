import { useState } from "react";

const FILTERS = ["All", "Active", "Completed"];

const PRIORITIES = {
  high: { label: "High", color: "#e05252", bg: "#fff0f0" },
  medium: { label: "Medium", color: "#d97706", bg: "#fffbeb" },
  low: { label: "Low", color: "#16a34a", bg: "#f0fdf4" },
};

let nextId = 1;
function generateId() { return nextId++; }

export default function TodoApp() {
  const [todos, setTodos] = useState([
    { id: generateId(), text: "Setup Vagrant & VirtualBox", completed: true, priority: "high" },
    { id: generateId(), text: "Deploy vProfile project", completed: false, priority: "high" },
    { id: generateId(), text: "Belajar Docker basics", completed: false, priority: "medium" },
    { id: generateId(), text: "Upload project ke GitHub", completed: false, priority: "low" },
  ]);

  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const filtered = todos.filter((t) => {
    if (filter === "Active") return !t.completed;
    if (filter === "Completed") return t.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const progress = todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);

  function addTodo() {
    if (!input.trim()) return;
    setTodos([...todos, { id: generateId(), text: input.trim(), completed: false, priority }]);
    setInput("");
    setPriority("medium");
  }

  function toggleTodo(id) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function deleteTodo(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  function startEdit(todo) {
    setEditId(todo.id);
    setEditText(todo.text);
  }

  function saveEdit(id) {
    if (!editText.trim()) return;
    setTodos(todos.map((t) => (t.id === id ? { ...t, text: editText.trim() } : t)));
    setEditId(null);
  }

  function clearCompleted() {
    setTodos(todos.filter((t) => !t.completed));
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Tasks</h1>
            <p style={styles.subtitle}>{completedCount} of {todos.length} completed</p>
          </div>
          <div>
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke="#f0f0f0" strokeWidth="5" />
              <circle cx="28" cy="28" r="22" fill="none" stroke="#4f46e5" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress / 100)}`}
                strokeLinecap="round" transform="rotate(-90 28 28)"
                style={{ transition: "stroke-dashoffset 0.5s ease" }} />
              <text x="28" y="33" textAnchor="middle" fontSize="12" fontWeight="600" fill="#4f46e5">{progress}%</text>
            </svg>
          </div>
        </div>

        <div style={styles.inputRow}>
          <input style={styles.input} placeholder="Add a new task..."
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()} />
          <select style={styles.select} value={priority} onChange={(e) => setPriority(e.target.value)}>
            {Object.entries(PRIORITIES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <button style={styles.addBtn} onClick={addTodo}>+ Add</button>
        </div>

        <div style={styles.filterRow}>
          {FILTERS.map((f) => (
            <button key={f}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {}) }}
              onClick={() => setFilter(f)}>
              {f} <span style={{ ...styles.badge, ...(filter === f ? styles.badgeActive : {}) }}>
                {f === "All" ? todos.length : f === "Active" ? todos.filter(t => !t.completed).length : todos.filter(t => t.completed).length}
              </span>
            </button>
          ))}
          {completedCount > 0 && (
            <button style={styles.clearBtn} onClick={clearCompleted}>Clear done</button>
          )}
        </div>

        <div style={styles.list}>
          {filtered.length === 0 && (
            <div style={styles.empty}>
              <p style={styles.emptyText}>No tasks here!</p>
            </div>
          )}
          {filtered.map((todo) => (
            <div key={todo.id} style={{ ...styles.todoItem, ...(todo.completed ? styles.todoCompleted : {}) }}>
              <button style={{ ...styles.checkbox, ...(todo.completed ? styles.checkboxChecked : {}) }}
                onClick={() => toggleTodo(todo.id)}>
                {todo.completed && <span style={styles.checkmark}>✓</span>}
              </button>
              <div style={styles.todoBody}>
                {editId === todo.id ? (
                  <input style={styles.editInput} value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveEdit(todo.id); if (e.key === "Escape") setEditId(null); }}
                    autoFocus />
                ) : (
                  <span style={{ ...styles.todoText, ...(todo.completed ? styles.strikethrough : {}) }}>
                    {todo.text}
                  </span>
                )}
                <span style={{ ...styles.priorityTag, color: PRIORITIES[todo.priority].color, background: PRIORITIES[todo.priority].bg }}>
                  {PRIORITIES[todo.priority].label}
                </span>
              </div>
              <div style={styles.actions}>
                {editId === todo.id ? (
                  <button style={styles.saveBtn} onClick={() => saveEdit(todo.id)}>Save</button>
                ) : (
                  <button style={styles.iconBtn} onClick={() => startEdit(todo)}>✎</button>
                )}
                <button style={{ ...styles.iconBtn, color: "#e05252" }} onClick={() => deleteTodo(todo.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {todos.length > 0 && (
          <div style={styles.footer}>
            <span style={styles.footerText}>{todos.filter(t => !t.completed).length} tasks remaining</span>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px", fontFamily: "'Georgia', serif" },
  card: { background: "#fff", borderRadius: "20px", boxShadow: "0 8px 40px rgba(79,70,229,0.12)", padding: "32px", width: "100%", maxWidth: "540px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  title: { fontSize: "28px", fontWeight: "700", color: "#1e1b4b", margin: 0 },
  subtitle: { fontSize: "14px", color: "#6b7280", margin: "4px 0 0" },
  inputRow: { display: "flex", gap: "8px", marginBottom: "20px" },
  input: { flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", fontFamily: "inherit", color: "#1e1b4b", background: "#fafafa", minWidth: 0 },
  select: { padding: "10px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "13px", background: "#fafafa", color: "#374151", cursor: "pointer", outline: "none" },
  addBtn: { padding: "10px 18px", borderRadius: "10px", background: "#4f46e5", color: "#fff", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  filterRow: { display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" },
  filterBtn: { padding: "6px 14px", borderRadius: "20px", border: "1.5px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "inherit" },
  filterBtnActive: { background: "#4f46e5", color: "#fff", border: "1.5px solid #4f46e5", fontWeight: "600" },
  badge: { background: "#f3f4f6", color: "#6b7280", borderRadius: "10px", padding: "1px 7px", fontSize: "11px", fontWeight: "600" },
  badgeActive: { background: "rgba(255,255,255,0.25)", color: "#fff" },
  clearBtn: { marginLeft: "auto", padding: "6px 12px", borderRadius: "20px", border: "1.5px solid #fecaca", background: "#fff", color: "#e05252", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" },
  list: { display: "flex", flexDirection: "column", gap: "8px", minHeight: "60px" },
  empty: { textAlign: "center", padding: "40px 0" },
  emptyText: { color: "#9ca3af", fontSize: "14px", margin: 0 },
  todoItem: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "12px", border: "1.5px solid #f3f4f6", background: "#fafafa" },
  todoCompleted: { opacity: 0.7 },
  checkbox: { width: "22px", height: "22px", borderRadius: "6px", border: "2px solid #d1d5db", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0 },
  checkboxChecked: { background: "#4f46e5", border: "2px solid #4f46e5" },
  checkmark: { color: "#fff", fontSize: "13px", fontWeight: "700", lineHeight: 1 },
  todoBody: { flex: 1, display: "flex", alignItems: "center", gap: "8px", minWidth: 0, flexWrap: "wrap" },
  todoText: { fontSize: "14px", color: "#1e1b4b", lineHeight: 1.4, wordBreak: "break-word" },
  strikethrough: { textDecoration: "line-through", color: "#9ca3af" },
  priorityTag: { fontSize: "11px", padding: "2px 8px", borderRadius: "8px", fontWeight: "600", whiteSpace: "nowrap" },
  editInput: { flex: 1, padding: "4px 8px", borderRadius: "6px", border: "1.5px solid #4f46e5", fontSize: "14px", outline: "none", fontFamily: "inherit", color: "#1e1b4b", minWidth: "80px" },
  actions: { display: "flex", gap: "4px", flexShrink: 0 },
  iconBtn: { width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "transparent", cursor: "pointer", fontSize: "14px", color: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 },
  saveBtn: { padding: "4px 10px", borderRadius: "6px", background: "#4f46e5", color: "#fff", border: "none", fontSize: "12px", fontWeight: "600", cursor: "pointer" },
  footer: { marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #f3f4f6", textAlign: "center" },
  footerText: { fontSize: "13px", color: "#9ca3af" },
};
