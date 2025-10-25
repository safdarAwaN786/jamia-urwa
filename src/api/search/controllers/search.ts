import { Context } from 'koa';
import MeiliSearch, { Index } from 'meilisearch';

// ✅ Initialize MeiliSearch client once
const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://127.0.0.1:7700',
  apiKey: process.env.MEILISEARCH_MASTER_KEY || process.env.MEILISEARCH_API_KEY || '',
});

export default {
  async index(ctx: Context) {
    try {
      const q = (ctx.request.query.q as string)?.trim();

      if (!q) {
        return ctx.badRequest("Missing search query parameter 'q'");
      }

      // ✅ Get all synced MeiliSearch indexes
      const indexes = await client.getIndexes();

      if (!indexes.results.length) {
        return ctx.send({ message: 'No synced indexes found in MeiliSearch.' });
      }

      // ✅ Search in each index
      const results = await Promise.all(
        indexes.results.map(async (index: Index<any>) => {
          const searchResults = await client.index(index.uid).search(q);
          return {
            index: index.uid,
            total: searchResults.estimatedTotalHits,
            hits: searchResults.hits,
          };
        })
      );

      return ctx.send({
        success: true,
        query: q,
        results: results.filter(r => r.hits.length > 0),
      });

    } catch (err: any) {
      strapi.log.error('❌ Search failed:', err);
      return ctx.internalServerError('Search failed');
    }
  },
};
