/** @format */

// Menapilkan Data Mengnna kn for
function renderProjectCard() {
  let addProjectData = document.getElementById("add-project-data");
  let currentaddProjectHbs = defaultaddProjectData;
  for (let index = 0; index < proaddjectData.length; index++) {
    currentaddProjectHbs += `<div class="container-blog-detail" id="add-project-data">

        <div class="card" id="card">
            <div>
                <img style="height: 300px;width: 100%;" src="${addProjectData[index].image}" alt="project" />
            </div>
            <div>
                <h4 style="padding-top: 20px;">Dumbwayas 2023</h4>
                <p>durasi : ${addProjectData[index].duration}</p>
            </div>
            <div style="height: 80px;">
                <p
                   ${addProjectData[index].description}
                </p>
                <a href="blogdetail.html">lihat selengkap nya.....</a>
            </div>
            <div style="display: flex;gap: 10px;">
                ${addProjectData[index].iconSet}
            </div>
            <div class="button-done">
                <button>Edit</button>
                <button>Delete</button>
            </div>
        </div>


    </div>
    
    `;
  }

  addProjectDatarojectContainer.innerHTML = currentProjectHtml;
}
