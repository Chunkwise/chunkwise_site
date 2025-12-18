---
title: Background
sidebar:
  order: 2
---

### Context Engineering and RAG Data Ingestion Pipeline

Context engineering is the process of determining what information a Large Language Model (LLM) should receive at inference time. An LLM’s output depends critically on the relevance, structure, and scope of this input, which can be provided through prompts, memory mechanisms, tool interfaces, or retrieval-augmented generation.

Within RAG systems, retrieval refers to selecting relevant text from a knowledge base, such as documentation or a code repository. This selection is commonly performed through direct lookup, keyword search, or semantic search using vector embeddings. However, LLMs cannot reliably answer domain-specific queries unless the relevant knowledge is provided in machine-readable, well-scoped form. In practice, organizations typically store knowledge in long documents that mix unrelated topics. When retrieval returns such documents in full, models receive lengthy passages where relevant information is buried within unrelated content. Because LLMs process the entire provided context uniformly without selectively attending to relevant content, their ability to extract the necessary information is significantly hindered.

A knowledge base must therefore be structured so that retrieval can isolate and return smaller, focused segments from long passages. A central mechanism that enables this selective retrieval is chunking. RAG pipelines achieve this by preparing documents as smaller, well-defined segments called **chunks** that can be retrieved individually. This allows models to operate on targeted context rather than entire documents.

Specifically, RAG pipelines convert documents into retrieval-ready chunks via an ETL process that:  
![][image2]

- **extracts** files,
- **processes** text (e.g., normalizing Unicode characters to ASCII and removing unnecessary whitespace),
- **chunks** documents into segments,
- **embeds** each chunk as a vector, and
- **loads** the chunks and their vector embeddings into a vector store.

Once loaded, these chunks become the atomic units of retrieval, ensuring that models receive only the most relevant context for each query.

### Chunking

In RAG data pipelines, **chunking** is a critical pre-processing step that directly influences embedding quality and, hence, retrieval performance. By controlling the semantic density and structural integrity of each chunk, chunking determines how effectively relevant information can be surfaced and retrieved.  
![][image3]

There are three major reasons why proper chunking is important for applications involving vector databases or LLMs:

1. **Fitting context within model limits**: Embedding models have strict maximum context window lengths, and chunking ensures that each piece of data fits within these limits so that it can be embedded effectively.
2. **Improving search and retrieval**: Embedding models represent each chunk as a single vector. If a chunk mixes multiple unrelated topics, the embedding becomes a blurred average of multiple meanings, producing noisy and inaccurate retrieval. Well-formed chunks stay focused and coherent, leading to more accurate similarity search, cleaner context, and thus better grounding during generation.
3. **Reducing hallucinations and optimizing context**: Though many modern LLMs have large context windows, feeding them unchunked or overly long context can cause concept conflation and hallucination. Concise and relevant context improves LLM performance and frees up more of the context window for valuable prompt components such as detailed instructions, persona information, or few-shot examples.[^1]

![][image4]  
The challenge of chunking lies in finding an appropriate chunk size that is large enough to contain meaningful information for search and retrieval, yet small enough to improve LLM performance and reduce latency for compute-intensive operations such as RAG and agentic workflows. In addition, each chunk should remain structurally and semantically coherent, i.e., its boundaries should not split words, sentences, or other logical units.

#### Chunking Strategies

To address these requirements, various chunking strategies have emerged, each with distinct trade-offs in complexity, performance, and cost. Specifically, chunking strategies describe both how text is split and how those resulting chunks are adjusted through configurable parameters. Greg Kamradt, the creator of semantic chunking,[^2] categorizes chunking techniques into five levels of increasing sophistication:

**![][image5]**

1. **Length-based Chunking**: The most basic approach, which splits text based on a character or token count without regard for structure or meaning. Some implementations (e.g., LangChain’s `CharacterTextSplitter`) first split on a separator like `\n\n` and then merge the resulting pieces up to the target `chunk_size`.

   **![][image6]**

2. **Recursive Chunking**: A structure-aware method that splits text hierarchically using predefined separators (e.g., `"\n"` for paragraphs, `" "` for sentences, and `""` for words). It attempts higher-level splits first, falling back to lower-level ones when a chunk exceeds the configured `chunk_size`.
3. **Document-Type-Specific Chunking**: A specialized form of recursive chunking that is tailored to different document formats such as PDF, Markdown, and code, respecting the syntactic and formatting rules native to each document type.  
   **![][image7]**

4. **Semantic Chunking**: A content-aware method that groups semantically related text units (usually sentences) into coherent chunks by comparing the embeddings of adjacent text units. This approach produces more coherent, context-preserving chunks, but is also more computationally expensive.  
   **![][image8]**

5. **Agentic Chunking**: An LLM-driven approach where the model is prompted to chunk a document as a human would, i.e., guided by intent, structure, and meaning. This yields the most nuanced results but is costly and slow due to multiple LLM API calls and reasoning steps.

##### Chunking Parameters

Implementations of these approaches are available in a number of open-source libraries such as LangChain and Chonkie. While the choice of chunking approach determines how chunks are created, the configurable parameters it exposes control those outputs at a more granular level. Most chunkers typically share two core parameters:

- `chunk_size`: the maximum number of characters or tokens allowed in each chunk, which directly influences embedding granularity.
- `chunk_overlap`: the number of characters or tokens shared across adjacent chunks to preserve context continuity at chunk boundaries.

Recursive chunkers commonly introduce one additional parameter:

- `separators`: a list of delimiters (e.g., `["\n\n", "\n", " ", ""]`) that define the hierarchical split points.

Some providers may also expose algorithm-specific options. For example, LangChain’s text splitters include a `strip_whitespaces` parameter that trims leading and trailing whitespace to produce cleaner chunk boundaries. Most chunkers ship with reasonable defaults for advanced parameters, allowing users to only adjust the ones that matter for their use cases.

Together, the choice of chunking method and its configuration parameters define a chunking strategy, and modifying any component directly influences the resulting chunks and, consequently, the embeddings derived from them.

### Chunking Evaluation

Given the wide range of chunking methods and configuration options, selecting an optimal chunking strategy is challenging. Because document structures and contents vary, chunking cannot be treated as a fixed choice. Small adjustments in chunk size, overlap, separators, or other parameters can significantly affect retrieval performance. Different chunkers behave differently across data formats such as Markdown, code, or mixed-structure documents. Moreover, various downstream task requirements, such as retrieval precision, context length, latency constraints, and embedding cost, impose different demands on chunk granularity and structure. Therefore, systematic evaluation of chunking strategies is a critical step in data ingestion pipelines for RAG systems.

As one of the leading open-source vector database providers, Chroma (2024) [states](https://research.trychroma.com/evaluating-chunking):

_“\[T\]he choice of chunking strategy can have a significant impact on retrieval performance, with some strategies outperforming others by up to 9% in recall.”_

Despite the significance of chunking decisions, existing chunking libraries (such as LangChain and Chonkie) do not provide mechanisms for comparing or benchmarking chunking outputs across multiple strategies, creating a gap that our project aims to address.

#### Chunk Visualization

The most straightforward form of chunking evaluation is chunk visualization. Visual inspection allows users to qualitatively assess whether generated chunks have desirable properties, i.e., semantic coherence and structural integrity. Accompanying the visualization, chunk distribution statistics, including the total number of chunks, average chunk size, and minimum/maximum chunk lengths, provide quantitative insights into the shape of the resulting chunk set. These values also inform whether a strategy is compatible with a specific embedding model, particularly whether the largest chunk fits within the model’s maximum context window.

#### Retrieval-Based Evaluation

While chunk visualization and statistics offer descriptive insights, they do not directly measure how effectively a chunking strategy supports retrieval. Evaluating chunking through retrieval performance yields more actionable insights by revealing which strategies best surface relevant information for a specific retrieval task. Yet, despite chunking being a fundamental step in RAG data ingestion, research and tooling for retrieval-based evaluation of chunking strategies remain limited.

##### Token-level Metrics for Information Retrieval

A key challenge is that commonly used Information Retrieval (IR) benchmarks, such as precision and recall, are typically computed at the whole-document level. In AI-assisted retrieval, however, relevance often exists at a finer granularity: only specific token spans within a document may be relevant to a query, and those spans may be distributed across multiple documents in the corpus. Therefore, effective retrieval for LLM-based systems depends not only on identifying the correct documents but also on retrieving the relevant token spans (chunks), which ultimately determine what the LLM consumes as context and the quality of its output.

To address this gap, Chroma proposes a fine-grained, token-level evaluation framework for benchmarking retrieval accuracy and efficiency. They adapt classical IR metrics to operate at the token level:

- **Precision**: Among all retrieved tokens, how many are relevant?
- **Recall**: Among all relevant tokens in the corpus, how many are retrieved?

In addition, they introduce a third, retrieval-specific metric:  
![][image9]

- [**Intersection over Union (IoU)**](https://github.com/brandonstarxel/chunking_evaluation): A token-level metric inspired by the [Jaccard similarity coefficient](https://en.wikipedia.org/wiki/Jaccard_index) in computer vision. Treating text chunks as “bounding boxes,” IoU measures the degree of overlap between the retrieved chunk boundaries and the ground-truth relevant token spans. Higher IoU indicates tighter alignment between chunk boundaries and relevant information.

Finally, they provide a fourth metric:

- **Precision-Omega**: A variant of precision obtained under the assumption of perfect recall. It serves as an upper bound on token efficiency and is therefore less statistically significant, but provides a best-case reference point.

Together, Precision, Recall, IoU, and Precision-Omega provide a comprehensive view of how effectively a chunking strategy surfaces the relevant information.

#### Evaluation Dataset and Ground Truth

The calculation of these metrics requires a dataset and a ground-truth reference set:

- **Dataset**: This may consist of the full corpus to be chunked, or a representative sample of it.
- **Ground Truth** (Generated via an LLM):

1\) factual queries about the dataset, and  
2\) corresponding relevant excerpts (expressed as token spans) from the dataset.

To improve the quality of the ground truth, two thresholds are applied to filter out queries with overly similar phrasing and excerpts that are insufficiently relevant to their associated query.

Once the ground truth is established, multiple chunking strategies can be evaluated against the same dataset. Users can interpret the metrics through the lens of their downstream tasks to choose the strategy that best aligns with their retrieval priorities.

For instance, a user who values maximum recall may prefer a strategy that retrieves more relevant information even at the cost of larger or more chunks. In contrast, a user who prioritizes context efficiency may choose a strategy that yields more precise chunks with higher precision or IoU. This chosen strategy can then be applied to the full corpus or to other datasets with similar characteristics.

[^1]: [https://unstructured.io/blog/chunking-for-rag-best-practices](https://unstructured.io/blog/chunking-for-rag-best-practices)
[^2]: [https://developers.llamaindex.ai/python/examples/node_parsers/semantic_chunking/](https://developers.llamaindex.ai/python/examples/node_parsers/semantic_chunking/)
