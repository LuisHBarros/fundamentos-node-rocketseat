import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/users"),
        handler: (req, res) => {
            const { search } = req.query;
            console.log(search);

            const users = database.select(
                "users",
                search
                    ? {
                          nome: search,
                          email: search,
                      }
                    : null
            );
            return res.end(JSON.stringify(users));
        },
    },
    {
        method: "POST",
        path: buildRoutePath("/users"),
        handler: (req, res) => {
            const { nome, email } = req.body;
            const user = { nome: nome, email: email, id: randomUUID() };
            database.insert("users", user);
            return res.end();
        },
    },
    {
        method: "DELETE",
        path: buildRoutePath("/users/:id"),
        handler: (req, res) => {
            req;
            const { id } = req.params;
            database.delete("users", id);
            return res.writeHead(202).end();
        },
    },
    {
        method: "PUT",
        path: buildRoutePath("/users/:id"),
        handler: (req, res) => {
            req;
            const { id } = req.params;
            const { nome, email } = req.body;
            database.update("users", id, {
                nome,
                email,
            });
            return res.writeHead(202).end();
        },
    },
];
