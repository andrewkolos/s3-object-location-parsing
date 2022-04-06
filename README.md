# @akolos/s3-object-location-parsing

Utilities for parsing S3 object keys and location/source strings.

## Example usage

### S3ObjectLocation.parse

Parses the source/location string. Will throw an error if it cannot be parsed.

```ts
import { S3ObjectLocation } from '@akolos/s3-object-location-parsing'

const sourceString = 'my-s3-bucket/folder-one/folder-two/folder-three/object-name.extension'

const parsed = S3ObjectLocation.parse(sourceString)
console.log(parsed)
/*
{
  bucket: 'my-s3-bucket',
  key: 'folder-one/folder-two/folder-three/object-name.extension',
  prefix: 'folder-one/folder-two/folder-three',
  filename: 'object-name.extension',
  extension: '.extension'
}
*/
```

### S3ObjectLocation.tryParse

Returns an object representing the outcome of the attempt to parse the string. Will contain the parsed object if the
string was parsable.

```ts
import { S3ObjectLocation } from '@akolos/s3-object-location-parsing'

const sourceString = 'my-s3-bucket/folder-one/folder-two/folder-three/object-name.extension'

const parseResult = S3ObjectLocation.tryParse(sourceString)
console.log(parseResult)

if (parseResult.success) {
  console.log(parseResult.value)
} else {
  throw Error('oh no')
}
```
