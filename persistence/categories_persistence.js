const fs = require('fs');
const dataFile = "./categoriesData.json";

function loadCategoriesData() {
    if (fs.existsSync(dataFile)) {
        return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    }
    return {};
}

function saveCategoriesData() {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}