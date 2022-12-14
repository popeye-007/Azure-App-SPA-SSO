// Select DOM elements to work with
const welcomeDiv = document.getElementById("WelcomeMessage");
const signInButton = document.getElementById("SignIn");
const cardDiv = document.getElementById("card-div");
const mailButton = document.getElementById("readMail");
const profileButton = document.getElementById("seeProfile");
const profileDiv = document.getElementById("profile-div");
const profilePhotoDiv = document.getElementById("photo"); //profile-photo-div
const groupsButton = document.getElementById("seeGroups");
const groupDiv = document.getElementById("group-div");

function showWelcomeMessage(username) {
  // Reconfiguring DOM elements
  cardDiv.style.display = 'initial';
  welcomeDiv.innerHTML = `Welcome ${username}`;
  signInButton.setAttribute("onclick", "signOut();");
  signInButton.setAttribute('class', "btn btn-success")
  signInButton.innerHTML = "Sign Out";
}


async function getMePhoto(data, endpoint) {
  console.log(data)
  const imageUrl = await profilePhoto();
  console.log(imageUrl);
  return imageUrl;
}

async function updateUI(data, endpoint) {
  console.log('Graph API responded at: ' + new Date().toString());

  if (endpoint === graphConfig.graphMeEndpoint) {
    profileDiv.innerHTML = '';
    const photo = document.createElement('img');
    photo.src = await getMePhoto();
    photo.style = "border-radius: 50%; " + "border - style: solid; " + "border - width: 5px; " + "height: 150px; " + "width: 150px; ";

    const title = document.createElement('p');
    title.innerHTML = "<strong>Title: </strong>" + data.jobTitle;
    const email = document.createElement('p');
    email.innerHTML = "<strong>Mail: </strong>" + data.mail;
    const phone = document.createElement('p');
    phone.innerHTML = "<strong>Phone: </strong>" + data.businessPhones[0];
    const address = document.createElement('p');
    address.innerHTML = "<strong>Location: </strong>" + data.officeLocation;
    profileDiv.appendChild(photo);
    profileDiv.appendChild(title);
    profileDiv.appendChild(email);
    profileDiv.appendChild(phone);
    profileDiv.appendChild(address);

  } else if (endpoint === graphConfig.graphMyProfilePhoto) {
    profilePhotoDiv.innerHTML = '';
    const photo = document.createElement('img');
    photo.src = showProfilePhoto();
    profilePhotoDiv.appendChild(photo);

  } else if (endpoint === graphConfig.graphGroupMembers) {
    groupDiv.innerHTML = ''
    const groupMember = document.createElement('ol');
    for (let x in data.value) {
      groupMember.innerHTML += "<li> <strong>Name: </strong>"
        + data.value[x].displayName
        + "<br> <strong>Mail: </strong>"
        + data.value[x].mail
        + "<br> <strong>Job Title: </strong>"
        + data.value[x].jobTitle
        + "<br> <br> </li>"
        ;
      groupDiv.appendChild(groupMember);
    }
  } else if (endpoint === graphConfig.graphMailEndpoint) {
    if (!data.value) {
      alert("You do not have a mailbox!")
    } else if (data.value.length < 1) {
      alert("Your mailbox is empty!")
    } else {
      const tabContent = document.getElementById("nav-tabContent");
      const tabList = document.getElementById("list-tab");
      tabList.innerHTML = ''; // clear tabList at each readMail call

      data.value.map((d, i) => {
        // Keeping it simple
        if (i < 20) {
          const listItem = document.createElement("a");
          listItem.setAttribute("class", "list-group-item list-group-item-action")
          listItem.setAttribute("id", "list" + i + "list")
          listItem.setAttribute("data-toggle", "list")
          listItem.setAttribute("href", "#list" + i)
          listItem.setAttribute("role", "tab")
          listItem.setAttribute("aria-controls", i)
          listItem.innerHTML = d.subject;
          tabList.appendChild(listItem)

          const contentItem = document.createElement("div");
          contentItem.setAttribute("class", "tab-pane fade")
          contentItem.setAttribute("id", "list" + i)
          contentItem.setAttribute("role", "tabpanel")
          contentItem.setAttribute("aria-labelledby", "list" + i + "list")
          contentItem.innerHTML = "<strong> from: " + d.from.emailAddress.address + "</strong><br><br>" + d.bodyPreview + "...";
          tabContent.appendChild(contentItem);
        }
      });
    }
  }
}