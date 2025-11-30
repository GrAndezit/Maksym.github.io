document.addEventListener('DOMContentLoaded', () => {
    console.log('custom.js loaded ✅');

    // Rating sliders -> live value labels
    setupRatingSlider('ratingProject', 'ratingProjectValue');
    setupRatingSlider('ratingTimeline', 'ratingTimelineValue');
    setupRatingSlider('ratingBudget', 'ratingBudgetValue');

    // Handle contact form submission
    setupContactFormHandler();
});

/**
 * Connects a range input to a span that displays its value.
 */
function setupRatingSlider(sliderId, outputId) {
    const slider = document.getElementById(sliderId);
    const output = document.getElementById(outputId);

    if (!slider || !output) return;

    output.textContent = slider.value;

    slider.addEventListener('input', () => {
    output.textContent = slider.value;
    });
}

/**
 * Prevents default submit, collects values, logs object,
 * and prints it below the form.
 */
function setupContactFormHandler() {
    const form = document.querySelector('.php-email-form');
    if (!form) return;

    const output = document.getElementById('form-output');
    const popup = document.getElementById('success-popup');

    form.addEventListener(
        'submit',
        (event) => {
            // Prevent page reload and stop other JS submit handlers
            event.preventDefault();
            event.stopImmediatePropagation();


            /* Task 5 */

            const ratingProject = Number(form.rating_project.value);
            const ratingTimeline = Number(form.rating_timeline.value);
            const ratingBudget  = Number(form.rating_budget.value);

            // Collect values into an object
            const formData = {
                firstName: form.first_name.value.trim(),
                lastName: form.last_name.value.trim(),
                email: form.email.value.trim(),
                phone: form.phone.value.trim(),
                address: form.address.value.trim(),
                ratingProject,
                ratingTimeline,
                ratingBudget,
            };

            if (!formData.firstName ||
                !formData.lastName ||
                !formData.email ||
                !formData.phone ||
                !formData.address
                ) {
                    alert("Please fill in all required fields.");
                    return; 
                }

            const averageRaw = (ratingProject + ratingTimeline + ratingBudget) / 3; // 2 + 3 + 7 = 12
            const average = Math.round(averageRaw * 10) / 10;

            let avgClass = 'avg-low';
            if (average > 4 && average <= 7) avgClass = 'avg-mid';
            else if (average > 7) avgClass = 'avg-high';


            // 1) Print object in console
            console.log("Form data:", formData, "Average:", average);

            // 2) Display data below the form
            output.innerHTML = `
                <div><strong>Name:</strong> ${formData.firstName}</div>
                <div><strong>Surname:</strong> ${formData.lastName}</div>
                <div><strong>Email:</strong> ${formData.email}</div>
                <div><strong>Phone number:</strong> ${formData.phone}</div>
                <div><strong>Address:</strong> ${formData.address}</div>
                <div><strong>Project clarity (1-10):</strong> ${formData.ratingProject}</div>
                <div><strong>Timeline urgency (1-10):</strong> ${formData.ratingTimeline}</div>
                <div><strong>Budget readiness (1-10):</strong> ${formData.ratingBudget}</div>
                <div class="average-line ${avgClass}">
                    <strong>${formData.firstName} ${formData.lastName}:</strong> ${average}
                </div>
            `;

            // ---- SHOW SUCCESS POPUP ----
            popup.classList.add('show');

            // Hide after 3 seconds
            setTimeout(() => {
                popup.classList.remove('show');
            }, 3000);   
        },
        true // capture phase so we run before template's own handler
    );
}
