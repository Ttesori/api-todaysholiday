const els = {
  urlParams: new URLSearchParams(window.location.search),
  btnsHolidayDelete: document.querySelectorAll('.th-btnDelete'),
  txtsHolidayName: document.querySelectorAll('.th-txtName'),
  btnSearch: document.querySelector('.btn-search'),
  txtsHolidayTagName: document.querySelectorAll('.th-tag'),
  searchResultsEl: document.querySelector('.search-results'),
  tbodyHolidaysEl: document.querySelector('#tbody-holidays'),
  holidayTrEls: document.querySelectorAll('#tbody-holidays tr'),
  btnNextHolidays: document.getElementById('btn-nextHolidayGroup'),
  btnPrevHolidays: document.getElementById('btn-prevHolidayGroup'),
  btnNextHolidays2: document.getElementById('btn-nextHolidayGroup2'),
  btnPrevHolidays2: document.getElementById('btn-prevHolidayGroup2')
}

const state = {
  currentMin: 0,
  numToShow: 20,
  total: els.holidayTrEls.length
}

const init = () => {
  showUpdates()
  addEventListeners()
  showHolidays();
  showOrHideButtons();
}

const addEventListeners = () => {
  els.btnsHolidayDelete.forEach(button => button.addEventListener('click', (e) => deleteHoliday(e.path[2].id)));
  setupHolidayNameEventListeners();
  //els.btnSearch.addEventListener('click', searchEvent);
  //els.txtsHolidayTagName.forEach(tagEl => tagEl.addEventListener('blur', addTagToHoliday));
  els.btnNextHolidays.addEventListener('click', changePagination);
  els.btnPrevHolidays.addEventListener('click', changePagination);
  els.btnNextHolidays2.addEventListener('click', changePagination);
  els.btnPrevHolidays2.addEventListener('click', changePagination);
  setupTagNameEventListeners();
}

const showHolidays = () => {
  // Show elements in range, hide the rest
  for (let i = 0; i < els.holidayTrEls.length; i++) {
    let el = els.holidayTrEls.item(i);
    el.classList.add('hide');
    if (i >= state.currentMin && i < (state.currentMin + state.numToShow)) {
      el.classList.remove('hide');
    }
  }
}

const showOrHideButtons = () => {
  // Show or hide buttons
  els.btnNextHolidays.classList.remove('disabled');
  els.btnPrevHolidays.classList.remove('disabled');
  els.btnNextHolidays2.classList.remove('disabled');
  els.btnPrevHolidays2.classList.remove('disabled');
  if (state.currentMin - state.numToShow < 0) els.btnPrevHolidays.classList.add('disabled');
  if (state.currentMin + state.numToShow > state.total) els.btnNextHolidays.classList.add('disabled');
  if (state.currentMin - state.numToShow < 0) els.btnPrevHolidays2.classList.add('disabled');
  if (state.currentMin + state.numToShow > state.total) els.btnNextHolidays2.classList.add('disabled');
}

const changePagination = (e = '') => {
  // Increment or decrement numbers
  if (e.path[1].classList.contains('disabled')) return false;
  let dir;
  if (e) {
    e.preventDefault();
    let targetId = e.target.id || e.path[1].id;
    dir = (targetId === 'btn-nextHolidayGroup2' || targetId === 'btn-nextHolidayGroup') ? '+' : '-';
  } else {
    dir = '+'
  }

  // If direction is plus
  if (dir === '+') {
    state.currentMin = state.currentMin + state.numToShow;
    // if next is greater than length
    if (state.currentMin > state.total) {
      state.currentMin = state.pages * state.numToShow;
    }
  } else {
    // Direction is minus
    state.currentMin = state.currentMin - state.numToShow;
    // If prev is less than 0
    if (state.currentMin < 0) {
      state.currentMin = 0;
    }
  }
  showHolidays();
  showOrHideButtons();
}


const showUpdates = () => {
  if (els.urlParams.get('updated')) {
    //TODO: Work on way to show which has been updated
    let id = els.urlParams.get('which');
    document.getElementById(id).classList.add('updated');
  }
}


const setupHolidayNameEventListeners = () => {
  let nameTxtVal;
  // When element is clicked, save content
  els.txtsHolidayName.forEach(nameTxt => {
    nameTxt.addEventListener('click', (e) => {
      nameTxtVal = e.target.textContent.trim();
    });
    // When element is clicked off of, compare content and save if different
    nameTxt.addEventListener('blur', (e) => {
      let value = e.target.textContent.trim();
      if (nameTxtVal !== value) {
        // Update name in DB
        addTagToHoliday(e.path[2].id, value);
      }
    });
  });
}

const setupTagNameEventListeners = () => {
  let tagTxtVal;
  // When element is clicked, save content
  els.txtsHolidayTagName.forEach(tagTxt => {
    tagTxt.addEventListener('click', (e) => {
      tagTxtVal = e.path[0].value;
    });
    // When element is clicked off of, compare content and save if different
    tagTxt.addEventListener('blur', (e) => {
      let value = e.path[0].value;
      if (tagTxtVal !== value) {
        // Update tag in DB
        updateHoliday(e.path[2].id, value);
      }
    });
  });
}


const addTagToHoliday = async (id, selectedTag) => {
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


init();