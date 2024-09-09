document.addEventListener('DOMContentLoaded', function() {
    const templateForm = document.getElementById('templateForm');
    const promptTemplate = document.getElementById('promptTemplate');
    const variableInputs = document.getElementById('variableInputs');
    const results = document.getElementById('results');

    promptTemplate.addEventListener('input', function() {
        const variables = this.value.match(/\{(\w+)\}/g) || [];
        variableInputs.innerHTML = '';
        variables.forEach(variable => {
            const varName = variable.replace(/[{}]/g, '');
            variableInputs.innerHTML += `
                <div class="mb-3">
                    <label for="${varName}" class="form-label">${varName}:</label>
                    <input type="text" class="form-control" id="${varName}" name="${varName}" required>
                </div>
            `;
        });
    });
    // ... existing code ...
templateForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    // Add the promptTemplate to the form data
    const promptTemplate = document.getElementById('promptTemplate').value;
    formData.append('promptTemplate', promptTemplate);

    fetch('/generate', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            results.innerHTML = `<p class="text-danger">Error: ${data.error}</p>`;
        } else {
            results.innerHTML = '<h3>Generated Queries:</h3><ul>';
            results.innerHTML += data.result;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        results.innerHTML = '<p class="text-danger">An error occurred. Please try again.</p>';
    });
});
// ... existing code ...
});