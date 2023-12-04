import fs from "node:fs";

const dataBasePath = new URL("db.json", import.meta.url);

export class Database {
    #database = {};
    #persist() {
        fs.writeFileSync(dataBasePath, JSON.stringify(this.#database));
    }
    constructor() {
        try {
            const data = fs.readFileSync(dataBasePath, "utf8");
            this.#database = JSON.parse(data);
        } catch {
            this.#persist();
        }
    }
    select(table, search) {
        let data = this.#database[table] ?? [];
        // if (search) {
        //     data = data.filter((row) => {
        //         return Object.entries(search).some(([key, value]) => {
        //             console.log(key, value, row[key]);
        //         });
        //     });
        if (search) {
            data = data.filter((row) => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase());
                });
            });
        }
        return data;
    }
    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data);
        } else {
            this.#database[table] = [data];
        }
        this.#persist();
        return data;
    }
    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(
            (row) => row.id === id
        );
        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1);
            this.#persist();
        }
    }
    update(table, id, data) {
        console.log("here! {", table, id, data, "ends here}");

        const rowIndex = this.#database[table].findIndex(
            (row) => row.id === id
        );
        if (rowIndex > -1) {
            this.#database[table][rowIndex] = { id, ...data };
            this.#persist();
        }
        return rowIndex;
    }
}
