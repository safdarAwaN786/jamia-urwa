"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meilisearch_1 = __importDefault(require("meilisearch"));
// ✅ Initialize MeiliSearch client once
const client = new meilisearch_1.default({
    host: process.env.MEILISEARCH_HOST || 'http://127.0.0.1:7700',
    apiKey: process.env.MEILISEARCH_MASTER_KEY,
});
exports.default = {
    async index(ctx) {
        var _a;
        try {
            const q = (_a = ctx.request.query.q) === null || _a === void 0 ? void 0 : _a.trim();
            if (!q) {
                return ctx.badRequest("Missing search query parameter 'q'");
            }
            // ✅ Get all synced MeiliSearch indexes
            const indexes = await client.getIndexes();
            if (!indexes.results.length) {
                return ctx.send({ message: 'No synced indexes found in MeiliSearch.' });
            }
            // ✅ Search in each index
            const results = await Promise.all(indexes.results.map(async (index) => {
                const searchResults = await client.index(index.uid).search(q);
                return {
                    index: index.uid,
                    total: searchResults.estimatedTotalHits,
                    hits: searchResults.hits,
                };
            }));
            return ctx.send({
                success: true,
                query: q,
                results: results.filter(r => r.hits.length > 0),
            });
        }
        catch (err) {
            strapi.log.error('❌ Search failed:', err);
            return ctx.internalServerError('Search failed');
        }
    },
};
