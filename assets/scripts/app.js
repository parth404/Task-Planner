class Tooltip {}

class ProjectItem {
  constructor(id) {
    this.id = id;
    this.connectSwitchBtn();
    this.connectMoreInfoBtn();
  }

  connectMoreInfoBtn() {
    const projItemElement = document.getElementById(this.id);
  }

  connectSwitchBtn() {
    const projItemElement = document.getElementById(this.id);
    const switchBtn = projItemElement.querySelector("button: last-of-type");
    switchBtn.addEventListener("click", "");
  }
}

class ProjectList {
  projects = [];
  // Type takes in list id
  constructor(type) {
    this.type = type;
    const projItems = document.querySelectorAll(`#${type} li`);
    for (const projItem of projItems) {
      this.projects.push(new ProjectItem(projItem.id));
    }
  }
}

class App {
  static init() {
    const activeProjList = new ProjectList("active-projects");
    const finishedProjList = new ProjectList("finished-projects");
  }
}

App.init();
