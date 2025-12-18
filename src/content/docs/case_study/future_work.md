---
title: Future Work
sidebar:
  order: 7
---

### Additional Support

Creating an application that uses Retrieval Augmented Generation involves combining various pieces. There isn’t an agreed-upon best set of tools to use, or even parts to include, especially in the nascent world of LLM-based applications. In addition, many of these applications use pre-existing components, such as a database or a bucket containing a dataset of a certain type. Adding support for more options from the following areas would make Chunkwise more viable to anyone looking to make use of its services:

- **Data sources**: Dropbox, GitHub, Google Drive, etc.
- **Embedding models**: Chunkwise currently supports only OpenAI's `text-embedding-3-small`. However, chunking strategies that perform well with one embedding model may not generalize to others due to differences in vector space geometry and semantic representation. Supporting multiple embedding models would allow users to evaluate chunking performance across different retrieval contexts.
- **Chunkers**: both more types—including document-structure-aware chunkers and other advanced chunkers—and more configurable parameters for existing chunkers.
- **Destination databases**: support for user-provided vector stores such as existing PostgreSQL, MongoDB, or Pinecone database instances.
- **Data types**: such as multimodal data or non-text document formats that require specialized parsing.

### Evaluation Customization

Chunkwise automatically generates a ground-truth reference set for a specific document when it’s first evaluated against a chunking strategy, using a default query-generation configuration. While this offers a low-configuration, uniform experience, advanced users may want more fine-grained control over how evaluation and query generation are performed.

One improvement is to expose additional settings that influence the automatic query-generation process, such as the number of queries produced, the number of generation rounds, the duplicate-query threshold, and the poor-reference threshold. This would allow users to tailor evaluation rigor to their dataset or use case.

For users who already have domain-specific or commonly expected queries, the ability to provide custom query inputs would provide even greater flexibility. This would give users the most realistic evaluation results by aligning retrieval tests with the actual queries their systems will handle.

### Efficiency \& Transparency

The use of LLMs in applications makes certain actions somewhat unpredictable, not only in the eventual output of the model but also in the amount of tokens used and the time it takes. Improving these factors and providing transparency around these kinds of actions within Chunkwise would improve users’ experience and make it more viable in today's highly efficient tech landscape.

Behind the scenes, there are many opportunities to reduce the latency between requests and responses. Such opportunities lie in caching recent results, pre-generating example queries, and using already generated chunks for evaluation.

In terms of user-facing changes, giving them more insight into the potential temporal and monetary cost of their selected configurations could be greatly beneficial. This would manifest as a time and cost estimator based on the number of tokens. For example, once a user selects their chunking strategy, it might calculate that it would take approximately five cents and three seconds for every 10,000 input tokens. With this, users could infer a rough overall timeline and cost to generate chunks and embeddings for their dataset. Another user-facing update for even more cost-aware users would add the option to toggle some of the more costly operations, such as semantic chunking, which uses an LLM to generate chunks.
