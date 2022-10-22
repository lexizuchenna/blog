const forms = document.getElementsByClassName("remove");

if (forms) {
  for (i = 0; i < forms.length; i++) {
    forms[i].addEventListener("click", (e) => {
      if (e.target.classList.contains("delete")) {
        if (confirm("Confirm Delete")) {
          e.target.parentNode.submit();
        }
      }
    });
  }
}
