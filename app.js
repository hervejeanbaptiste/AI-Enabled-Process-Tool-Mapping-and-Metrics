const SAMPLE_PROCESS = {
  name: "Opportunity pursuit process",
  steps: [
    {
      id: "generate",
      title: "Generate",
      subtitle: "Prepare for the Conversation",
      activities: [
        {
          name: "Research account context",
          type: "Begin with in-depth account research to identify the pain points and priorities of your client"
        }
      ],
      tools: [
        { id: "strategy-brief-gpt", name: "Strategy Brief Prompt", category: "Account research", selected: true },
        { id: "copilot", name: "Microsoft Copilot", category: "Brief creation", selected: false },
        { id: "einstein", name: "Salesforce Einstein", category: "CRM context", selected: false }
      ]
    },
    {
      id: "qualify",
      title: "Qualify",
      subtitle: "Qualify the Opportunity",
      activities: [
        {
          name: "Identify opportunity themes",
          type: "Identify holistic opportunities based on their priorities"
        }
      ],
      tools: [
        { id: "opportunity-identification-gpt", name: "Opportunity Identifier", category: "Opportunity synthesis", selected: true },
        { id: "einstein", name: "Salesforce Einstein", category: "Opportunity signals", selected: false },
        { id: "powerbi", name: "Power BI Copilot", category: "Pipeline analytics", selected: false }
      ]
    },
    {
      id: "advance",
      title: "Advance",
      subtitle: "Shape the Solution",
      activities: [
        {
          name: "Define value drivers",
          type: "Discover the metrics that matter to them and align the work we do to the value they want to drive"
        }
      ],
      tools: [
        { id: "value-articulation-gpt", name: "Articulating our Value to Clients", category: "Value narrative", selected: true },
        { id: "copilot", name: "Microsoft Copilot", category: "Solution shaping", selected: false },
        { id: "powerbi", name: "Power BI Copilot", category: "Metric exploration", selected: false }
      ]
    },
    {
      id: "propose",
      title: "Propose",
      subtitle: "Build the Proposal",
      activities: [
        { name: "Refine win strategy", type: "Refine our win strategy" },
        {
          name: "Create demo and proposal",
          type: "Create demos and automated proposals in minutes"
        }
      ],
      tools: [
        { id: "win-strategy-gpt", name: "Win Strategy & Pursuit Coach", category: "Pursuit strategy", selected: true },
        { id: "demo-proposal-gpt", name: "Proposal & Pitch Storyteller", category: "Proposal generation", selected: true },
        { id: "copilot", name: "Microsoft Copilot", category: "Proposal drafting", selected: false },
      ]
    },
    {
      id: "engage",
      title: "Engage",
      subtitle: "Scope & Close",
      activities: [
        {
          name: "Create client-driven SOW",
          type: "Transcribe the conversation with your client and automate the creation of the SOW"
        }
      ],
      tools: [
        { id: "client-driven-sow-gpt", name: "Client Driven SOW Tailor", category: "SOW generation", selected: true },
        { id: "copilot", name: "Microsoft Copilot", category: "Meeting transcript", selected: false },
        { id: "doc-intelligence", name: "Document Intelligence", category: "Document automation", selected: false }
      ]
    }
  ]
};

const GPT_METRICS = {
  "strategy-brief-gpt": {
    messages: 606,
    distinctUsers: 106
  },
  "opportunity-identification-gpt": {
    messages: 289,
    distinctUsers: 38
  },
  "value-articulation-gpt": {
    messages: 505,
    distinctUsers: 48
  },
  "win-strategy-gpt": {
    messages: 347,
    distinctUsers: 45
  },
  "demo-proposal-gpt": {
    messages: 182,
    distinctUsers: 3
  },
  "client-driven-sow-gpt": {
    messages: 109,
    distinctUsers: 26
  }
};

let state = cloneData(SAMPLE_PROCESS);

const elements = {};

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  bindEvents();
  render();
});

function bindElements() {
  ["processName", "resetButton", "stepCount", "activityCount", "selectionCount", "processBoard"].forEach(
    (id) => {
      elements[id] = document.getElementById(id);
    }
  );
}

function bindEvents() {
  elements.processName.addEventListener("input", () => {
    state.name = elements.processName.value;
  });

  elements.resetButton.addEventListener("click", () => {
    state = cloneData(SAMPLE_PROCESS);
    render();
  });
}

function render() {
  elements.processName.value = state.name;
  elements.stepCount.textContent = state.steps.length;
  elements.activityCount.textContent = state.steps.reduce(
    (sum, step) => sum + step.activities.length,
    0
  );
  elements.selectionCount.textContent = state.steps.reduce(
    (sum, step) => sum + step.tools.filter((tool) => tool.selected).length,
    0
  );

  elements.processBoard.innerHTML = `
    <div class="board-label">Step</div>
    ${state.steps.map(renderStepCell).join("")}

    <div class="board-label">Activity</div>
    ${state.steps.map(renderActivityCell).join("")}

    <div class="board-label">AI skill / tool</div>
    ${state.steps.map(renderToolCell).join("")}

    <div class="board-label">Tool metrics</div>
    ${state.steps.map(renderMetricsCell).join("")}
  `;

  elements.processBoard.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      toggleTool(checkbox.dataset.stepId, checkbox.dataset.toolId, checkbox.checked);
    });
  });
}

function renderStepCell(step, index) {
  return `
    <article class="step-cell">
      <span class="step-number">${index + 1}</span>
      <div>
        <h2>${escapeHtml(step.title)}</h2>
        <small>${escapeHtml(step.subtitle)}</small>
      </div>
    </article>
  `;
}

function renderActivityCell(step) {
  return `
    <article class="activity-cell">
      <ul class="activity-list">
        ${step.activities
          .map(
            (activity) => `
              <li class="activity-item">
                <strong>${escapeHtml(activity.name)}</strong>
                <span>${escapeHtml(activity.type)}</span>
              </li>
            `
          )
          .join("")}
      </ul>
    </article>
  `;
}

function renderToolCell(step) {
  return `
    <article class="tool-cell">
      <ul class="tool-list">
        ${step.tools
          .map(
            (tool) => `
              <li>
                <label class="tool-option">
                  <input
                    type="checkbox"
                    data-step-id="${escapeAttribute(step.id)}"
                    data-tool-id="${escapeAttribute(tool.id)}"
                    ${tool.selected ? "checked" : ""}
                  />
                  <span>
                    <strong>${escapeHtml(tool.name)}</strong>
                    <span>${escapeHtml(tool.category)}</span>
                  </span>
                </label>
              </li>
            `
          )
          .join("")}
      </ul>
      <p class="selected-note">${getSelectedToolCount(step)} of ${step.tools.length} selected</p>
    </article>
  `;
}

function renderMetricsCell(step) {
  const gptTools = step.tools.filter((tool) => tool.selected && GPT_METRICS[tool.id]);

  return `
    <article class="metrics-cell">
      ${
        gptTools.length
          ? `<div class="metrics-list">${gptTools.map(renderMetricCard).join("")}</div>`
          : `<div class="metric-empty">Select a GPT to show usage metrics.</div>`
      }
    </article>
  `;
}

function renderMetricCard(tool) {
  const metrics = GPT_METRICS[tool.id];

  return `
    <div class="metric-card">
      <div class="metric-card-heading">
        <strong>${escapeHtml(tool.name)}</strong>
        <span>${escapeHtml(getUsageLevel(metrics))}</span>
      </div>
      <div class="metric-grid">
        <div>
          <b>${formatNumber(metrics.messages)}</b>
          <small>Msgs sent</small>
        </div>
        <div>
          <b>${formatNumber(metrics.distinctUsers)}</b>
          <small>Users</small>
        </div>
        <div>
          <b>${formatDecimal(getMessagesPerUser(metrics))}</b>
          <small>Msgs / user</small>
        </div>
      </div>
    </div>
  `;
}

function toggleTool(stepId, toolId, selected) {
  const step = state.steps.find((item) => item.id === stepId);
  if (!step) return;

  const tool = step.tools.find((item) => item.id === toolId);
  if (!tool) return;

  tool.selected = selected;
  render();
}

function getSelectedToolCount(step) {
  return step.tools.filter((tool) => tool.selected).length;
}

function getMessagesPerUser(metrics) {
  return metrics.distinctUsers ? metrics.messages / metrics.distinctUsers : 0;
}

function getUsageLevel(metrics) {
  if (metrics.messages >= 500 && metrics.distinctUsers >= 25) return "Growing";
  if (metrics.messages >= 100 && metrics.distinctUsers >= 10) return "Sustained";
  return "Initial";
}

function formatNumber(value) {
  return Number(value).toLocaleString();
}

function formatDecimal(value) {
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}
