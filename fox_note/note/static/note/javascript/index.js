

//for AJAX GET requset 'GET the profile notes'
function loadNotes() {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', getProfileNotesUrl, true);

  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      const data = JSON.parse(xhr.responseText);


      // Sort the data by creation_date
      data.notes.sort((a, b) => {
        // creation_date is in ISO format (e.g., "2024-08-29T14:12:00Z")
        const dateA = new Date(a.creation_date);
        const dateB = new Date(b.creation_date);

        return dateB - dateA;  // For ascending order (latest first)
        // return dateB - dateA;  // For descending order (earliest first)
      });

      console.log(data);

      const notes = document.getElementById('notes');

      notes.innerHTML = '';


      data.notes.forEach(function (note) {
        const noteDiv = document.createElement('div');

        let tagsList = '';

        note.tag.sort();

        note.tag.forEach(element => {
          tagsList += `<li>${element}</li>`;
        });



        noteDiv.id = `note-${note.id}`;

        noteDiv.innerHTML = `
          <h2>${note.title}</h2>
          <ul>${tagsList}</ul>
          <div id='quill-div-${note.id}'></div>
          <button id='edit-${note.id}' onclick='editButton("quill-div-${note.id}", "note-${note.id}")'>edit</button>
          <button id='cancel-${note.id}' onclick='cancelButton("quill-div-${note.id}", "note-${note.id}")'>cancel</button>
          <button id='update-${note.id}' onclick='updateNote("quill-div-${note.id}", "note-${note.id}")'>update</button>
          <button id='delete-${note.id}' onclick='deleteNote("quill-div-${note.id}", "note-${note.id}")'>delete</button>
          <input type="checkbox" value = "${note.id}" id="select-check-box">
        `;

        notes.appendChild(noteDiv);

        //create the Quill
        const quill = new Quill(`#quill-div-${note.id}`, {
          modules: {
            toolbar: customToolbar //the name of the custom toolbar setting or module
          },
          theme: 'snow', //the theme of the style
          readOnly: true
        });

        //add the content of the note
        quill.root.innerHTML = note.content;

        //target the toolbar and make it hidden
        const toolbar = quill.getModule('toolbar').container;
        toolbar.classList.add('toolbar-hidden');

        tagsList = '';
      })

      //remove the show more button if the notes are fully shown
      const showMoreButton = document.getElementById('show-more');
      if (!data.has_more) {
        showMoreButton.style.display = 'none';
      }

    } else {
      alert('Error: could not lad the notes')
    }
  };

  xhr.send();
}

loadNotes();

//************************************************************************** 
//AJAX request to load more notes when clicking in the show more button
function showMore() {
  //selecte the button
  const button = document.getElementById('show-more');

  //select the button data
  const offset = button.getAttribute('data-offset');

  //create a XMLHTTPREQUEST
  const xhr = new XMLHttpRequest();

  xhr.open('GET', `/note/load-more-notes?offset=${offset}`, true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
  xhr.setRequestHeader('X-CSRFToken', csrftoken);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      const response = JSON.parse(xhr.responseText);

      if (response.status == 'success') {
        //target the main div of note 
        const noteContiner = document.getElementById('notes');

        response.notes.forEach(note => {
            
          //create new div inside the main div note
          const noteDiv = document.createElement('div');
          noteDiv.id = `note-${note.note_id}`;


          // Loop through the note_tags object
          const noteTags = note.note_tags;

          //create empty string to fill inside it the <li> of the tags
          let tagsListHtml = ``;

          //using Object.entries() to loop through the note tags 
          Object.entries(noteTags).forEach(([tagId, tagName]) => {
            console.log(`Tag ID: ${tagId}, Tag Name: ${tagName}`);

            //create new element list
            tagsListHtml += `<li value="${tagId}">${tagName}</li>`;

          });

          noteDiv.innerHTML = `
            <h2>${note.note_title}</h2>
            <ul id=tag-list>${tagsListHtml}</ul>
            <div id='quill-div-${note.note_id}'></div>
            <button id='edit-${note.note_id}' onclick='editButton("quill-div-${note.note_id}", "note-${note.note_id}")'>edit</button>
            <button id='cancel-${note.note_id}' onclick='cancelButton("quill-div-${note.note_id}", "note-${note.note_id}")'>cancel</button>
            <button id='update-${note.note_id}' onclick='updateNote("quill-div-${note.note_id}", "note-${note.note_id}")'>update</button>
            <button id='delete-${note.note_id}' onclick='deleteNote("quill-div-${note.note_id}", "note-${note.note_id}")'>delete</button>
            <input type="checkbox" value = "${note.note_id}" id="select-check-box">
            `;

          //Inserts a node as the first child of an element.
          noteContiner.appendChild(noteDiv);

          //create the Quill
          const quill = new Quill(`#quill-div-${note.note_id}`, {
            modules: {
              toolbar: customToolbar //the name of the custom toolbar setting or module
            },
            theme: 'snow', //the theme of the style
            readOnly: true
          });

          //add the content of the note
          quill.root.innerHTML = note.note_content;

          //target the toolbar and make it hidden
          const toolbar = quill.getModule('toolbar').container;
          toolbar.classList.add('toolbar-hidden');


        })
        


        alert('show more notes done');
      
        // Update the offset for the next batch
        button.setAttribute('data-offset', parseInt(offset) + 3);
        
        
        console.log(response.has_more);
        // Hide the button if no more notes are available
        
        if (!response.has_more) {
          button.style.display = 'none';
        }

      }

      
    } else {
      alert('faild show more notes')
    }
  };
  xhr.send();
}







//************************************************************************** 

//AJAX function using the PUT HTTP request 'update'
function updateNote(noteID, parentNoteID) {
  //target the quill note
  const quillNote = document.getElementById(noteID);
  const quill = Quill.find(quillNote);

  //target the updated title
  const noteDiv = document.getElementById(parentNoteID);
  const titleUpdate = noteDiv.querySelector('input');

  //target old title
  const oldTitle = noteDiv.querySelector('h2');

  //create an XMLHttpRequest with the method PUT
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', `update-note/${parentNoteID.split('-')[1]}`, true);

  //create the csrf protocole
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  xhr.setRequestHeader('X-CSRFToken', csrfToken);
  xhr.setRequestHeader('Content-Type', 'application/json');

  //the respons while the request complaited
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      const respons = JSON.parse(xhr.responseText);
      if (respons.message) {
        alert('note udpate successfully');

        //make the quill note to reade only

        quill.disable();

        noteContent = quill.root.innerHTML;//update to the new note content

        oldTitle.innerHTML = titleUpdate.value;


        cancelButton(noteID, parentNoteID);
      } else {
        alert('Error: Could not update the note');
      }
    } else {
      alert('Error: Could not update the note');
    }
  };

  xhr.send(JSON.stringify({ content: quill.root.innerHTML , title: titleUpdate.value}));
}




//************************************************************************** 



//AJAX function using the DELETE HTTP request 'delete'
function deleteNote(noteID, parentNoteID) {
  //target the paent div
  const parentDiv = document.getElementById(parentNoteID);

  //target the quill note
  const quillNote = document.getElementById(noteID);
  const quill = Quill.find(quillNote);

  //create an XMLHttpRequest with the method PUT
  const xhr = new XMLHttpRequest();
  xhr.open('DELETE', `delete-note/${parentNoteID.split('-')[1]}`, true);

  //create the csrf protocole
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  xhr.setRequestHeader('X-CSRFToken', csrfToken);
  xhr.setRequestHeader('Content-Type', 'application/json');

  //the respons while the request complaited
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      const respons = JSON.parse(xhr.responseText);
      if (respons.message) {
        alert(respons.message);


        noteContent = quill.root.innerHTML;
        cancelButton(noteID, parentNoteID);

        parentDiv.remove();

        //target the show more button and dicrese him 1 so there is no duplication

        const showMoreButton = document.getElementById('show-more');
        const offset = showMoreButton.getAttribute('data-offset');
        showMoreButton.setAttribute('data-offset', parseInt(offset) - 1);

      } else {
        alert('Error: Could not delete the note');
      }
    } else {
      alert('Error: Could not delete the note');
    }
  };
  xhr.send(JSON.stringify({ note_id: parentNoteID.split('-')[1] }));
}



//************************************************************************** 

//AJAX function using the POST HTTP request 'create note'
function createNote(event) {
  event.preventDefault();

  // Get the content from Quill and append it to FormData
  const quillTarget = document.getElementById('form-note');
  const quill = Quill.find(quillTarget);

  //past the content of the quill on the hidden input
  document.getElementById('note-content').value = quill.root.innerHTML; // or quill.getText() if you want plain text


  const divForm = document.getElementById('add-note-form');
  const formData = new FormData(divForm);

  // Get the CSRF token from the form
  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/note/add-note', true);
  xhr.setRequestHeader('X-CSRFToken', csrftoken);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      const response = JSON.parse(this.responseText);

      if (response.status == 'success') {
        alert(response.message);
        //target the main div of note 
        const note = document.getElementById('notes');

        //create new div inside the main div note
        const noteDiv = document.createElement('div');
        noteDiv.id = `note-${response.note_id}`;


        // Loop through the note_tags object
        const noteTags = response.note_tags;

        //create empty string to fill inside it the <li> of the tags
        let tagsListHtml = ``;

        //using Object.entries() to loop through the note tags 
        Object.entries(noteTags).forEach(([tagId, tagName]) => {
          console.log(`Tag ID: ${tagId}, Tag Name: ${tagName}`);

          //create new element list
          tagsListHtml += `<li value="${tagId}">${tagName}</li>`;

        });

        noteDiv.innerHTML = `
          <h2>${response.note_title}</h2>
          <ul id=tag-list>${tagsListHtml}</ul>
          <div id='quill-div-${response.note_id}'></div>
          <button id='edit-${response.note_id}' onclick='editButton("quill-div-${response.note_id}", "note-${response.note_id}")'>edit</button>
          <button id='cancel-${response.note_id}' onclick='cancelButton("quill-div-${response.note_id}", "note-${response.note_id}")'>cancel</button>
          <button id='update-${response.note_id}' onclick='updateNote("quill-div-${response.note_id}", "note-${response.note_id}")'>update</button>
          <button id='delete-${response.note_id}' onclick='deleteNote("quill-div-${response.note_id}", "note-${response.note_id}")'>delete</button>
          <input type="checkbox" value = "${response.note_id}" id="select-check-box">
          `;

        //Inserts a node as the first child of an element.
        note.prepend(noteDiv);

        //create the Quill
        const quill = new Quill(`#quill-div-${response.note_id}`, {
          modules: {
            toolbar: customToolbar //the name of the custom toolbar setting or module
          },
          theme: 'snow', //the theme of the style
          readOnly: true
        });

        //add the content of the note
        quill.root.innerHTML = response.note_content;

        //target the toolbar and make it hidden
        const toolbar = quill.getModule('toolbar').container;
        toolbar.classList.add('toolbar-hidden');


      //target the show more button and add him 1 so there is no duplication

      const showMoreButton = document.getElementById('show-more');
      const offset = showMoreButton.getAttribute('data-offset');
      showMoreButton.setAttribute('data-offset', parseInt(offset) + 1);

      //empty the note form
      emptyNoteForm()

      }



    } else {
      alert('could not add the new note');
    }

  };

  xhr.send(formData);
  console.log(formData);
}




//************************************************************************** 
//function to empty the create new note form after submit it
function emptyNoteForm() {
  //select the elements
  const titleInput = document.querySelector('input#id_title') 
  const tagSelect = document.getElementById('id_tag');
  const quillForm = document.getElementById('form-note');
  const hiddenInput = document.getElementById('note-content');

  //start empty each one
  //empty the title
  titleInput.value = '';

  //empty the selected tags
  for (let i = 0; i < tagSelect.options.length; i++) {
    const option = tagSelect.options[i];

    if (option.selected) {
      option.selected = !option.selected;
    }
  }

  //empty the quill
  const quill = Quill.find(quillForm);
  quill.root.innerHTML = '';

  //empty the hiddin input
  hiddenInput.innerHTML = '';

}




//************************************************************************** 




//AJAX function using the POST HTTP request 'create tag'
function createTag(event) {
  event.preventDefault();

  const divForm = document.getElementById('add-tag-form');
  const formData = new FormData(divForm);


  // Get the CSRF token from the form
  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;


  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/note/add-tag', true);
  xhr.setRequestHeader('X-CSRFToken', csrftoken);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {

      const response = JSON.parse(this.responseText);

      if (response.status == 'success') {
        alert('Tag added successfully!');
        //select the list were the tags is
        const tagList = document.getElementById('id_tag');

        //add the new tag
        const newTag = document.createElement('option');
        newTag.value = response.new_tag_id;//give the new tag value
        newTag.text = response.new_tag_name;//give the new tag text

        // Add the new option to the tags select field
        tagList.add(newTag);

        // Optionally, select the new tag automatically
        tagList.value = response.new_tag_id;

        //empty the tag input form 
        emptyTagForm()
      }
    } else {
      alert('Error: could not add new tag pleaze see if the tag is duplicated or you miss some field');
    }
  };

  xhr.send(formData);
  console.log(formData);
}




//************************************************************************** 

//empty the tag text the user wrote
function emptyTagForm() {
  //select the necessery elements
  const tagInput = document.getElementById('id_form-0-tag');

  //empty the taginput
  tagInput.value = '';
}






//************************************************************************** 

var noteContent;
let activeEdit = false;

//function activate the edit button
function editButton(noteID, parentNoteID) {
  if (!activeEdit) {
    alert('there is no edit you will start edit')

    //store the note content


    //target the note
    const noteTarget = document.getElementById(noteID);
    const quill = Quill.find(noteTarget);

    //store the note content
    noteContent = quill.root.innerHTML;

    // Enable editing and apply the custom toolbar
    quill.enable();

    //select the parent div
    const parentNote = document.getElementById(parentNoteID);

    //select the toolbar div of the parnet
    const toolbarChild = parentNote.querySelector('.ql-toolbar');
    toolbarChild.classList.remove('toolbar-hidden');
    toolbarChild.classList.add('toolbar-visible');


    //target the title
    const title = parentNote.querySelector('h2');

    //add an input to edite the title
    console.log(`note target :${parentNote.innerHTML}`);
    const inputTitle = `
    <p>update title</p>
    <input type="text" name="title" maxlength="300" required="" id="id_title" value="${title.innerText}">`

    title.insertAdjacentHTML('afterend', inputTitle);
    return activeEdit = true;
  } else {
    alert('there is existing edit please cancel it or save it')
  }
}


//************************************************************************** 



//function to cancel the edit
function cancelButton(noteID, parentNoteID) {

  //select the quill div
  const quillNote = document.getElementById(noteID);

  //select the quill
  const quill = Quill.find(quillNote);

  quill.disable();



  //targeting the parent note div
  const parentNote = document.getElementById(parentNoteID);

  //select the toolbar div of the parnet
  const toolbar = parentNote.querySelector('.ql-toolbar');

  //hide the toolbar
  toolbar.classList.remove('toolbar-visible');
  toolbar.classList.add('toolbar-hidden');

  //restore the note content
  quill.root.innerHTML = noteContent;



  //target the input of the title
  const titleInput = parentNote.querySelector('input');
  const titleInputLabel = parentNote.querySelector('p');
  titleInput.remove();
  titleInputLabel.remove();

  alert('cancel edit');
  return activeEdit = false;


}



//****************************************************


//test for the form selecting multiple tag
document.getElementById('id_tag').addEventListener('mousedown', function (event) {
  event.preventDefault(); // Prevent the default behavior

  const option = event.target; // This is the <option> element

  // Toggle the selection state
  option.selected = !option.selected;//This line flips the selection state of the clicked option.
});



//****************************************************
//function for select all checkboxes to delete notes

function selectAll() {
  //select the main notes div
  const mainDiv = document.getElementById('notes');

  // Get all child elements of the main div
  const notesList = mainDiv.querySelectorAll('input[type="checkbox"]');

  // Loop through each element and check the checkbox
  notesList.forEach(element => {
    element.checked = true; // This checks (activates) the checkbox
  })

  console.log(mainDiv.querySelectorAll('input[type="checkbox"]'));
}


//****************************************************
//function to cancel the checked checkboxes

function cancelSelection() {
  //select the main note div
  const mainDiv = document.getElementById('notes');

  //get all child elements of main div
  const notesList = mainDiv.querySelectorAll('input[type="checkbox"]');

  //loop through each element and uncheck the checkbox
  notesList.forEach(element => {
    element.checked = false; // This unchecks (activates) the checkbox
  })

  //hide the buttons 
  const deleteButton = document.querySelector('.delete-selection');
  const selectAllButton = document.querySelector('.select-all-selection');
  const cancelButton = document.querySelector('.cancel-selection');

  deleteButton.style.display = 'none';
  selectAllButton.style.display = 'none';
  cancelButton.style.display = 'none';

  //reavtivate the select button
  const selectButton = document.querySelector('.select-button');
  selectButton.disabled = false;

}


//****************************************************
//function to delete the selected checkboxes

function deleteSelect () {
  //select the main note div
  const mainDiv = document.getElementById('notes');

  //get all child elements of main div
  const notesList = mainDiv.querySelectorAll('input[type="checkbox"]');

  //create empty list to store the velue of checkboxes (i set the values to be the id of the note)
  const checkboxesList = [];

  //loop through each  checkbox
  notesList.forEach(element => {
    if (element.checked) { //check if the checkbox is active
      checkboxesList.push(element.value);//push it to the list
    }
  })



  const xhr = new XMLHttpRequest();

  xhr.open('POST', `/note/delete-selected-notes`, true);

  //create the csrf protocole
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  xhr.setRequestHeader('X-CSRFToken', csrfToken);
  xhr.setRequestHeader('Content-Type', 'application/json');

  

  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 400) {
      console.log(xhr.responseText)

      //loop through evry element inside checkboxList
      checkboxesList.forEach(element => {
      //target the selected note
      const noteDiv = document.getElementById(`note-${element}`);
      noteDiv.remove();//remove the div

      })

      //dicress the show more button when he delete multiple notes to avoude duplicate data
      const showMoreButton = document.getElementById('show-more');
      const offset = showMoreButton.getAttribute('data-offset');
      console.log(`the list : ${checkboxesList} the length of the list ${checkboxesList.length} offset:${offset}` );
      showMoreButton.setAttribute('data-offset', parseInt(offset) - checkboxesList.length);
    } else {
      alert("Error: we can't delete the selected items");
    }
  };

  xhr.send(JSON.stringify(checkboxesList));

}



//****************************************************
//function to select witch one to search by TITLE or TAG or ADVINCE SEARCH 'both'

function toggleSearchFields() {
  const searchMode = document.getElementById('search-mode').value;
  document.getElementById('title-search').style.display = 'none';
  document.getElementById('tag-search').style.display = 'none';
  document.getElementById('advanced-search').style.display = 'none';

  if (searchMode === 'title') {
    document.getElementById('title-search').style.display = 'block';
  } else if (searchMode === 'tag') {
    document.getElementById('tag-search').style.display = 'block';
  } else if (searchMode === 'advanced') {
    document.getElementById('advanced-search').style.display = 'block';
  }
}

toggleSearchFields(); // Call on page load to set the initial state


//****************************************************
//function to hendele the search request and display the result
function searchResult(event) {
  event.preventDefault();// Prevent the form from submitting the traditional way

  const searchMode = document.getElementById('search-mode').value;
  let params = new URLSearchParams();
  let isValid = true;

  // Clear previous error messages
  document.querySelectorAll('.error-message').forEach((el) => {
    el.style.display = 'none';
  });

  //check the type of search we are doing
  if (searchMode === 'title') {
    const title = document.getElementById('title-input');
    const titleValue = title.value.trim();



    if (titleValue === '') {
      isValid = false;
      document.getElementById('title-error').textContent = 'This field must be filled out.';
      document.getElementById('title-error').style.display = 'block';
      return;
    }else {
      
      params.append('title', titleValue);
    }

  } else if (searchMode === 'tag') {
    const tag = document.getElementById('tag-input');
    const tagValue = tag.value.trim();



    if (tagValue === '') {
      isValid = false;
      document.getElementById('tag-error').textContent = 'This field must be filled out.';
      document.getElementById('tag-error').style.display = 'block';
    } else {
      
      params.append('tag', tagValue);
    }
    
  } else if (searchMode === 'advanced') {
    const title = document.getElementById('advanced-title-input');
    const tag = document.getElementById('advanced-tag-input');

    const titleValue = title.value.trim();
    const tagValue = tag.value.trim();



    if (titleValue === '') {
      isValid = false;
      document.getElementById('advanced-title-error').textContent = 'This field must be filled out.';
      document.getElementById('advanced-title-error').style.display = 'block';
      return;
    } else if (tagValue === '') {
      isValid = false;
      document.getElementById('advanced-tag-error').textContent = 'This field must be filled out.';
      document.getElementById('advanced-tag-error').style.display = 'block';
    } else {
      title.setCustomValidity('');
      tag.setCustomValidity('');
      params.append('title', titleValue);
      params.append('tag', tagValue);
    }


  }

  console.log('params :' + params);

  //check if the params is not empty to run the GET request
  if (isValid && [...params].length > 0) {
    fetch(`/note/search-notes/?${params.toString()}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.notes.length > 0) {
          const notes = document.getElementById('notes');

          notes.innerHTML = '';


          data.notes.forEach(function (note) {
            const noteDiv = document.createElement('div');

            let tagsList = '';

            note.note_tags.sort();

            note.note_tags.forEach(element => {
              tagsList += `<li>${element}</li>`;
            });



            noteDiv.id = `note-${note.note_id}`;

            noteDiv.innerHTML = `
              <h2>${note.note_title}</h2>
              <ul>${tagsList}</ul>
              <div id='quill-div-${note.note_id}'></div>
              <button id='edit-${note.note_id}' onclick='editButton("quill-div-${note.note_id}", "note-${note.note_id}")'>edit</button>
              <button id='cancel-${note.note_id}' onclick='cancelButton("quill-div-${note.note_id}", "note-${note.idnote_id}")'>cancel</button>
              <button id='update-${note.note_id}' onclick='updateNote("quill-div-${note.note_id}", "note-${note.note_id}")'>update</button>
              <button id='delete-${note.note_id}' onclick='deleteNote("quill-div-${note.note_id}", "note-${note.note_id}")'>delete</button>
              <input type="checkbox" value = "${note.note_id}" id="select-check-box">
            `;

            notes.appendChild(noteDiv);

            //create the Quill
            const quill = new Quill(`#quill-div-${note.note_id}`, {
              modules: {
                toolbar: customToolbar //the name of the custom toolbar setting or module
              },
              theme: 'snow', //the theme of the style
              readOnly: true
            });

            //add the content of the note
            quill.root.innerHTML = note.note_content;

            //target the toolbar and make it hidden
            const toolbar = quill.getModule('toolbar').container;
            toolbar.classList.add('toolbar-hidden');

            tagsList = '';
          })

        }else if (data.notes.length == 0) {
          console.log(data.notes.length);

          const notes = document.getElementById('notes');

          notes.innerHTML = `<h3>we can't find any notes sorry</h3>`;
        }




        
        //remove the show more button
        const showMoreButton = document.getElementById('show-more');
        showMoreButton.remove();

        //create a back button to back to the normal views to views all the notes and git out from the search mode

        const cancelSearchButton = document.createElement('button');
        cancelSearchButton.id = 'cancel-search-button';
        cancelSearchButton.innerText = 'Cancel Search';
        cancelSearchButton.addEventListener('click', function (){cancelSearchMode()});

        notes.appendChild(cancelSearchButton);

        //hide the search form
        closeSearch ();

      })
      .catch(error => console.error('Error:', error));
  }

  
}




//cancel search mode function
function cancelSearchMode() {
  //delete the cancel search button
  const cancelSearchButton = document.getElementById('cancel-search-button');
  cancelSearchButton.remove();

  //load the notes all of them
  loadNotes()

  //create the show more button
  const showMoreButton = document.createElement('button');
  showMoreButton.id = 'show-more';
  showMoreButton.innerHTML = 'load more';

  const showMoreButtonAtrribute = document.createAttribute('data-offset');
  showMoreButtonAtrribute.value = 3;
  showMoreButton.setAttributeNode(showMoreButtonAtrribute);
  
  showMoreButton.addEventListener('click', function () {showMore()});

  //target the notes div
  const notesDiv = document.getElementById('notes');

  //set the show more button after the noteDiv
  notesDiv.insertAdjacentElement('afterend', showMoreButton);



}