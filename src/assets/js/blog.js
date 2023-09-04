/** @format */

function whenFormEmpty() {
  let name = document.getElementById("input-project-name").value;
  let startDate = document.getElementById("input-start-date").value;
  let endDate = document.getElementById("input-end-date").value;
  let description = document.getElementById("input-description").value;
  let multiCheckbox = document.querySelectorAll(".input-technologies:checked");
  let image = document.getElementById("input-image").value;

  console.log(name);
  console.log(startDate);
  console.log(endDate);
  console.log(description);
  console.log(multiCheckbox);
  console.log(image);

  // validasi user form
  if (name === "") {
    return alert("Tolong Isi Dulu Project Name Mu");
  } else if (startDate === "") {
    return alert("Tolong Isi dulu Tanggal Mulai ");
  } else if (endDate === "") {
    return alert("Tolong Isi dulu Tanggal Selesai");
  } else if (description === "") {
    return alert("Deskripsi nya tolong di isi");
  } else if (multiCheckbox.length === 0) {
    return alert("Tolong isi dulu Project Technologies");
  } else if (image === "") {
    return alert("Masukkan dulu gambar mu ");
  }
}

let addProjectData = [];
let defaultaddProjectData =
  document.getElementById("add-project-data").innerHTML;

function addProjectData(event) {
  event.preventDefault();

  let name = document.getElementById("input-project-name").value;
  let startDate = document.getElementById("input-start-date").value;
  let endDate = document.getElementById("input-end-date").value;
  let description = document.getElementById("input-description").value;
  let image = document.getElementById("input-image").files;

  const nodejsIcon = `<i class="fa-brands fa-node-js fa-xl tooltip"><span class="tooltiptext tooltip-bottom">Node Js</span></i>`;
  const reactjsIcon = `<i class="fa-brands fa-react fa-xl tooltip"><span class="tooltiptext tooltip-bottom">React Js</span></i>`;
  const pythonIcon =
    '<i class="fa-brands fa-python fa-xl tooltip"><span class="tooltiptext tooltip-bottom">Pyhton</span></i>';
  const javaScriptIcon =
    '<i class="fa-brands fa-square-js fa-xl tooltip"><span class="tooltiptext tooltip-bottom">JavaScript</span></i>';

  const nodeJs = document.getElementById("nodejs");
  const reactJs = document.getElementById("reactjs");
  const python = document.getElementById("python");
  const javaScript = document.getElementById("javaScript");

  //  SI ICON SET INI NYIAPIN 1 KOTAK BUAT PARA ICON DIATAS KETIKA DI CEKLIS AKAN MENGAMABIL DATA

  let iconSet = "";

  // VALIDASI IKON
  if (nodeJs.checked) {
    iconSet += nodejsIcon;
  }
  if (reactJs.checked) {
    iconSet += reactjsIcon;
  }
  if (python.checked) {
    iconSet += pythonIcon;
  }
  if (javaScript.checked) {
    iconSet += javaScriptIcon;
  }

  // untuk membuat object file menjadi URL secara sementara, agar tampil
  image = URL.createObjectURL(image[0]);

  let start = new Date(startDate);
  let end = new Date(endDate);

  if (start > end) {
    return alert("Tanggl awal Tidak boleh lebih besar Dari Tanggal akhir");
  }

  let timeDifference = end.getTime() - start.getTime();
  let days = timeDifference / (1000 * 60 * 60 * 24);
  let weeks = Math.floor(days / 7);
  let months = Math.floor(weeks / 4);
  let years = Math.floor(months / 12);

  let duration = "";

  // validation time data
  if (days > 0) {
    duration = `${days} Day`;
  }
  if (weeks > 0) {
    duration = `${weeks} Week`;
  }
  if (months > 0) {
    duration = `${months} Month`;
  }
  if (years > 0) {
    duration = `${years} Year`;
  }

  let data = {
    name,
    duration,
    iconSet,
    description,
    image,
  };

  addProjectData.push(data);
  console.log(addProjectData);

  // let a = document.createElement("a");
  // a.href = `#list-project-container`;
  // a.click();

  addProjectData();
}

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
