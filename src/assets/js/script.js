/** @format */

function submitHandler() {
  let name = document.getElementById("nama").value;
  let email = document.getElementById("input-email").value;
  let subject = document.getElementById("input-subject").value;
  let phone = document.getElementById("phone-number").value;
  let message = document.getElementById("input-message").value;

  // console.log("name: " + name);
  // console.log("Email: " + email);
  // console.log("subject" + subject);
  // console.log("phone" + phone ) ;
  // console.log("Pesan: " + message);

  if (name === "") {
    return alert("Tolong isi Nama bos");
  } else if (email === "") {
    return alert("Tolong isi email bos");
  } else if (phone === "") {
    return alert("Tolong isi nomor mu bos");
  } else if (subject === "") {
    return alert("Tolong isi subject mu bos");
  } else if (message === "") {
    return alert("Tolong isi pesan bos");
  }

  let emailReceiver = "agungpurba16@gmail.com";
  let a = document.createElement("a");
  a.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailReceiver}&su=${subject}&body=${message}`;
  a.click();

  let data = { name, email, phone, subject, message };
  console.log(data);
}
