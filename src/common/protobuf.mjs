// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import protobuf from 'protobufjs';

// This file is taken from https://github.com/gchq/CyberChef, licensed under the Apache license (see the bottom of the
// file).
// It was combined from the following two original source files:
// * https://github.com/gchq/CyberChef/blob/477e4a7421756c461293a8f0714fb75ee3ac1736/src/core/lib/Protobuf.mjs
// * https://github.com/gchq/CyberChef/blob/477e4a7421756c461293a8f0714fb75ee3ac1736/src/core/Utils.mjs
//
// No changes other than including `byteArrayToChars` as a plain function and changing `_lenDelim` to use that directly
// were made.

/**
 * Converts a charcode array to a string.
 *
 * @license Apache-2.0.
 *
 * @author n1474335 [n1474335@gmail.com]
 *
 * @example // returns "Hello" byteArrayToChars([72,101,108,108,111]);
 *
 * // returns "你好" byteArrayToChars([20320,22909]);
 *
 * @param {byteArray | Uint8Array} byteArray
 *
 * @returns {string}
 *
 * @copyright Crown Copyright 2016
 */
function byteArrayToChars(byteArray) {
    if (!byteArray) return '';
    let str = '';
    // String concatenation appears to be faster than an array join
    for (let i = 0; i < byteArray.length; ) {
        str += String.fromCharCode(byteArray[i++]);
    }
    return str;
}

/**
 * Protobuf lib. Contains functions to decode protobuf serialised data without a schema or .proto file.
 *
 * Provides utility functions to encode and decode variable length integers (varint).
 *
 * @license Apache-2.0.
 *
 * @author GCHQ Contributor [3]
 *
 * @copyright Crown Copyright 2019
 */
export class Protobuf {
    /**
     * Protobuf constructor.
     *
     * @param {byteArray | Uint8Array} data
     */
    constructor(data) {
        // Check we have a byteArray or Uint8Array
        if (data instanceof Array || data instanceof Uint8Array) {
            this.data = data;
        } else {
            throw new Error('Protobuf input must be a byteArray or Uint8Array');
        }

        // Set up masks
        this.TYPE = 0x07;
        this.NUMBER = 0x78;
        this.MSB = 0x80;
        this.VALUE = 0x7f;

        // Declare offset, length, and field type object
        this.offset = 0;
        this.LENGTH = data.length;
        this.fieldTypes = {};
    }

    // Public Functions

    /**
     * Encode a varint from a number.
     *
     * @param {number} number
     *
     * @returns {byteArray}
     */
    static varIntEncode(number) {
        const MSB = 0x80,
            VALUE = 0x7f,
            MSBALL = ~VALUE,
            INT = Math.pow(2, 31);
        const out = [];
        let offset = 0;

        while (number >= INT) {
            out[offset++] = (number & 0xff) | MSB;
            number /= 128;
        }
        while (number & MSBALL) {
            out[offset++] = (number & 0xff) | MSB;
            number >>>= 7;
        }
        out[offset] = number | 0;
        return out;
    }

    /**
     * Decode a varint from the byteArray.
     *
     * @param {byteArray} input
     *
     * @returns {number}
     */
    static varIntDecode(input) {
        const pb = new Protobuf(input);
        return pb._varInt();
    }

    /**
     * Encode input JSON according to the given schema.
     *
     * @param {Object} input
     * @param {Object[]} args
     *
     * @returns {Object}
     */
    static encode(input, args) {
        this.updateProtoRoot(args[0]);
        if (!this.mainMessageName) {
            throw new Error('Schema Error: Schema not defined');
        }
        const message = this.parsedProto.root.nested[this.mainMessageName];

        // Convert input into instance of message, and verify instance
        input = message.fromObject(input);
        const error = message.verify(input);
        if (error) {
            throw new Error('Input Error: ' + error);
        }
        // Encode input
        const output = message.encode(input).finish();
        return new Uint8Array(output).buffer;
    }

    /**
     * Parse Protobuf data.
     *
     * @param {byteArray} input
     *
     * @returns {Object}
     */
    static decode(input, args) {
        this.updateProtoRoot(args[0]);
        this.showUnknownFields = args[1];
        this.showTypes = args[2];
        return this.mergeDecodes(input);
    }

    /**
     * Update the parsedProto, throw parsing errors.
     *
     * @param {string} protoText
     */
    static updateProtoRoot(protoText) {
        try {
            this.parsedProto = protobuf.parse(protoText);
            if (this.parsedProto.package) {
                this.parsedProto.root = this.parsedProto.root.nested[this.parsedProto.package];
            }
            this.updateMainMessageName();
        } catch (error) {
            throw new Error('Schema ' + error);
        }
    }

    /** Set mainMessageName to the first instance of a message defined in the schema that is not a submessage. */
    static updateMainMessageName() {
        const messageNames = [];
        const fieldTypes = [];
        this.parsedProto.root.nestedArray.forEach((block) => {
            if (block instanceof protobuf.Type) {
                messageNames.push(block.name);
                this.parsedProto.root.nested[block.name].fieldsArray.forEach((field) => {
                    fieldTypes.push(field.type);
                });
            }
        });

        if (messageNames.length === 0) {
            this.mainMessageName = null;
        } else {
            // for (const name of messageNames) {
            //     if (!fieldTypes.includes(name)) {
            //         this.mainMessageName = name;
            //         break;
            //     }
            // }
            this.mainMessageName = messageNames[0];
        }
    }

    /**
     * Decode input using Protobufjs package and raw methods, compare, and merge results.
     *
     * @param {byteArray} input
     *
     * @returns {Object}
     */
    static mergeDecodes(input) {
        const pb = new Protobuf(input);
        let rawDecode = pb._parse();
        let message;

        if (this.showTypes) {
            rawDecode = this.showRawTypes(rawDecode, pb.fieldTypes);
            this.parsedProto.root = this.appendTypesToFieldNames(this.parsedProto.root);
        }

        try {
            message = this.parsedProto.root.nested[this.mainMessageName];
            const packageDecode = message.toObject(message.decode(input), {
                bytes: String,
                longs: Number,
                enums: String,
                defualts: true,
            });
            const output = {};

            if (this.showUnknownFields) {
                output[message.name] = packageDecode;
                output['Unknown Fields'] = this.compareFields(rawDecode, message);
                return output;
            }
            return packageDecode;
        } catch (error) {
            if (message) {
                throw new Error('Input ' + error);
            } else {
                return rawDecode;
            }
        }
    }

    /**
     * Replace fieldnames with fieldname and type.
     *
     * @param {Object} schemaRoot
     *
     * @returns {Object}
     */
    static appendTypesToFieldNames(schemaRoot) {
        for (const block of schemaRoot.nestedArray) {
            if (block instanceof protobuf.Type) {
                for (const [fieldName, fieldData] of Object.entries(block.fields)) {
                    schemaRoot.nested[block.name].remove(block.fields[fieldName]);
                    schemaRoot.nested[block.name].add(
                        new protobuf.Field(
                            `${fieldName} (${fieldData.type})`,
                            fieldData.id,
                            fieldData.type,
                            fieldData.rule
                        )
                    );
                }
            }
        }
        return schemaRoot;
    }

    /**
     * Add field type to field name for fields in the raw decoded output.
     *
     * @param {Object} rawDecode
     * @param {Object} fieldTypes
     *
     * @returns {Object}
     */
    static showRawTypes(rawDecode, fieldTypes) {
        for (const [fieldNum, value] of Object.entries(rawDecode)) {
            const fieldType = fieldTypes[fieldNum];
            let outputFieldValue;
            let outputFieldType;

            // Submessages
            if (isNaN(fieldType)) {
                outputFieldType = 2;

                // Repeated submessages
                if (Array.isArray(value)) {
                    const fieldInstances = [];
                    for (const instance of Object.keys(value)) {
                        if (typeof value[instance] !== 'string') {
                            fieldInstances.push(this.showRawTypes(value[instance], fieldType));
                        } else {
                            fieldInstances.push(value[instance]);
                        }
                    }
                    outputFieldValue = fieldInstances;

                    // Single submessage
                } else {
                    outputFieldValue = this.showRawTypes(value, fieldType);
                }

                // Non-submessage field
            } else {
                outputFieldType = fieldType;
                outputFieldValue = value;
            }

            // Substitute fieldNum with field number and type
            rawDecode[`field #${fieldNum}: ${this.getTypeInfo(outputFieldType)}`] = outputFieldValue;
            delete rawDecode[fieldNum];
        }
        return rawDecode;
    }

    /**
     * Compare raw decode to package decode and return discrepancies.
     *
     * @param rawDecodedMessage
     * @param schemaMessage
     *
     * @returns {Object}
     */
    static compareFields(rawDecodedMessage, schemaMessage) {
        // Define message data using raw decode output and schema
        const schemaFieldProperties = {};
        const schemaFieldNames = Object.keys(schemaMessage.fields);
        schemaFieldNames.forEach((field) => (schemaFieldProperties[schemaMessage.fields[field].id] = field));

        // Loop over each field present in the raw decode output
        // eslint-disable-next-line guard-for-in
        for (const fieldName in rawDecodedMessage) {
            let fieldId;
            if (isNaN(fieldName)) {
                fieldId = fieldName.match(/^field #(\d+)/)[1];
            } else {
                fieldId = fieldName;
            }

            // Check if this field is defined in the schema
            if (fieldId in schemaFieldProperties) {
                const schemaFieldName = schemaFieldProperties[fieldId];

                // Extract the current field data from the raw decode and schema
                const rawFieldData = rawDecodedMessage[fieldName];
                const schemaField = schemaMessage.fields[schemaFieldName];

                // Check for repeated fields
                if (Array.isArray(rawFieldData) && !schemaField.repeated) {
                    rawDecodedMessage[`(${schemaMessage.name}) ${schemaFieldName} is a repeated field`] = rawFieldData;
                }

                // Check for submessage fields
                if (schemaField.resolvedType instanceof protobuf.Type) {
                    const subMessageType = schemaMessage.fields[schemaFieldName].type;
                    const schemaSubMessage = this.parsedProto.root.nested[subMessageType];
                    const rawSubMessages = rawDecodedMessage[fieldName];
                    let rawDecodedSubMessage = {};

                    // Squash multiple submessage instances into one submessage
                    if (Array.isArray(rawSubMessages)) {
                        rawSubMessages.forEach((subMessageInstance) => {
                            const instanceFields = Object.entries(subMessageInstance);
                            instanceFields.forEach((subField) => {
                                rawDecodedSubMessage[subField[0]] = subField[1];
                            });
                        });
                    } else {
                        rawDecodedSubMessage = rawSubMessages;
                    }

                    // Treat submessage as own message and compare its fields
                    rawDecodedSubMessage = Protobuf.compareFields(rawDecodedSubMessage, schemaSubMessage);
                    if (Object.entries(rawDecodedSubMessage).length !== 0) {
                        rawDecodedMessage[`${schemaFieldName} (${subMessageType}) has missing fields`] =
                            rawDecodedSubMessage;
                    }
                }
                delete rawDecodedMessage[fieldName];
            }
        }
        return rawDecodedMessage;
    }

    /**
     * Returns wiretype information for input wiretype number.
     *
     * @param {number} wireType
     *
     * @returns {string}
     */
    static getTypeInfo(wireType) {
        switch (wireType) {
            case 0:
                return 'VarInt (e.g. int32, bool)';
            case 1:
                return '64-Bit (e.g. fixed64, double)';
            case 2:
                return 'L-delim (e.g. string, message)';
            case 5:
                return '32-Bit (e.g. fixed32, float)';
        }
    }

    // Private Class Functions

    /**
     * Main private parsing function.
     *
     * @private
     *
     * @returns {Object}
     */
    _parse() {
        let object = {};
        // Continue reading whilst we still have data
        while (this.offset < this.LENGTH) {
            const field = this._parseField();
            object = this._addField(field, object);
        }
        // Throw an error if we have gone beyond the end of the data
        if (this.offset > this.LENGTH) {
            throw new Error('Exhausted Buffer');
        }
        return object;
    }

    /**
     * Add a field read from the protobuf data into the Object. As protobuf fields can appear multiple times, if the
     * field already exists we need to add the new field into an array of fields for that key.
     *
     * @private
     *
     * @param {Object} field
     * @param {Object} object
     *
     * @returns {Object}
     */
    _addField(field, object) {
        // Get the field key/values
        const key = field.key;
        const value = field.value;
        object[key] = Object.prototype.hasOwnProperty.call(object, key)
            ? object[key] instanceof Array
                ? object[key].concat([value])
                : [object[key], value]
            : value;
        return object;
    }

    /**
     * Parse a field and return the Object read from the record.
     *
     * @private
     *
     * @returns {Object}
     */
    _parseField() {
        // Get the field headers
        const header = this._fieldHeader();
        const type = header.type;
        const key = header.key;

        if (typeof this.fieldTypes[key] !== 'object') {
            this.fieldTypes[key] = type;
        }

        switch (type) {
            // varint
            case 0:
                return { key: key, value: this._varInt() };
            // fixed 64
            case 1:
                return { key: key, value: this._uint64() };
            // length delimited
            case 2:
                return { key: key, value: this._lenDelim(key) };
            // fixed 32
            case 5:
                return { key: key, value: this._uint32() };
            // unknown type
            default:
                throw new Error('Unknown type 0x' + type.toString(16));
        }
    }

    /**
     * Parse the field header and return the type and key.
     *
     * @private
     *
     * @returns {Object}
     */
    _fieldHeader() {
        // Make sure we call type then number to preserve offset
        return { type: this._fieldType(), key: this._fieldNumber() };
    }

    /**
     * Parse the field type from the field header. Type is stored in the lower 3 bits of the tag byte. This does not
     * move the offset on as we need to read the field number from the tag byte too.
     *
     * @private
     *
     * @returns {number}
     */
    _fieldType() {
        // Field type stored in lower 3 bits of tag byte
        return this.data[this.offset] & this.TYPE;
    }

    /**
     * Parse the field number (i.e. the key) from the field header. The field number is stored in the upper 5 bits of
     * the tag byte - but is also varint encoded so the follow on bytes may need to be read when field numbers are >
     * 15.
     *
     * @private
     *
     * @returns {number}
     */
    _fieldNumber() {
        let shift = -3;
        let fieldNumber = 0;
        do {
            fieldNumber +=
                shift < 28
                    ? shift === -3
                        ? (this.data[this.offset] & this.NUMBER) >> -shift
                        : (this.data[this.offset] & this.VALUE) << shift
                    : (this.data[this.offset] & this.VALUE) * Math.pow(2, shift);
            shift += 7;
        } while ((this.data[this.offset++] & this.MSB) === this.MSB);
        return fieldNumber;
    }

    // Field Parsing Functions

    /**
     * Read off a varint from the data.
     *
     * @private
     *
     * @returns {number}
     */
    _varInt() {
        let value = 0;
        let shift = 0;
        // Keep reading while upper bit set
        do {
            value +=
                shift < 28
                    ? (this.data[this.offset] & this.VALUE) << shift
                    : (this.data[this.offset] & this.VALUE) * Math.pow(2, shift);
            shift += 7;
        } while ((this.data[this.offset++] & this.MSB) === this.MSB);
        return value;
    }

    /**
     * Read off a 64 bit unsigned integer from the data.
     *
     * @private
     *
     * @returns {number}
     */
    _uint64() {
        // Read off a Uint64 with little-endian
        const lowerHalf =
            this.data[this.offset++] +
            this.data[this.offset++] * 0x100 +
            this.data[this.offset++] * 0x10000 +
            this.data[this.offset++] * 0x1000000;
        const upperHalf =
            this.data[this.offset++] +
            this.data[this.offset++] * 0x100 +
            this.data[this.offset++] * 0x10000 +
            this.data[this.offset++] * 0x1000000;
        return upperHalf * 0x100000000 + lowerHalf;
    }

    /**
     * Read off a length delimited field from the data.
     *
     * @private
     *
     * @returns {Object | string}
     */
    _lenDelim(fieldNum) {
        // Read off the field length
        const length = this._varInt();
        const fieldBytes = this.data.slice(this.offset, this.offset + length);
        let field;
        try {
            // Attempt to parse as a new Protobuf Object
            const pbObject = new Protobuf(fieldBytes);
            field = pbObject._parse();

            // Set field types object
            this.fieldTypes[fieldNum] = { ...this.fieldTypes[fieldNum], ...pbObject.fieldTypes };
        } catch (err) {
            // Otherwise treat as bytes
            field = byteArrayToChars(fieldBytes);
        }
        // Move the offset and return the field
        this.offset += length;
        return field;
    }

    /**
     * Read a 32 bit unsigned integer from the data.
     *
     * @private
     *
     * @returns {number}
     */
    _uint32() {
        // Use a dataview to read off the integer
        const dataview = new DataView(new Uint8Array(this.data.slice(this.offset, this.offset + 4)).buffer);
        const value = dataview.getUint32(0, true);
        this.offset += 4;
        return value;
    }
}

/*

                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
