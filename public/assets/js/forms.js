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

  function toss(msg) {
    jQuery("#error-display").html(msg).slideDown(800).delay(8000).slideUp(800);
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
            toss("Validation error. \n Please input the correct values");
            return
          }
        } catch (e) {
          toss("Error: Please contact admin");
          return
        }
        const ajax = jQuery.ajax({
          url: "/login",
          type: "POST",
          dataType: "json",
          data: formData
        });

        ajax.done(function(data) {
          if (data.authorized === true && data.authorization) {
            location.href = data.route;
          // `${window.location.host}/${data.route}`.replace("//", "/");
          } else {
            toss(data.errorMessage);
            console.error("Else", data.errorMessage);
          }
        });

        ajax.fail(function(error) {
          toss("Error: Please try again.");
        });

        ajax.always(function() {
          console.log("complete");
        });


      });
    });

  });
}(window, document, jQuery))