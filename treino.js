if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registrado com sucesso.'))
    .catch((error) => console.log('Falha ao registrar o Service Worker:', error));
}

const form = document.getElementById('exerciseForm');
let exercises = JSON.parse(localStorage.getItem('exercises')) || [];

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const training = document.getElementById('training').value;
    const exerciseName = document.getElementById('exerciseName').value;
    const sets = document.getElementById('sets').value;
    const reps = document.getElementById('reps').value;
    const weight = document.getElementById('weight').value || '';
    const notes = document.getElementById('notes').value || '';

    exercises.push({ training, exerciseName, sets, reps, weight, notes });
    localStorage.setItem('exercises', JSON.stringify(exercises));

    form.reset();
    renderTable();
});

function renderTable() {
    const tbody = document.querySelector('#exerciseTable tbody');
    tbody.innerHTML = '';

    exercises.forEach((exercise, index) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${exercise.training}</td>
            <td>${exercise.exerciseName}</td>
            <td>${exercise.sets}</td>
            <td>${exercise.reps}</td>
            <td>${exercise.weight}</td>
            <td>${exercise.notes}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editExercise(${index})">Editar</button>
                    <button class="delete" onclick="deleteExercise(${index})">Apagar</button>
                </div>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function editExercise(index) {
    const exercise = exercises[index];

    document.getElementById('training').value = exercise.training;
    document.getElementById('exerciseName').value = exercise.exerciseName;
    document.getElementById('sets').value = exercise.sets;
    document.getElementById('reps').value = exercise.reps;
    document.getElementById('weight').value = exercise.weight;
    document.getElementById('notes').value = exercise.notes;

    exercises.splice(index, 1);
    localStorage.setItem('exercises', JSON.stringify(exercises));
    renderTable();
}

function deleteExercise(index) {
    exercises.splice(index, 1);
    localStorage.setItem('exercises', JSON.stringify(exercises));
    renderTable();
}

function importFromFile() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            exercises = JSON.parse(e.target.result);
            localStorage.setItem('exercises', JSON.stringify(exercises));
            renderTable();
        } catch (error) {
            alert('Erro ao importar arquivo.');
        }
    };

    reader.readAsText(file);
}

function exportToFile() {
    const dataStr = JSON.stringify(exercises, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'exercises.txt';
    link.click();

    URL.revokeObjectURL(url);
}

renderTable();

