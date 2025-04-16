-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add HNSW index for faster similarity searches
CREATE INDEX code_files_embedding_idx ON "CodeFile" USING hnsw (embedding vector_cosine_ops) WITH (dims=1536);

-- Add a GiST index as a backup for exact searches
CREATE INDEX code_files_embedding_gist_idx ON "CodeFile" USING gist (embedding vector_ops); 