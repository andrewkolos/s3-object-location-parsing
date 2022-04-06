import { S3ObjectLocation } from '../src/s3-object-location'

const bucket = 'bucket'

describe('ObjectLocation', () => {
  it('parses correctly when the key is just an object name', () => {
    const key = 'one'
    const source = [bucket, key].join('/')
    const parsed = S3ObjectLocation.parse(source)
    expect(parsed.bucket).toBe(bucket)
    expect(parsed.extension).toBe(undefined)
    expect(parsed.key).toBe(key)
    expect(parsed.filename).toBe(key)
    expect(parsed.prefix).toBe(undefined)
  })

  it('parses correctly when the key has one folder', () => {
    const key = 'one/two'
    const source = [bucket, key].join('/')
    const parsed = S3ObjectLocation.parse(source)
    expect(parsed.bucket).toBe(bucket)
    expect(parsed.extension).toBe(undefined)
    expect(parsed.key).toBe(key)
    expect(parsed.filename).toBe('two')
    expect(parsed.prefix).toBe('one')
  })

  it('parses correctly when the key has multiple folders', () => {
    const key = 'one/two/three/four'
    const source = [bucket, key].join('/')
    const parsed = S3ObjectLocation.parse(source)
    expect(parsed.bucket).toBe(bucket)
    expect(parsed.extension).toBe(undefined)
    expect(parsed.key).toBe(key)
    expect(parsed.filename).toBe('four')
    expect(parsed.prefix).toBe('one/two/three')
  })

  it('parses out a file extension correctly', () => {
    const key = 'one/two/three/four.wav'
    const source = [bucket, key].join('/')
    const parsed = S3ObjectLocation.parse(source)
    expect(parsed.bucket).toBe(bucket)
    expect(parsed.extension).toBe('.wav')
    expect(parsed.key).toBe(key)
    expect(parsed.filename).toBe('four.wav')
    expect(parsed.prefix).toBe('one/two/three')
  })

  it('fails to parse if either bucket or key is missing', () => {
    const key = 'one'
    const parseResult = S3ObjectLocation.tryParse(key)
    expect(parseResult.success).toBe(false)
  })

  it('fails to parse if a segment is empty (//)', () => {
    const key = 'one//two'
    const parseResult = S3ObjectLocation.tryParse({ bucket, key })
    expect(parseResult.success).toBe(false)
  })

  it('fails to parse extension is empty (dot is present, but nothing after that)', () => {
    const key = 'one.'
    const parseResult = S3ObjectLocation.tryParse({ bucket, key })
    expect(parseResult.success).toBe(false)
  })

  it('tryParse returns valid success object when parse is successful', () => {
    const key = 'one/two/three/four.wav'
    const parsed = S3ObjectLocation.tryParse({ bucket, key })
    expect(parsed.success).toBe(true)
    if (!parsed.success) throw Error()

    expect(parsed.value.bucket).toBe(bucket)
    expect(parsed.value.extension).toBe('.wav')
    expect(parsed.value.key).toBe(key)
    expect(parsed.value.filename).toBe('four.wav')
    expect(parsed.value.prefix).toBe('one/two/three')
  })

  it('parse throws error if unable to parse', () => {
    expect(() => S3ObjectLocation.parse('')).toThrow()
  })
})
