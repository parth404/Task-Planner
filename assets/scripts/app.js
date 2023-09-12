class DOMHelper {
  static clearEventListeners(element) {
    const clonedElement = element.cloneNode(true);
    // Ditch existing event listners for garbage collected
    element.replaceWith(clonedElement);
    return clonedElement;
  }

  static moveElement(elementId, newPositionSelector) {
    const element = document.getElementById(elementId);
    const destinationElement = document.querySelector(newPositionSelector);
    destinationElement.append(element);
  }
}

class Tooltip {
  constructor(closeModalFn) {
    this.closeModal = closeModalFn;
  }

  closeToolTip() {
    this.hide();
    this.closeModal();
  }

  hide() {
    this.element.remove();
  }

  show() {
    const tooltipElement = document.createElement("div");
    tooltipElement.className = "card";
    tooltipElement.textContent = "Dummy";
    tooltipElement.addEventListener("click", this.closeToolTip.bind(this));
    this.element = tooltipElement;
    document.body.append(tooltipElement);
  }
}

class ProjectItem {
  hasActiveTooltip = false;

  constructor(id, updateProjListFn, type) {
    this.id = id;
    this.updateProjectListsHandler = updateProjListFn;
    this.connectSwitchBtn();
    this.connectMoreInfoBtn(type);
  }

  showMoreInfoHandler() {
    if (this.hasActiveTooltip) {
      return;
    }
    const tooltip = new Tooltip(() => (this.hasActiveTooltip = false));
    tooltip.show();
    this.hasActiveTooltip = true;
  }

  connectMoreInfoBtn() {
    const projItemElement = document.getElementById(this.id);
    const moreInfoBtn = projItemElement.querySelector("button:first-of-type");
    moreInfoBtn.addEventListener("click", this.showMoreInfoHandler);
  }

  connectSwitchBtn(type) {
    const projItemElement = document.getElementById(this.id);
    let switchBtn = projItemElement.querySelector("button:last-of-type");
    // avoid accumulating event listeners
    switchBtn = DOMHelper.clearEventListeners(switchBtn);
    switchBtn.textContent = type === "active-projects" ? "Finish" : "Activate";
    switchBtn.addEventListener(
      "click",
      this.updateProjectListsHandler.bind(null, this.id)
    );
  }

  update(updateProjListFn, type) {
    this.updateProjectListsHandler = updateProjListFn;
    // re-run connectSwitchBtn with the above updated value
    this.connectSwitchBtn(type);
  }
}

class ProjectList {
  projects = [];

  constructor(type) {
    // Type takes in list id
    this.type = type;
    const projItems = document.querySelectorAll(`#${type} li`);
    for (const projItem of projItems) {
      this.projects.push(
        new ProjectItem(projItem.id, this.switchProject.bind(this), this.type)
      );
    }
  }

  setSwitchHandlerFn(switchHandlerFn) {
    this.switchHandler = switchHandlerFn;
  }

  addProject(project) {
    this.projects.push(project);
    DOMHelper.moveElement(project.id, `#${this.type} ul`);
    // updates instance for function
    project.update(this.switchProject.bind(this), this.type);
  }

  switchProject(projectId) {
    this.switchHandler(this.projects.find((p) => p.id === projectId));
    // remove project
    this.projects = this.projects.filter((p) => p.id !== projectId);
  }
}

class App {
  static init() {
    const activeProjList = new ProjectList("active-projects");
    const finishedProjList = new ProjectList("finished-projects");
    activeProjList.setSwitchHandlerFn(
      finishedProjList.addProject.bind(finishedProjList)
    );
    finishedProjList.setSwitchHandlerFn(
      activeProjList.addProject.bind(activeProjList)
    );
  }
}

App.init();
