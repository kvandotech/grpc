let enumObj = {},
    rpcMethods = [];
const responseProto = 'ResponseProto',
    requestProto = 'RequestProto',
    protobufEmpty = 'google.protobuf.Empty';

//Leads to a single case, and also removes the reference character
const lowerField = (str) => {

    const idx = str.indexOf(' ');
    if (idx < 0) {
        return str;
    }
    return str.slice(0, idx).toLowerCase() + str.slice(idx).replace('*', '');
};

//Removes an elite by index from the array
const croppingElementOfArray = (arrStruct, idx) => {
    return [
        ...arrStruct.slice(0, idx),
        ...arrStruct.slice(idx + 1)
    ];
};

//Parsing a row and returning a finished object
const parseFieldsMessage = (stringFields) => {
    const newStringFields = stringFields.replace('{}', '')
        .replace(/\s+$/gm, '')
        .replace(/\b\s{1,}[ ]/g, ' ')
        .trim()
        .replace(/\s{2,}/g, '|');
    const arr = newStringFields.split('|');
    let objField = {};
    arr.forEach(function (item) {
        let temp = lowerField(item).split(' ');
        if (temp[0] === '') {
            return objField = null;
        }
        if (temp[1] === undefined) {
            temp[1] = '';
        }
        objField[temp[0]] = temp[1];
    });

    return objField;
};

//Translates data types from Go to protobuf types
const normalizeType = (...args) => {
    switch (args[0]) {
        case "int":
            return "int64";
        case "float32":
            return "float";
        case "float64":
            return "double";
        case "map":
            return `${args[0]}<${args[1]}, ${args[2]}>`;
        case "struct":
            return `${args[0]}{}`;
        case "[]byte":
            return "bytes";
        case "[]":
            return `repeated ${args[1]}`;
        default:
            return args[0];
    }
};

//Inserts the required ellement into the desired position.
const addNewItemToSelectedPositionToString = (typeName, position, items) => {
    let arr;
    arr = typeName.split('');
    arr.splice(position, 0, items);
    return arr.join('');
};

//The massif parses type
const parseRepeated = (typeName) => {
    let prefType, arr;

    arr = addNewItemToSelectedPositionToString(typeName, 2, '|').split('|');
    typeName = arr[0];
    prefType = normalizeType(arr[1]);

    return normalizeType(typeName, prefType);
};

//Parses map type
const parseMap = (typeName) => {

    let arr = typeName.split(/\b\W/g);
    arr = arr.map((item, idx) => {
        if (idx !== 0) {
            return normalizeType(item);
        }
        return item;
    });
    return normalizeType(...arr);
};

//Parsits the nested map type and issues an error.
const parseMaps = (typeName) => {
    let idxMap, idxNextMap;
    idxMap = typeName.indexOf('map');
    idxNextMap = typeName.indexOf('map', idxMap + 1);
    if (idxNextMap === -1) {
        return parseMap(typeName);
    }
    return 'Error: Type not defined. No support for embedded map';
};

//Parses the received type
const parserType = (typeName) => {
    let isRepeated, isBytes, isMap;
    isRepeated = typeName.indexOf(']');
    isBytes = typeName.includes('[]byte');
    isMap = typeName.startsWith('map');

    if (isRepeated !== -1 && !isBytes && !isMap) {
        return parseRepeated(typeName);
    } else if (isMap) {
        return parseMaps(typeName);
    }
    return normalizeType(typeName);
};

//Breaks the object into types from the structure body and sends it to parsing
const parserTypeInObj = (item) => {
    for (let value of Object.values(item)) {
        if (value !== null) {
            for (let [key, valueNext] of Object.entries(value)) {
                value[key] = parserType(valueNext);
            }
        }
    }
};

//Checks if there is an enum enumeration in the structure
const isEnumName = (name) => {
    const parseName = {
        nameMessage: '',
        enumName: ''
    };

    if (name.includes('_')) {
        [parseName.nameMessage, parseName.enumName] = name.split('_');
        return parseName;
    }

    return {nameMessage: name};
};

//Parses structure Enum to Go
const parseStructEnum = (item, enumName, nameMessage) => {
    let
        tempFieldView,
        arr,
        fieldViewStartIdx = item.indexOf('{'),
        fieldViewEndIdx = item.indexOf('}');

    const enumArr = {};

    if (fieldViewStartIdx >= 0 && fieldViewStartIdx >= 0) {
        tempFieldView = item.slice(fieldViewStartIdx + 1, fieldViewEndIdx);
        arr = tempFieldView
            .replace(/[^A-Z_,]/g, '')
            .replace(/,$/g, '')
            .split(',');
    } else {
        fieldViewStartIdx = item.indexOf('(');
        fieldViewEndIdx = item.indexOf(')');
        tempFieldView = item.slice(fieldViewStartIdx + 1, fieldViewEndIdx);
        const
            patternNameMessage = new RegExp(`${nameMessage}_`, 'g'),
            patternNameEnum = new RegExp(`${enumName}`, 'g');
        arr = tempFieldView.replace(/\s=\s\d| =\d|=\s\d|=\d/g, '')
            .replace(patternNameMessage, '')
            .replace(patternNameEnum, '')
            .replace(/\b\s/g, '|')
            .replace(/\s/g, '')
            .split('|');
        arr = croppingElementOfArray(arr, arr.length - 1);

    }
    enumArr[enumName] = arr;
    enumObj[nameMessage] = enumArr;
};

//Parsing structure body
const parseStructFields = (item) => {
    const fieldViewStartIdx = item.indexOf('{');
    const fieldViewEndIdx = item.lastIndexOf('}');
    if (fieldViewStartIdx + 1 !== fieldViewEndIdx
        && fieldViewStartIdx !== fieldViewEndIdx
        && fieldViewStartIdx > 0) {
        const tempFieldView = item.slice(fieldViewStartIdx + 1, fieldViewEndIdx);
        return parseFieldsMessage(tempFieldView);
    } else {
        return null;
    }
};

//Converts an array of structures to an object and also checks for enum structures and rpc methods
const convertArrStructGoToObj = (arrStruct) => {

    let fieldView;

    return arrStruct.map((item, idx) => {
            item = item.trim();
            const delimiter = item.indexOf(' ');
            let name;
            if (delimiter > 0) {
                name = item.slice(0, delimiter);
            } else {
                name = item;
            }
            if (name.includes('RequestProto') ||
                name.includes('ResponseProto')) {
                rpcMethods.push(name);
            }
            const {nameMessage, enumName = ''} = isEnumName(name);
            if (enumName) {
                parseStructEnum(item, enumName, nameMessage);
                return null
            } else {
                fieldView = parseStructFields(item);
            }

            return {
                [nameMessage]: fieldView
            };
        }
    );
};

//Collects in Enum string
const printEnum = (enumEl) => {

    let stringEnum = '';
    for (let [key, value] of Object.entries(enumEl[1])) {
        stringEnum += `\tenum ${key} {\n`;
        const newValue = value.map((item, idx) => `\t\t${item} = ${idx};\n`);
        for (let item of newValue) {
            stringEnum += item;
        }
        stringEnum += '\t}\n\n';
    }
    return stringEnum;
};

//Returns the primary name of the method without proto parameters
const getNameMethod = (fullName) => {
    let idx;
    if (fullName.includes(requestProto)) {
        idx = fullName.indexOf(requestProto);
        return fullName.slice(0, idx);
    } else {
        idx = fullName.indexOf(responseProto);
        return fullName.slice(0, idx);
    }

};

//Defines response and request names
const determineTheEndName = (lastNameProto, preLastNameProto) => {
    const rpcObj = {
        requestName: '',
        responseName: ''
    };
    rpcObj.requestName = lastNameProto.includes(requestProto) ? lastNameProto : preLastNameProto;
    rpcObj.responseName = lastNameProto.includes(responseProto) ? lastNameProto : preLastNameProto;

    return rpcObj;
};

//If the base names are the same
const equalRpcMethodsNames = (name, lastNameProto, preLastNameProto, arrRpcMethods) => {
    const {requestName, responseName} = determineTheEndName(lastNameProto, preLastNameProto);
    arrRpcMethods.pop();
    arrRpcMethods.pop();
    return `\trpc ${name}(${requestName})\n\t\treturns(${responseName});\n`;
};

//If one of the proto parameters is missing
const unequalRpcMethodsNames = (name, lastNameProto, arrRpcMethods) => {
    const {requestName, responseName} = determineTheEndName(lastNameProto, undefined);
    arrRpcMethods.pop();
    return `\trpc ${name}(${requestName === undefined ? protobufEmpty : requestName})\n\t\treturns(${responseName === undefined ? protobufEmpty : responseName});\n`;
};

//Creates an rpc service of methods
const createRpcMethods = (arrRpcMethods) => {

    let lastName, preLastName, lastNameProto,
        preLastNameProto, structRpcMethods;

    structRpcMethods = 'service DefaultMethods {\n';
    arrRpcMethods.sort().reverse();
    while (arrRpcMethods.length > 0) {

        lastNameProto = arrRpcMethods[arrRpcMethods.length - 1];
        preLastNameProto = arrRpcMethods[arrRpcMethods.length - 2];

        lastName = getNameMethod(lastNameProto);
        preLastName = preLastNameProto !== undefined ? getNameMethod(preLastNameProto) : undefined;

        if (lastName === preLastName) {
            structRpcMethods += equalRpcMethodsNames(lastName, lastNameProto, preLastNameProto, arrRpcMethods)

        } else {
            structRpcMethods += unequalRpcMethodsNames(lastName, lastNameProto, arrRpcMethods);

        }
    }
    structRpcMethods += '}';
    return structRpcMethods;
};

//Collects all messages in a single string
const printStruct = (item, enumObj) => {
    let
        structString,
        count = 1,
        idxEnum;
    const
        message = 'message',
        arrEntriesEnum = Object.entries(enumObj);

    for (let [key, value] of Object.entries(item)) {
        structString = `${message} ${key} {\n`;
        idxEnum = arrEntriesEnum.findIndex(([itemKey]) => itemKey === key);

        if (idxEnum !== -1) {
            structString += printEnum(arrEntriesEnum[idxEnum]);
        }

        if (value !== null) {
            for (let [keyNext, valueNext] of Object.entries(value)) {
                valueNext = valueNext.replace(`${key}_`, '');
                structString += `\t${valueNext} ${keyNext} = ${count};\n`;
                count++;
                if (count >= 19000 && count <= 19999) {
                    count = 20000;
                }
            }
        }

        structString += `}\n\n`;
    }
    return structString;
};

//Main method
export const parserGoStruct = (stringGoStruct, isRpc = false) => {
    enumObj = {};
    rpcMethods = [];
    let arrStruct = stringGoStruct.split('type'),
        objStruct,
        arrIdx = [],
        structRpcMethods,
        structString;
    arrStruct = croppingElementOfArray(arrStruct, 0);
    objStruct = convertArrStructGoToObj(arrStruct);
    objStruct.map((item, idx) => {
        if (item === null) {
            arrIdx.push(idx);
            return item;
        }
        return parserTypeInObj(item)

    });
    for (let i = arrIdx.length - 1; i >= 0; i--) {
        objStruct = croppingElementOfArray(objStruct, arrIdx[i]);
    }

    if (rpcMethods.length > 0) {
        structRpcMethods = createRpcMethods(rpcMethods);
    }

    structString = objStruct.reduce((str, item) => str += printStruct(item, enumObj), `syntax = "proto3";\npackage proto;\n\n\n`);
    if (isRpc && structRpcMethods !== undefined) {
        if (structRpcMethods.includes(protobufEmpty)) {
            const idx = structString.indexOf('package proto;');
            structString = addNewItemToSelectedPositionToString(structString, idx, 'import "google/protobuf/empty.proto";\n\n');
        }
        structString += structRpcMethods;
    }
    return structString;
};