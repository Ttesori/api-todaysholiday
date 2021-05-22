let urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('updated')) {
  //TODO: Work on way to show which has been updated
  let id = urlParams.get('which');
  document.getElementById(id).classList.add('updated');
}

let buttons = document.querySelectorAll('.th-btnDelete');
buttons.forEach(button => {
  button.addEventListener('click', (e) => {
    //console.log(e.path[2].id);
    // Delete item from DB
    deleteHoliday(e.path[2].id);
  })
});
let names = document.querySelectorAll('.th-txtName');
let nameTxtVal;
names.forEach(nameTxt => {
  nameTxt.addEventListener('click', (e) => {
    nameTxtVal = e.target.textContent.trim();
  });
  nameTxt.addEventListener('blur', (e) => {
    let value = e.target.textContent.trim();
    if (nameTxtVal !== value) {
      // Update name in DB
      updateHoliday(e.path[1].id, value);
    }
  });
});

document.querySelector('.btn-search').addEventListener('click', async () => {
  let query = encodeURIComponent(document.querySelector('.text-search').value);
  let resp = await fetch(`/holidays/search?s=${query}`);
  let results = await resp.json();
  let resultsEl = document.querySelector('.search-results');
  if (!results.length) return resultsEl.textContent = 'No results found.';
  results.forEach(result => {
    resultsEl.innerHTML += `<li>${result.month}/${result.day}: ${result.name}</li>`;
  });
});

const addTag = async (e) => {
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
      location.href = '?addedTag=true';
    }
  } catch (err) {
    console.log(err)
  }
}

let tagEls = document.querySelectorAll('.th-tag');
tagEls.forEach(tagEl => {
  tagEl.addEventListener('blur', addTag)
});

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
      location.href = `?updated=true&which=${id}`
    }

  } catch (error) {
    console.log(error);
  }
}

const deleteHoliday = async (id) => {
  console.log(id);
  try {
    let resp = await fetch('/holidays', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: id })
    });
    console.log(resp);
    location.reload();
  } catch (error) {
    console.log(error);
  }
}