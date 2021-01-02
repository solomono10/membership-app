const checkbox = document.getElementById('checkCatalogue');
const submitContinue = document.getElementById('btnContinueSubmit');

checkbox.addEventListener('change', e => {
    const buttonText = e.target.checked ? "Continue" : "Submit";
    submitContinue.innerHTML = buttonText;
});
