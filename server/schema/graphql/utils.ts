import { scalarType } from 'nexus'
import { Encoder, Decoder } from 'msgpackr'
import { fromByteArray, toByteArray } from 'base64-js'
import { Kind } from 'graphql'

export const DateTime = scalarType({
    name: 'Date',
    asNexusMethod: 'date',
    description: 'The `Date` custom scalar type represents dates (sent over in integer form)',
    //@ts-ignore
    parseValue(value: string) {
        return new Date(value)
    },
    //@ts-ignore
    serialize(value: Date) {
        return new Date(value).toISOString()
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT)
            return new Date(ast.value)
        return null
    }
})

type Cursor<ValueType> = {
    /**
     * `Cursor.id` shortened for msgpack optimisation
     */
    i: string;
    /**
     * `Cursor.value` shortened for msgpack optimisation
     */
    v: ValueType;
}
const encoder = new Encoder()
const decoder = new Decoder()

/**
 * Serializes cursor object into messagepack base64-encoded string
 * @param v Cursor object
 * @returns base64-encoded cursor
 */
export function serializeCursor<ValueType>(v: Cursor<ValueType>): string {
    return fromByteArray(encoder.encode(v))
}

/**
 * Parses messagepack base64-encoded string into cursor object
 * @param v base64-encoded cursor
 * @returns Cursor object
 */
export function parseCursor<ValueType>(v: string): Cursor<ValueType> {
    return decoder.unpack(toByteArray(v)) as Cursor<ValueType>
}