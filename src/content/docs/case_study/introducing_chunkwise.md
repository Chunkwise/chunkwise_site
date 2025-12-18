---
title: Introducing Chunkwise
sidebar:
  order: 3
---

### Chunkwise’s Solution

Chunkwise is an open-source, self-managed platform that addresses the chunking evaluation gap identified in existing solutions. It provides developers with systematic tools to compare chunking strategies and enables them to apply a selected strategy to the ingestion of a specific knowledge base via an easy-to-deploy ETL pipeline for downstream RAG systems.

Chunkwise employs a hybrid architecture that balances ease of use with data sovereignty. The client application runs locally in the user’s browsers, providing an intuitive interface for configuring chunking strategies and viewing evaluation results. The backend services are deployed and operated within the user’s Amazon Web Services (AWS) environment, allowing the user to retain full control over their infrastructure and data while benefiting from simplified, automated deployment and cost transparency.  
Chunkwise is designed for teams seeking to optimize their chunking strategies for AI applications, particularly in settings where data privacy is a priority and where building and maintaining a fully custom solution would be resource-intensive. Specifically, it provides two core components:

#### Experimentation Platform

Chunkwise supports systematic evaluation of chunking strategies through chunk visualization, distribution statistics, and retrieval-based evaluation metrics. For qualitative inspection, Chunkwise adapts [Chonkie’s](https://github.com/chonkie-inc/chonkie) visualization tool to provide a real-time representation of a chunked document, along with statistics summarizing the resulting chunks. This allows the user to identify issues such as inappropriate chunk boundaries and loss of semantic coherence. For quantitative evaluation, Chunkwise implements [Chroma’s](https://github.com/brandonstarxel/chunking_evaluation) chunking evaluation framework to benchmark chunking strategies for retrieval performance.

#### AI-Focused ETL Pipeline

![][image10]  
Once a chunking strategy has been evaluated and selected, Chunkwise provides a deployable ETL pipeline that ingests a knowledge base stored in an Amazon S3 bucket and outputs vector embeddings and associated metadata to an Amazon RDS for PostgreSQL using the `pgvector` extension. Currently, the pipeline supports plain text (`.txt`) and Markdown (`.md`) files.

First, documents are ingested from the specified S3 bucket. Next, they are chunked according to the user’s selected chunking strategy. Each chunk is then embedded using OpenAI’s `text-embedding-3-small` model. Finally, the resulting vector embeddings and metadata are stored in the vector database, where they are available for downstream retrieval or export to other vector databases.

### Existing Solutions

Existing solutions for chunking evaluation and RAG data ingestion pipelines generally fall into three categories:

#### AI-Focused ETL Pipeline Platforms

![][image11]  
[Chonkie](https://www.chonkie.ai/), [Vectorize](https://vectorize.io/), [Unstructured](https://unstructured.io/), and [LlamaCloud](https://www.llamaindex.ai/llamacloud-index) (by LlamaIndex) provide managed platforms for building AI-focused ETL pipelines. These platforms transform knowledge bases into vector embeddings through a particular workflow: data ingestion → parsing → chunking → embedding → export to a vector database.

In terms of chunking evaluation, Chonkie and Unstructured provide chunk visualization tools, while Vectorize provides a RAG evaluation sandbox that compares select chunking and embedding strategies using retrieval-based metrics. LlamaCloud does not currently provide chunking evaluation features and is therefore not included in the comparison table.

These platforms are well-suited for teams that require broad support for data sources, document formats, and embedding models, and are willing to rely on third-party managed services at the expense of reduced control and potential vendor lock-in.

#### DIY

Open-source frameworks such as [LlamaIndex](https://github.com/run-llama/llama_index) and [LangChain](https://github.com/langchain-ai/langchain) enable teams to build custom AI applications from the ground up by providing building blocks for constructing RAG data pipelines. They significantly reduce development time while preserving flexibility and control of a custom solution.

DIY approaches are appropriate for teams with sufficient engineering resources and expertise, particularly when data privacy and deep customization are top priorities. However, they require additional development effort to implement systematic chunking evaluation and visualization because the evaluation infrastructure must be built separately.

#### AI Observability and Engineering Platforms

AI observability platforms (e.g., [TruLens](https://www.trulens.org/), [Braintrust](https://www.braintrust.dev/), and [Arize Phoenix](https://phoenix.arize.com/)) focus on the observability and evaluation of AI applications by using traces to visualize the flow of data from user query to LLM response. AI engineering platforms (e.g., [Langfuse](https://langfuse.com/), [LangSmith](https://www.langchain.com/langsmith/evaluation), and [Arize](https://arize.com/)) provide infrastructure for deploying and iterating on AI applications with built-in observability and evaluation capabilities.

While these platforms excel at evaluating the overall performance of AI applications, they do not provide targeted evaluation of chunking strategies for retrieval. Hence, they are best suited for teams that have established an effective chunking strategy and seek to optimize other aspects of their AI applications.

<table>
  <thead>
    <tr>
      <th></th>
      <th style="vertical-align: middle;">
        <img 
          src="/src/assets/logos/logo.png" 
          width="40px" 
          alt="Chunkwise"
          style="display: block; margin: 0 auto;" 
        >
      </th>
      <th style="vertical-align: middle;">
        <img 
          src="/src/assets/logos/vectorize.png" 
          width="70px" 
          alt="Vectorize"
          style="display: block; margin: 0 auto;"
        >
      </th>
      <th style="vertical-align: middle;">
        <img 
          src="/src/assets/logos/chonkie_and_unstructured.png" 
          width="150px" 
          alt="Chonkie and Unstructured"
          style="display: block; margin: 0 auto;"
        >
      </th>
      <th style="vertical-align: middle; text-align: center;">
        DIY
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Open Source & Self-Managed</strong></td>
      <td align="center">✓</td>
      <td align="center">✕</td>
      <td align="center">✕</td>
      <td align="center">✓</td>
    </tr>
    <tr>
      <td><strong>Built-In Platform</strong></td>
      <td align="center">✓</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
      <td align="center">✕</td>
    </tr>
    <tr>
      <td><strong>Chunk Visualization</strong></td>
      <td align="center">✓</td>
      <td align="center">✕</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
    </tr>
    <tr>
      <td><strong>Retrieval-Based Evaluation</strong></td>
      <td align="center">✓</td>
      <td align="center">✓</td>
      <td align="center">✕</td>
      <td align="center">✓</td>
    </tr>
    <tr>
      <td><strong>ETL Pipeline</strong></td>
      <td align="center">⏤ <br>(limited support for data source and document formats)</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
      <td align="center">✓</td>
    </tr>
    </tbody>
</table>
