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
                <div class="animate-fade-in">
                    <label for="${varName}" class="block text-sm font-medium text-gray-700 mb-1">${varName}:</label>
                    <input type="text" class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500" id="${varName}" name="${varName}" required>
                </div>
            `;
        }).join('');
    }

    function displayResults(data) {
        loadingSpinner.classList.add('hidden');
        results.classList.remove('hidden');
        results.classList.add('animate-slide-up');
        if (data.error) {
            results.innerHTML = `<p class="text-red-600">Error: ${data.error}</p>`;
        } else {
            results.innerHTML = `
                <h3 class="text-2xl font-semibold mb-4 text-indigo-600">Generated Queries:</h3>
                <ul class="space-y-2">
                    ${data.result}
                </ul>
            `;
        }
    }

    function handleError(error) {
        loadingSpinner.classList.add('hidden');
        results.classList.remove('hidden');
        results.classList.add('animate-slide-up');
        console.error('Error:', error);
        results.innerHTML = '<p class="text-red-600">An error occurred. Please try again.</p>';
    }

    promptTemplate.addEventListener('input', updateVariableInputs);

    templateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        results.innerHTML = '';
        results.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');

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