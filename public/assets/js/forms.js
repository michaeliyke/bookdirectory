(function(w, sapi, jQuery) {

  function validate(obj) {
    let {email} = obj; //michael.iyke.ike@gmail.google.com
    email = email.replace(/[._-]/g, "");
    const parts = email.split("@");
    for (const part of parts) {
      if (parts.length > 2 || /\W/.test(part) || +part[0] == part[0]) {
        return false;
      }
    }
    return true;
  }
  // names to limit reach or skip certain fields which are to be handled differently
  function createFormData(form, details) {
    const formData = {};
    formData.details = {};
    (function glob(node) {
      if (node instanceof HTMLInputElement && details.types.indexOf(node.type) != -1) {
        formData[node.name] = node.value;
        formData.details[node.name] = node.value;
      }
      node = node.firstChild;
      while (node) {
        glob(node);
        node = node.nextSibling;
      }
    }(form));
    return formData;
  }

  jQuery(function($) {

    const a = alert;


    const forms = sapi.forms;

    const details = {
      types: ["text", "password"],
      names: null
    };
    [].forEach.call(forms, (form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        try {
          var formData = createFormData(form, details);
          const invalidForm = !validate({
              email: formData.email,
          });
          if (invalidForm) {
            console.error("Validation error. \n Please input the correct values");
            return
          }
        } catch (e) {
          console.error(err);
          return
        }
        jQuery.ajax({
          url: "/login",
          type: "POST",
          dataType: "json",
          data: formData
        })
          .done(function() {
            console.log("success");
          })
          .fail(function() {
            console.log("error");
          })
          .always(function() {
            console.log("complete");
          });


      });
    });

  });
}(window, document, jQuery))