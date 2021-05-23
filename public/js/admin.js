const els = {
  urlParams: new URLSearchParams(window.location.search),
  btnsHolidayDelete: document.querySelectorAll('.th-btnDelete'),
  txtsHoldayName: document.querySelectorAll('.th-txtName'),
  btnSearch: document.querySelector('.btn-search'),
  txtsHolidayTagName: document.querySelectorAll('.th-tag'),
  searchResultsEl: document.querySelector('.search-results'),
  txtAddTag: document.querySelector('#txt-addTag'),
  btnAddTag: document.querySelector('#btn-addTag'),
  tagNameEls: document.querySelectorAll('.th-tagName'),
  btnRemoveTag: document.querySelectorAll('.btn-removeTag')
}

const init = () => {
  showUpdates()
  addEventListeners()
}

const addEventListeners = () => {
  els.btnsHolidayDelete.forEach(button => button.addEventListener('click', (e) => deleteHoliday(e.path[2].id)));
  setupHolidayNameEventListeners();
  els.btnSearch.addEventListener('click', searchEvent);
  els.txtsHolidayTagName.forEach(tagEl => tagEl.addEventListener('blur', addTagToHoliday));
  els.btnAddTag.addEventListener('click', addTag);
  setupTagNameEventListeners();
  els.btnRemoveTag.forEach(el => el.addEventListener('click', e => deleteTag(el.dataset.id)));
}

const showUpdates = () => {
  if (els.urlParams.get('updated')) {
    //TODO: Work on way to show which has been updated
    let id = els.urlParams.get('which');
    document.getElementById(id).classList.add('updated');
  }
}


const searchEvent = async (e) => {
  let query = encodeURIComponent(document.querySelector('.text-search').value);
  let resp = await fetch(`/holidays/search?s=${query}`);
  let results = await resp.json();
  if (!results.length) return els.searchResultsEl.textContent = 'No results found.';
  results.forEach(result => {
    const newEl = document.createElement('li');
    newEl.textContent = `${result.month}/${result.day}: ${result.name}`;
    els.searchResultsEl.appendChild(newEl);
  });
}


const setupHolidayNameEventListeners = () => {
  let nameTxtVal;
  // When element is clicked, save content
  els.txtsHoldayName.forEach(nameTxt => {
    nameTxt.addEventListener('click', (e) => {
      nameTxtVal = e.target.textContent.trim();
    });
    // When element is clicked off of, compare content and save if different
    nameTxt.addEventListener('blur', (e) => {
      let value = e.target.textContent.trim();
      if (nameTxtVal !== value) {
        // Update name in DB
        updateHoliday(e.path[1].id, value);
      }
    });
  });
}


const addTagToHoliday = async (e) => {
  const id = e.target.parentElement.parentElement.id;
  const selectedTag = e.target.value;
  if (selectedTag === '') return false;
  const body = {
    holiday_id: id,
    tagname: selectedTag
  }
  try {
    let resp = await fetch('/holidays/tag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    let success = await resp.status;
    if (success === 200) {
      //console.log(resp);
      alert('Tag has been added/changed');
      //location.href = '?addedTag=true';
    }
  } catch (err) {
    console.log(err)
  }
}

const updateHoliday = async (id, value) => {
  let update = {
    id: id,
    update: {
      name: value
    }
  };
  try {
    let resp = await fetch('/holidays', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(update)
    });
    if (resp.status === 200) {
      // Holiday updated successfully
      alert('Holiday has been updated.');
      //location.href = `?updated=true&which=${id}`
    }

  } catch (error) {
    console.log(error);
  }
}

const deleteHoliday = async (id) => {
  try {
    let resp = await fetch('/holidays', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: id })
    });
    if (resp.status = 200) {
      alert('Holiday has been deleted.');
      document.getElementById(id).remove();
    }
  } catch (error) {
    console.log(error);
  }
}

let tagTxtVal;
const setupTagNameEventListeners = () => {
  // When element is clicked, save content
  els.tagNameEls.forEach(el => {
    el.addEventListener('click', (e) => {
      tagTxtVal = e.target.textContent.trim();
    });
    // When element is clicked off of, compare content and save if different
    el.addEventListener('blur', (e) => {
      let value = e.target.textContent.trim();
      if (tagTxtVal !== value) {
        // Update name in DB
        //console.log(el.dataset.id, tagTxtVal, value);
        updateTag(el.dataset.id, value);
      }
    });
  });
}


// Add new tag
const addTag = async () => {
  const newTag = els.txtAddTag.value;
  if (newTag === '') return false;
  try {
    let resp = await fetch('/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tagname: newTag
      })
    });
    let success = await resp.status;
    if (success === 200) {
      //console.log(resp);
      alert('Tag has been added');
      location.reload();
    }
  } catch (err) {
    console.log(err)
  }

}

// Change tag
const updateTag = async (id, value) => {
  if (value === '') return false;
  try {
    let resp = await fetch('/tags', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        tagname: value
      })
    });
    let success = await resp.status;
    if (success === 200) {
      //console.log(resp);
      alert('Tag has been updated');
      //location.href = '?addedTag=true';
    }
  } catch (err) {
    console.log(err)
  }
}

// Delete tag only if holidays are zero
const deleteTag = async (id) => {
  try {
    let resp = await fetch('/tags', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id
      })
    });
    console.log(await resp.json());
    alert('Tag has been removed');
    document.querySelector(`tr[data-id="${id}"]`).remove();
  } catch (err) {
    console.log(err)
  }
}

init();