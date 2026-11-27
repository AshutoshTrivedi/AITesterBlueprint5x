import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function PlanDocument({ text }) {
  const lines = text.split("\n");
  const nodes = [];

  function renderInline(value) {
    const parts = [];
    const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    let last = 0;
    let match;

    while ((match = pattern.exec(value)) !== null) {
      if (match.index > last) parts.push(value.slice(last, match.index));
      const token = match[0];
      if (token.startsWith("**")) {
        parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
      } else if (token.startsWith("`")) {
        parts.push(<code key={match.index}>{token.slice(1, -1)}</code>);
      } else {
        const link = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
        parts.push(
          <a key={match.index} href={link?.[2]} target="_blank" rel="noreferrer">
            {link?.[1]}
          </a>
        );
      }
      last = pattern.lastIndex;
    }
    if (last < value.length) parts.push(value.slice(last));
    return parts;
  }

  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }
    if (line === "---") {
      nodes.push(<hr key={`hr-${index}`} />);
      index += 1;
      continue;
    }
    if (line.startsWith("|") && line.endsWith("|") && lines[index + 1]?.includes("|---")) {
      const headers = line.slice(1, -1).split("|").map((value) => value.trim());
      const rows = [];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(lines[index].trim().slice(1, -1).split("|").map((value) => value.trim()));
        index += 1;
      }
      nodes.push(
        <div className="table-wrap" key={`table-${index}`}>
          <table>
            <thead><tr>{headers.map((header, headerIndex) => <th key={headerIndex}>{header}</th>)}</tr></thead>
            <tbody>{rows.map((row, rowIndex) => (
              <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
            ))}</tbody>
          </table>
        </div>
      );
      continue;
    }
    if (line.startsWith("# ")) {
      nodes.push(<h1 key={`h1-${index}`}>{renderInline(line.slice(2))}</h1>);
      index += 1;
      continue;
    }
    if (/^## /.test(line)) {
      const title = line.slice(3);
      const sectionLines = [];
      index += 1;

      while (index < lines.length && !/^## /.test(lines[index].trim()) && lines[index].trim() !== "---") {
        sectionLines.push(lines[index]);
        index += 1;
      }

      const sectionNodes = [];
      for (let sectionIndex = 0; sectionIndex < sectionLines.length;) {
        const sectionLine = sectionLines[sectionIndex].trim();
        if (!sectionLine) {
          sectionIndex += 1;
          continue;
        }
        if (sectionLine.startsWith("|") && sectionLine.endsWith("|") && sectionLines[sectionIndex + 1]?.includes("|---")) {
          const headers = sectionLine.slice(1, -1).split("|").map((value) => value.trim());
          const rows = [];
          sectionIndex += 2;
          while (sectionIndex < sectionLines.length && sectionLines[sectionIndex].trim().startsWith("|")) {
            rows.push(sectionLines[sectionIndex].trim().slice(1, -1).split("|").map((value) => value.trim()));
            sectionIndex += 1;
          }
          sectionNodes.push(
            <div className="table-wrap" key={`section-table-${sectionIndex}`}>
              <table>
                <thead><tr>{headers.map((header, headerIndex) => <th key={headerIndex}>{renderInline(header)}</th>)}</tr></thead>
                <tbody>{rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{renderInline(cell)}</td>)}</tr>
                ))}</tbody>
              </table>
            </div>
          );
          continue;
        }
        if (sectionLine.startsWith("- ")) {
          const items = [];
          while (sectionIndex < sectionLines.length && sectionLines[sectionIndex].trim().startsWith("- ")) {
            items.push(sectionLines[sectionIndex].trim().slice(2));
            sectionIndex += 1;
          }
          sectionNodes.push(<ul className="section-list" key={`section-ul-${sectionIndex}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ul>);
          continue;
        }
        if (/^\d+\.\s/.test(sectionLine)) {
          const items = [];
          while (sectionIndex < sectionLines.length && /^\d+\.\s/.test(sectionLines[sectionIndex].trim())) {
            items.push(sectionLines[sectionIndex].trim().replace(/^\d+\.\s/, ""));
            sectionIndex += 1;
          }
          sectionNodes.push(<ol className="section-list" key={`section-ol-${sectionIndex}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ol>);
          continue;
        }
        if (sectionLine.startsWith("> ")) {
          sectionNodes.push(<blockquote key={`section-quote-${sectionIndex}`}>{renderInline(sectionLine.slice(2))}</blockquote>);
          sectionIndex += 1;
          continue;
        }
        sectionNodes.push(<p key={`section-p-${sectionIndex}`}>{renderInline(sectionLine)}</p>);
        sectionIndex += 1;
      }

      const numberMatch = title.match(/^(\d+)\.\s*(.*)$/);
      const sectionNumber = numberMatch?.[1];
      const sectionTitle = numberMatch?.[2] || title;
      nodes.push(
        <section className="plan-section" key={`section-${title}-${index}`}>
          <header className="plan-section-header">
            {sectionNumber && <span className="section-number">{sectionNumber}</span>}
            <h2>{renderInline(sectionTitle)}</h2>
          </header>
          <div className="plan-section-body">{sectionNodes}</div>
        </section>
      );
      continue;
    }
    if (line.startsWith("> ")) {
      nodes.push(<blockquote key={`quote-${index}`}>{renderInline(line.slice(2))}</blockquote>);
      index += 1;
      continue;
    }
    if (line.startsWith("- ")) {
      const items = [];
      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(lines[index].trim().slice(2));
        index += 1;
      }
      nodes.push(<ul key={`ul-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ul>);
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s/, ""));
        index += 1;
      }
      nodes.push(<ol key={`ol-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ol>);
      continue;
    }
    nodes.push(<p key={`p-${index}`}>{renderInline(line)}</p>);
    index += 1;
  }

  return <article className="plan-document">{nodes}</article>;
}

function App() {
  const [issueId, setIssueId] = useState("");
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("");
  const [settings, setSettings] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [groqKey, setGroqKey] = useState("");
  const [config, setConfig] = useState({ jira: false, groq: false });

  useEffect(() => {
    fetch("/api/config/status").then((r) => r.json()).then(setConfig).catch(() => {});
  }, []);

  async function generate(event) {
    event.preventDefault();
    if (!issueId.trim() || status === "loading") return;
    setStatus("loading");
    setPlan("");
    try {
      const response = await fetch("/api/test-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to generate the test plan.");
      setPlan(data.plan);
      setStatus("success");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function testJira() {
    setStatus("loading");
    try {
      const response = await fetch("/api/settings/test-jira", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl, email, token })
      });
      const data = await response.json();
      setStatus(response.ok && data.ok ? "Jira connection successful." : data.error || "Jira connection failed.");
    } catch {
      setStatus("Unable to test the Jira connection.");
    }
  }

  return (
    <main className="shell">
      <nav>
        <button className={!settings ? "active" : ""} onClick={() => setSettings(false)}>Main page</button>
        <button className={settings ? "active" : ""} onClick={() => setSettings(true)}>Settings</button>
      </nav>
      {!settings ? (
        <section className="main-grid">
          <div className="card reply-card">
            <h2>Reply with Test Plan</h2>
            {status === "loading" && <p className="state">Loading...</p>}
            {status && status !== "loading" && status !== "success" && <p className="state error">{status}</p>}
            {plan ? <PlanDocument text={plan} /> : <div className="empty">Enter a Jira ticket ID to generate a draft test plan.</div>}
          </div>
          <form className="prompt-card" onSubmit={generate}>
            <label htmlFor="issueId">Prompt (JIRA Ticket)</label>
            <input id="issueId" value={issueId} onChange={(e) => setIssueId(e.target.value)} placeholder="QA-123" />
            <button type="submit" disabled={status === "loading"}>Generate Test Plan</button>
          </form>
        </section>
      ) : (
        <section className="settings-grid">
          <div className="card">
            <h2>Jira Connection</h2>
            <label>Token<input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder={config.jira ? "Configured on server" : ""} /></label>
            <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={config.jira ? "Configured on server" : ""} /></label>
            <label>URL<input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://company.atlassian.net" /></label>
            <button onClick={testJira}>Test Connection</button>
          </div>
          <div className="card">
            <h2>LLM Configuration</h2>
            <label>Groq API Key<input type="password" value={groqKey} onChange={(e) => setGroqKey(e.target.value)} placeholder={config.groq ? "Configured on server" : ""} /></label>
            <p className="state">{config.groq ? "Groq connection configured." : "Groq configuration missing."}</p>
          </div>
        </section>
      )}
    </main>
  );
}

const rootContainer = document.getElementById("root");
const existingRoot = globalThis.__testPlanRoot;
const root = existingRoot || createRoot(rootContainer);
globalThis.__testPlanRoot = root;
root.render(<App />);
