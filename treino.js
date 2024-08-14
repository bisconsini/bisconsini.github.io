document.addEventListener('DOMContentLoaded', function() {
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

        const exercise = {
            training: training,
            name: exerciseName,
            sets: sets,
            reps: reps,
            weight: weight,
            notes: notes
        };

        exercises.push(exercise);
        localStorage.setItem('exercises', JSON.stringify(exercises));

        addExerciseToTable(exercise, exercises.length - 1);
        form.reset();
    });

    function addExerciseToTable(exercise, index) {
        const table = document.getElementById('exerciseTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        newRow.innerHTML = `
            <td>${exercise.training}</td>
            <td>${exercise.name}</td>
            <td>${exercise.sets}</td>
            <td>${exercise.reps}</td>
            <td>${exercise.weight}</td>
            <td>${exercise.notes}</td>
            <td class="action-buttons">
                <button onclick="editExercise(${index})">Editar</button>
                <button class="delete" onclick="deleteExercise(${index})">Apagar</button>
            </td>
        `;
    }

    function editExercise(index) {
        const exercise = exercises[index];
        document.getElementById('training').value = exercise.training;
        document.getElementById('exerciseName').value = exercise.name;
        document.getElementById('sets').value = exercise.sets;
        document.getElementById('reps').value = exercise.reps;
        document.getElementById('weight').value = exercise.weight;
        document.getElementById('notes').value = exercise.notes;

        deleteExercise(index);
    }

    function deleteExercise(index) {
        exercises.splice(index, 1);
        localStorage.setItem('exercises', JSON.stringify(exercises));
        loadExercises();
    }

    function loadExercises() {
        const table = document.getElementById('exerciseTable').getElementsByTagName('tbody')[0];
        table.innerHTML = '';
        exercises.forEach((exercise, i) => addExerciseToTable(exercise, i));
    }

    function exportToFile() {
        let content = 'Treino, Exercício, Séries, Repetições, Peso, Observações\n';
        exercises.forEach(exercise => {
            content += `${exercise.training}, ${exercise.name}, ${exercise.sets}, ${exercise.reps}, ${exercise.weight}, ${exercise.notes}\n`;
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exercicios.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    function importFromFile() {
        const fileInput = document.getElementById('importFile');
        const file = fileInput.files[0];

        if (!file) {
            alert('Por favor, selecione um arquivo para importar.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const lines = text.split('\n');
            exercises = [];
            lines.slice(1).forEach(line => {
                const [training, name, sets, reps, weight, notes] = line.split(',').map(item => item.trim());
                if (training && name) {
                    exercises.push({
                        training,
                        name,
                        sets,
                        reps,
                        weight,
                        notes
                    });
                }
            });

            localStorage.setItem('exercises', JSON.stringify(exercises));
            loadExercises();
        };

        reader.readAsText(file);
    }

    // Carrega exercícios ao iniciar a página
    loadExercises();
});

