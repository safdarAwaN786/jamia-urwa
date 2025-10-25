"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'GET',
            path: '/search',
            handler: 'search.index',
            config: {
                auth: false,
            },
        },
    ],
};
