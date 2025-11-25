const projectStatus = {
  PENDING: { description: "Pending Execution" },
  SUCCESS: { description: "Executed Successfully" },
  FAILURE: { description: "Execution Failed" }
};

class ProjectIdea {
  constructor(title, description) {
    this.title = title;
    this.description = description;
    this.status = projectStatus.PENDING;
  }
  updateProjectStatus(newStatus) {
    this.status = newStatus;
  }
}

class ProjectIdeaBoard {
  constructor(title) {
    this.title = title;
    this.ideas = [];
  }
  pin(projectIdea) {
    this.ideas.push(projectIdea);
  }
  unpin(projectIdea) {
    const index = this.ideas.indexOf(projectIdea);
    if (index !== -1) {
      this.ideas.splice(index, 1);
    }
  }
  count() {
    return this.ideas.length;
  }
  formatToString() {
    let result = `${this.title} has ${this.count()} idea(s)
`;
    this.ideas.forEach((idea) => {
      result += `${idea.title} (${idea.status.description}) - ${idea.description}
`;
    });
    return result;
  }
}

// Initialize a board with a title
const board = new ProjectIdeaBoard("My Project Idea Board");

// DOM elements
const ideaForm = document.getElementById("ideaForm");
const titleInput = document.getElementById("titleInput");
const descInput = document.getElementById("descInput");
const ideasList = document.getElementById("ideasList");
const showFormattedBtn = document.getElementById("showFormattedBtn");
const formattedOutput = document.getElementById("formattedOutput");

// Render project ideas pinned on board
function renderIdeas() {
  ideasList.innerHTML = "";
  board.ideas.forEach((idea) => {
    const div = document.createElement("div");
    div.className = "idea-item";

    const infoDiv = document.createElement("div");
    infoDiv.className = "idea-info";
    const titleSpan = document.createElement("span");
    titleSpan.className = "idea-title";
    titleSpan.textContent = idea.title;
    const statusSpan = document.createElement("span");
    statusSpan.className = "idea-status";
    statusSpan.textContent = `(${idea.status.description})`;

    const descP = document.createElement("p");
    descP.className = "idea-desc";
    descP.textContent = idea.description;

    infoDiv.appendChild(titleSpan);
    infoDiv.appendChild(statusSpan);
    infoDiv.appendChild(descP);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "idea-actions";

    // Status selector dropdown
    const statusSelect = document.createElement("select");
    Object.entries(projectStatus).forEach(([key, val]) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = val.description;
      if (idea.status === val) option.selected = true;
      statusSelect.appendChild(option);
    });
    statusSelect.addEventListener("change", () => {
      idea.updateProjectStatus(projectStatus[statusSelect.value]);
      renderIdeas();
    });

    // Unpin button
    const unpinBtn = document.createElement("button");
    unpinBtn.className = "unpin-btn";
    unpinBtn.textContent = "Unpin";
    unpinBtn.addEventListener("click", () => {
      board.unpin(idea);
      renderIdeas();
      formattedOutput.textContent = "";
    });

    actionsDiv.appendChild(statusSelect);
    actionsDiv.appendChild(unpinBtn);

    div.appendChild(infoDiv);
    div.appendChild(actionsDiv);
    ideasList.appendChild(div);
  });

  if (board.count() === 0) {
    ideasList.textContent = "No project ideas pinned.";
  }
}

// Add new project idea on form submit
ideaForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  if (title && description) {
    const newIdea = new ProjectIdea(title, description);
    board.pin(newIdea);
    renderIdeas();
    ideaForm.reset();
    formattedOutput.textContent = "";
  }
});

// Show formatted string output of the board
showFormattedBtn.addEventListener("click", () => {
  formattedOutput.textContent = board.formatToString();
});

// Initial Render
renderIdeas();
