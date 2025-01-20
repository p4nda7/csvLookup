document.getElementById('csvFile').addEventListener('change', handleFileSelect);
document.getElementById('searchInput').addEventListener('input', handleSearch);
document.getElementById('columnSelect').addEventListener('change', handleColumnSelect);
document.getElementById('reverseSortCheckbox').addEventListener('change', handleColumnSelect);

let currentSortColumn = null;

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        processData(text);
    };
    reader.readAsText(file);
    toggleLoading(true);
}

function toggleLoading(isLoading) {
    document.getElementById('loading').style.display = isLoading ? 'block' : 'none';
}

function processData(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    populateHeaders(headers);
    populateColumnSelect(headers);
    populateTableBody(lines, headers);
    toggleLoading(false);
}

function populateHeaders(headers) {
    const headerRow = document.getElementById('headerRow');
    headerRow.innerHTML = '';
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
}

function populateColumnSelect(headers) {
    const columnSelect = document.getElementById('columnSelect');
    columnSelect.innerHTML = '';
    headers.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        columnSelect.appendChild(option);
    });
}

function populateTableBody(lines, headers) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const row = document.createElement('tr');
        const values = lines[i].split(',').map(value => value.trim());
        
        values.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });

        row.addEventListener('click', () => showDetails(headers, values));
        tableBody.appendChild(row);
    }
}

function handleColumnSelect() {
    const selectedColumn = document.getElementById('columnSelect').value;
    const headers = Array.from(document.getElementById('headerRow').getElementsByTagName('th')).map(th => th.textContent);
    const columnIndex = headers.indexOf(selectedColumn);

    if (columnIndex >= 0) {
        const reverseSort = document.getElementById('reverseSortCheckbox').checked;
        const sortOrder = reverseSort ? -1 : 1;
        sortTable(columnIndex, sortOrder);
    }
}

function sortTable(columnIndex, sortOrder) {
    const table = document.getElementById('csvTable');
    const rows = Array.from(table.rows).slice(1);
    const isNumericColumn = !isNaN(rows[0].cells[columnIndex].textContent);

    rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].textContent;
        const cellB = b.cells[columnIndex].textContent;

        if (isNumericColumn) {
            return sortOrder * (parseFloat(cellA) - parseFloat(cellB));
        } else {
            return sortOrder * cellA.localeCompare(cellB);
        }
    });

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));
}

function handleSearch() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.getElementById('tableBody').getElementsByTagName('tr');

    for (let row of rows) {
        const cells = row.getElementsByTagName('td');
        let found = false;

        for (let cell of cells) {
            if (cell.textContent.toLowerCase().includes(searchText)) {
                found = true;
                break;
            }
        }

        row.style.display = found ? '' : 'none';
    }
}

function showDetails(headers, values) {
    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = '';

    headers.forEach((header, index) => {
        const detailItem = document.createElement('p');
        detailItem.innerHTML = `<strong>${header}:</strong> ${values[index]}`;
        detailContent.appendChild(detailItem);
    });

    const modal = document.getElementById('detailModal');
    modal.style.display = 'block';
}

// Schließen des Modals
const modal = document.getElementById('detailModal');
const span = document.getElementsByClassName('close')[0];

span.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}