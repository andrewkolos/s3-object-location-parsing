import { ParseResult } from './parse-result'

interface ParsedObjectLocationInfo {
  bucket: string
  prefix: string | undefined
  key: string
  name: string
}

export interface BucketAndKey {
  bucket: string
  key: string
}

/**
 * Represents, as a string, the location of an s3 object, including the object's bucket and key.
 * Helps with parsing or building S3 location/source strings.
 */
export class S3ObjectLocation {
  /**
   * Builds an instance from an object representing the s3 object's location.
   * @param value An object containing the bucket and key that constitute the object source.
   */
  static parse(value: BucketAndKey): S3ObjectLocation
  /**
   * Builds an instance from a string representing the S3 object's location.
   * @param source A string representing the object's location/source.
   */
  static parse(source: string): S3ObjectLocation
  static parse(source: BucketAndKey | string) {
    const parsedSource = parseFromObjectOrString(source)
    const tryParseResult = S3ObjectLocation.tryParse(parsedSource)
    if (!tryParseResult.success) {
      throw Error(`The provided S3 source string is not valid. Value provided: ${source}`)
    }
    return tryParseResult.value
  }

  /**
   * Attempts to build an instance from a string or object representing a source.
   * @param source A string representing the source.
   * @returns An object indicating whether or not the source could be parsed. If it could be parsed,
   *  the object will also contain an object instance representing the parsed source.
   */
  static tryParse(source: string): ParseResult<S3ObjectLocation>
  /**
   * Attempts to build an instance from a string or object representing a source.
   * @param source An object representing the source.
   * @returns An object indicating whether or not the source could be parsed. If it could be parsed,
   *  the object will also contain an object instance representing the parsed source.
   */
  static tryParse(source: BucketAndKey): ParseResult<S3ObjectLocation>
  static tryParse(source: BucketAndKey | string): ParseResult<S3ObjectLocation> {
    const parsedLocation = parseFromObjectOrString(source)
    const reMatchArray = /^([^/]+?)((?:\/[^/]+)*)(\/[^/.]+(\.[A-Za-z0-9]+)?)$/.exec(parsedLocation)
    if (reMatchArray == null) return { success: false }
    return {
      success: true,
      value: new S3ObjectLocation({
        bucket: reMatchArray[1],
        prefix: reMatchArray[2] ? reMatchArray[2].substring(1) : undefined,
        key: `${reMatchArray[2] ? `${reMatchArray[2].substring(1)}/` : ''}${reMatchArray[3].substring(1)}`,
        name: reMatchArray[3].substring(1),
      }),
    }
  }

  #bucket: string

  #prefix: string | undefined

  #key: string

  #filename: string

  /**
   * The portion of the location string representing the bucket.
   */
  public get bucket() {
    return this.#bucket
  }

  /**
   * The portion of the location string representing the prefix. Will be undefined in the case
   * that the location consists of only a bucket name and a file name (e.g. bucket/file.pdf).
   */
  public get prefix() {
    return this.#prefix
  }

  /**
   * The portion of the location string representing the key.
   */
  public get key() {
    return this.#key
  }

  /**
   * The portion of the location string representing the name of the object. Will include the extension.
   * This is equivalent to the key with the prefix removed.
   */
  public get filename() {
    return this.#filename
  }

  /**
   * The file extension on the name of the object, if it exists. Will include the dot.
   */
  public get extension(): string | undefined {
    const splitByDot = this.filename.split('.')
    const noDotsFound = splitByDot.length === 1
    return noDotsFound ? undefined : `.${splitByDot.pop()}`
  }

  /**
   * The string representation of this location. Includes the bucket and key.
   */
  public toString() {
    return `${this.bucket}/${this.key}`
  }

  private constructor(info: ParsedObjectLocationInfo) {
    const { bucket, prefix, key, name } = info
    this.#bucket = bucket
    this.#prefix = prefix
    this.#key = key
    this.#filename = name
  }
}

function parseFromObjectOrString(location: BucketAndKey | string): string {
  return typeof location === 'string' ? location : `${location.bucket}/${location.key}`
}
