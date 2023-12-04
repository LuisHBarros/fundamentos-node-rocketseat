import http from "http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";
// GET, POST, PUT, PATCH and DELETE
// GET - buscar informações
// POST - Criar informações
// PUT - Atualizar informações
// PATCH - Alterar informações específicas
// DELETE - Deletar informações

//Status Code{
//  200 -> Ok
//  201 -> Criado
//
//
//
//
//
//}
//  Query Parameters = URL Stateful => Filtros, Paginação, Nao obrigatória
//  userId = 1 & name=Luis;
//  Route Parameters = Identificação de recursos
//  localhost:3333/users/1
//  Request Body => Envio de informações de um formulário (HTTPs)

//Cabeçalhos (Requisição/Resposta) => metadados

const port = 3333;
const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    await json(req, res);

    const route = routes.find((route) => {
        return route.method === method && route.path.test(url);
    });
    if (route) {
        const routeParams = req.url.match(route.path);
        req.params = { ...routeParams.groups };
        // console.log(extractQueryParams(routeParams.groups.query));

        const { query, ...params } = routeParams.groups;

        req.params = params;
        req.query = query ? extractQueryParams(query) : {};

        return route.handler(req, res);
    }

    return res.writeHead(404).end();
});

server.listen(port);
