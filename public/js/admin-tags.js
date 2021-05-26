const els = {
  urlParams: new URLSearchParams(window.location.search),
  txtAddTag: document.querySelector('#txt-addTag'),
  btnAddTag: document.querySelector('#btn-addTag'),
  tagNameEls: document.querySelectorAll('.th-tagName'),
  btnRemoveTag: document.querySelectorAll('.btn-removeTag'),
}

const init = () => {
  addEventListeners()
}

const addEventListeners = () => {
  els.btnAddTag.addEventListener('click', addTag);
  setupTagNameEventListeners();
  els.btnRemoveTag.forEach(el => el.addEventListener('click', e => deleteTag(el.dataset.id)));
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
    document.querySelector(`span[data-id="${id}"]`).remove();
  } catch (err) {
    console.log(err)
  }
}

init();