//close the message popup
function closePopup(ID) {

  document.getElementById(ID).classList.add('popup-message-move');

  setTimeout(() => {
    document.getElementById(ID).remove();
  }, 250);
  
}


function toggleDropdown() {
  const dropdown = document.getElementById("dropdown-menu");
  // Toggle the display property between 'block' and 'none'
  if (dropdown.style.display === "block") {
    dropdown.style.display = "none";
  } else {
    dropdown.style.display = "block";
  }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.my-profile')) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.style.display === "block") {
        openDropdown.style.display = "none";
      }
    }
  }
}




//show the buttons when click the select button
function showSelectionOptions () {
  const deleteButton = document.querySelector('.delete-selection');
  const selectAllButton = document.querySelector('.select-all-selection');
  const cancelButton = document.querySelector('.cancel-selection');

  deleteButton.style.display = 'block';
  selectAllButton.style.display = 'block';
  cancelButton.style.display = 'block';
}


