document.addEventListener('DOMContentLoaded', function() {
    const templateForm = document.getElementById('templateForm');
    const promptTemplate = document.getElementById('promptTemplate');
    const variableInputs = document.getElementById('variableInputs');
    const results = document.getElementById('results');
    const loadingSpinner = document.getElementById('loadingSpinner');

    function updateVariableInputs() {
        const variables = promptTemplate.value.match(/\{(\w+)\}/g) || [];
        variableInputs.innerHTML = variables.map(variable => {
            const varName = variable.replace(/[{}]/g, '');
            return `
                <div class="mb-3">
                    <label for="${varName}" class="form-label">${varName}:</label>
                    <input type="text" class="form-control" id="${varName}" name="${varName}" required>
                </div>
            `;
        }).join('');
    }

    function displayResults(data) {
        loadingSpinner.style.display = 'none';  // Hide the spinner
        if (data.error) {
            results.innerHTML = `<p class="text-danger">Error: ${data.error}</p>`;
        } else {
            results.innerHTML = '<h3>Generated Queries:</h3><ul>' + data.result;
        }
    }

    function handleError(error) {
        loadingSpinner.style.display = 'none';  // Hide the spinner
        console.error('Error:', error);
        results.innerHTML = '<p class="text-danger">An error occurred. Please try again.</p>';
    }

    promptTemplate.addEventListener('input', updateVariableInputs);

    templateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        results.innerHTML = '';  // Clear previous results
        loadingSpinner.style.display = 'block';  // Show the spinner

        const formData = new FormData(this);
        formData.append('promptTemplate', promptTemplate.value);

        fetch('/generate', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(displayResults)
        .catch(handleError);
    });
});