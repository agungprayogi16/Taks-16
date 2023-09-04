/** @format */

// const testimonialsData = [
//   {
//     author: "Agung Prayogi",
//     quote: "Orang paling baik",
//     image: "image/123.jpeg",
//     rating: 5,
//   },
//   {
//     author: "Amelia",
//     quote: "Cantik membahana",
//     image:
//       "https://images.pexels.com/photos/17631073/pexels-photo-17631073/free-photo-of-wanita-berambut-pirang-topi-kedudukan.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//     rating: 4,
//   },
//   {
//     author: "Angel",
//     quote: "Beautiful",
//     image:
//       "https://images.pexels.com/photos/17937506/pexels-photo-17937506/free-photo-of-wanita-bidang-pedesaan-kedudukan.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//     rating: 3,
//   },

//   {
//     author: "Atalia",
//     quote: "Si cantik Manis",
//     image:
//       "https://images.pexels.com/photos/14850183/pexels-photo-14850183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//     rating: 4,
//   },
// ];

const testimonial = new Promise((resolve, reject) => {
  const request = new XMLHttpRequest();
  request.open("GET", "https://api.npoint.io/28d5e93b844e39425fe0", true);

  request.onload = () => {
    if (request.status == 200) {
      resolve(JSON.parse(request.response));
    } else {
      reject("request error");
    }
  };
  request.send();
});
// console.log(testimonial);

async function ratingAll() {
  let ratingAllHtml = "";
  const data = await testimonial;

  // console.log(data);

  data.forEach(function (rating) {
    ratingAllHtml += `
    <div class="testimonial">
         <img src="${rating.image}" class="profile-testimonial" />
         <p class="author">- ${rating.author}</p>
         <p class="quote">${rating.quote}</p>
         <p class="rating"> ${rating.rating}
         <i class="fa-solid fa-star"></i>
     </div>
    `;
  });

  document.getElementById("testimonials").innerHTML = ratingAllHtml;
}
ratingAll();

async function selectRating(rating) {
  let selectRatingHtml = "";
  const data = await testimonial;

  const ratingFiltered = data.filter(function (item) {
    return item.rating === rating;
  });

  if (ratingFiltered.length === 0) {
    const notFound = document.getElementById("not-found");
    notFound.style.display = "block";
    notFound.style.textAlign = "center";
    notFound.innerHTML = `<h2>Not Found</h2>`;
  } else if (ratingFiltered.length > 0) {
    const messageEmptyData = document.getElementById("not-found");
    messageEmptyData.style.display = "none";
    ratingFiltered.forEach(function (rating) {
      selectRatingHtml += `
       <div class="testimonial">
           <img src="${rating.image}" class="profile-testimonial" />
           <p class="author">- ${rating.author}</p>
           <p class="quote">
           ${rating.quote}
           </p>
           <p class="rating"> ${rating.rating}
           <i class="fa-solid fa-star"></i>
           </p>
       </div>`;
    });
  }
  document.getElementById("testimonials").innerHTML = selectRatingHtml;
}
