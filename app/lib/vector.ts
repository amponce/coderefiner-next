import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'

/**
 * Converts a Float32Array or number[] to a PostgreSQL vector literal string
 */
export function toVectorLiteral(vector: Float32Array | number[]): string {
  return `[${Array.from(vector).join(',')}]`;
}

/**
 * Creates a raw SQL query for finding similar code files by embedding
 */
export function createSimilarityQuery(
  embedding: Float32Array | number[],
  limit: number = 5,
  threshold: number = 0.8
): Prisma.Sql {
  return Prisma.sql`
    SELECT 
      cf.*,
      1 - (cf.embedding <=> ${toVectorLiteral(embedding)}::vector) as similarity
    FROM "CodeFile" cf
    WHERE 1 - (cf.embedding <=> ${toVectorLiteral(embedding)}::vector) > ${threshold}
    ORDER BY similarity DESC
    LIMIT ${limit}
  `;
}

/**
 * Creates a raw SQL query for updating a code file's embedding
 */
export function createEmbeddingUpdateQuery(
  fileId: string,
  embedding: Float32Array | number[]
): Prisma.Sql {
  return Prisma.sql`
    UPDATE "CodeFile"
    SET embedding = ${toVectorLiteral(embedding)}::vector
    WHERE id = ${fileId}
  `;
} 