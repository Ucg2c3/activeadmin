//= require rails-ujs
//= require flowbite

// On page load or when changing themes, best to add inline in `head` to avoid FOUC
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark')
}



const setPerPage = function(event) {
  const params = new URLSearchParams(window.location.search)
  params.set("per_page", this.value)
  window.location.search = params
}

Rails.delegate(document, ".pagination_per_page > select", "change", setPerPage)



const disableEmptyFields = function(event) {
  Array.from(this.querySelectorAll("input, select, textarea"))
    .filter((el) => el.value === "")
    .forEach((el) => el.disabled = true)
};

Rails.delegate(document, ".filter_form", "submit", disableEmptyFields)

const next = function next(el, selector) {
  const nextEl = el.nextElementSibling;
  if (!selector || (nextEl && nextEl.matches(selector))) {
    return nextEl;
  }
  return null;
}

const setSearchType = function(event) {
  const input = next(this, "input")
  if (input) {
    input.name = `q[${this.value}]`
  }
};

Rails.delegate(document, ".filter_form_field.select_and_search select", "change", setSearchType)



const hasManyRemoveClick = function(event) {
  event.preventDefault()
  const oldGroup = this.closest("fieldset")
  if (oldGroup) {
    oldGroup.remove()
  }
}

Rails.delegate(document, "a.button.has_many_remove", "click", hasManyRemoveClick)

const hasManyAddClick = function(event) {
  event.preventDefault()
  const parent = this.closest(".has_many_container")

  let index = parseInt(parent.dataset.has_many_index || (parent.querySelectorAll('fieldset').length - 1), 10)
  parent.dataset.has_many_index = ++index

  const regex = new RegExp(this.dataset.placeholder, 'g')
  const html = this.dataset.html.replace(regex, index)

  const tempEl = document.createElement("div");
  tempEl.innerHTML = html
  this.before(tempEl.firstChild)
}

Rails.delegate(document, "a.button.has_many_add", "click", hasManyAddClick)



const batchActionClick = function(event) {
  event.preventDefault()
  // console.log("batchActionClick", event)
  let batchAction = document.getElementById("batch_action")
  if (batchAction) {
    batchAction.value = this.dataset.action
  }
}

const batchActionConfirmComplete = function(event) {
  // console.log('batchActionConfirmComplete', event.detail)
  if (event.detail[0] === true) {
    let form = document.getElementById("collection_selection")
    if (form) {
      form.submit()
    }
  }
}

const batchActionFormSubmit = function(event) {
  event.preventDefault();
  // console.log("batchActionFormSubmit", this)
  let json = JSON.stringify(Object.fromEntries(new FormData(this).entries()));
  let inputsField = document.getElementById('batch_action_inputs')
  if (json && inputsField) {
    inputsField.value = json
  }
  let form = document.getElementById("collection_selection")
  if (form) {
    form.submit()
  }
}

Rails.delegate(document, ".batch_actions_selector li a", "click", batchActionClick)

Rails.delegate(document, "form.batch-action-form", "submit", batchActionFormSubmit)

Rails.delegate(document, ".batch_actions_selector li a", "confirm:complete", batchActionConfirmComplete)

const toggleDropdown = function(condition) {
  const button = document.querySelector(".batch_actions_selector > button")
  if (button) {
    button.disabled = condition
  }
}

const toggleAllChange = function(event) {
  const checkboxes = document.querySelectorAll("input[type=checkbox].collection_selection")
  for (const checkbox of checkboxes) {
    checkbox.checked = this.checked
  }

  const rows = document.querySelectorAll(".paginated_collection tbody tr")
  for (const row of rows) {
    row.classList.toggle("selected", this.checked);
  }

  toggleDropdown(!this.checked)
}

Rails.delegate(document, "input[type=checkbox].toggle_all", "change", toggleAllChange)

const toggleCheckboxChange = function(event) {
  const numChecked = document.querySelectorAll("input[type=checkbox].collection_selection:checked").length;
  const allChecked = numChecked === document.querySelectorAll("input[type=checkbox].collection_selection").length;
  const someChecked = (numChecked > 0) && (numChecked < document.querySelectorAll("input[type=checkbox].collection_selection").length);

  const toggleAll = document.querySelector("input[type=checkbox].toggle_all")
  if (toggleAll) {
    toggleAll.checked = allChecked
    toggleAll.indeterminate = someChecked
  }

  toggleDropdown(numChecked === 0)
}

Rails.delegate(document, "input[type=checkbox].collection_selection", "change", toggleCheckboxChange)

const tableRowClick = function(event) {
  if (event.target.type !== "checkbox") {
    event.target.closest("tr").querySelector("input[type=checkbox]").click()
  }
}

Rails.delegate(document, ".paginated_collection tbody td", "click", tableRowClick)