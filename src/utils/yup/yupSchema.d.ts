/* eslint-disable no-else-return */
/* eslint-disable eqeqeq */
/* eslint-disable arrow-body-style */
/* eslint-disable object-shorthand */
/* eslint-disable no-lonely-if */
/* eslint-disable no-restricted-syntax */
/* eslint-disable spaced-comment */
/* eslint-disable prefer-arrow-callback */
import * as yup from 'yup';
import { Jmbg } from '@jmbg-labs/jmbg';


declare module 'yup' {
    interface StringSchema<
      TType extends Maybe<string> = string | undefined,
      TContext extends AnyObject = AnyObject,
      TOut extends TType = TType,
    > extends yup.BaseSchema<TType, TContext, TOut> {
        color(message?: string): StringSchema<TType, TContext>;
        runningNumber(message?: string): StringSchema<TType, TContext>;
        maxWords(length?: any, message?: string): StringSchema<TType, TContext>;
        jmbg(message?: string): StringSchema<TType, TContext>;
    }


    interface ObjectSchema<
      TType extends AnyObject = AnyObject,
      TContext extends AnyObject = AnyObject,
      TOut extends TType = TType
    > extends yup.BaseSchema<TType, TContext, TOut> {
        uniqueFields(fields?: Array<Array<string>>, message?: string): ArraySchema<TType, TContext, TOut>;
        customValidation(callback: (value: any) => { isValid: boolean; error?: string }, message?: string): ArraySchema<TType, TContext, TOut>;
    }


    interface ArraySchema<
      T extends any[] = any[],
      C extends AnyObject = AnyObject,
      O extends string = string,
      I extends string = string
    > extends yup.BaseSchema<T, C, O, I> {
        unique(field?: string, message?: string): ArraySchema<TType, TContext, TOut>;
        uniqueFields(fields?: Array<string>, message?: string): ArraySchema<TType, TContext, TOut>;
        hasEmpty(field?: string, message?: string): ArraySchema<TType, TContext, TOut>;
        hasEmptyFields(fields?: Array<string>, message?: string): ArraySchema<TType, TContext, TOut>;
        customValidation(callback: (values: any) => { isValid: boolean; error?: string }, message?: string): ArraySchema<TType, TContext, TOut>;
    }
}





//yup.string().color('Invalid color')
yup.addMethod(yup.string, 'color', function (message?: string = 'Invalid color') {
    return this.test('color', message, function (value) {
        if (!value) return true;
        const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1}(?:[0-9a-fA-F]{3})?$|^#(?:[0-9a-fA-F]{6}){1}(?:[0-9a-fA-F]{2})?$/;
        return hexColorRegex.test(value);
    });
});

//yup.string().runningNumber('Last char must be a number')
yup.addMethod(yup.string, 'runningNumber', function (message?: string = 'Last char must be a number') {
    return this.test('runningNumber', message, function (value) {
        if (value && value.length > 0) {
            const lastCharacter = value.charAt(value.length - 1);
            return /\d/.test(lastCharacter);
        }
        return true;
    });
});

//yup.string().maxWords(100, 'You have exceeded the maximum word limit of 100 words')
yup.addMethod(yup.string, 'maxWords', function (length: number = 0, message?: string = `You have exceeded the maximum word limit of ${length} words`) {
    return this.test('maxWords', message, function (value) {
        if (!value) return true;
        if (length <= 0) return true;

        const count: any = wordcount(value);
        return (count <= length);
    });
});

//yup.string().jmbg('Invalid JMBG')
yup.addMethod(yup.string, 'jmbg', function (message?: string = `Invalid JMBG`) {
    return this.test('jmbg', message, function (value) {
        if (!value) return true;

        const cleanedJMBG = value.replace(/\s/g, '');

        try {
            return Jmbg.valid(cleanedJMBG);
        } catch (e) {
            return false;
        }
    });
});





//yup.object().uniqueFields([['field11', 'field12', 'arr.field13'], ['field21', 'field22', 'arr.field23']], 'There are duplicates')
yup.addMethod(yup.object, 'uniqueFields', function (fields?: Array<Array<string>>, message?: any = 'There are duplicates') {
    return this.test('uniqueFields', message, function (value: any) {
        if (!fields || fields.length === 0) {
            return true;
        }

        for (const fieldGroup of fields) {
            const values: any = [];

            for (const field of fieldGroup) {
                const fieldParts = field.split('.');
                if (Array.isArray(value[fieldParts[0]])) {
                    value[fieldParts[0]].forEach((item: any) => {
                        const nestedValue = item[fieldParts[fieldParts.length - 1]];
                        if (nestedValue !== null && nestedValue !== undefined && nestedValue !== '') {
                            values.push(nestedValue);
                        }
                    });
                } else {
                    if (value[fieldParts[0]] !== null && value[fieldParts[0]] !== undefined && value[fieldParts[0]] !== '') {
                        values.push(value[fieldParts[0]]);
                    }
                }
            }

            if (values.length !== new Set(values).size) {
                return this.createError({
                    path: 'form',
                    message: message,
                });
            }
        }

        return true;
    });
});

//yup.object().customValidation((value: any) => { isValid: boolean; error?: string }, 'Invalid')
yup.addMethod(yup.object, 'customValidation', function (callback: (value: any) => { isValid: boolean; error?: string }, message?: any = 'Invalid') {
    return this.test('customValidation', message, function (value: any) {
        const { path, createError } = this;

        const result = callback(value);

        if (!result.isValid) {
          return createError({ path, message: result.error || message });
        }

        return true;
    });
});





//yup.array().of(yup.object()).unique('field', 'There are duplicates')
yup.addMethod(yup.array, 'unique', function (field?: string, message?: any = 'There are duplicates') {
    return this.test('unique', message, function (values: any) {
        const mappedValues = values.map((value: any) => !(value[field] === null || value[field] === undefined || value[field] === '') && value[field]);
        return mappedValues.length === new Set(mappedValues).size;
    });
});

//yup.array().of(yup.object()).uniqueFields(['field1', 'field2'], 'There are duplicates')
yup.addMethod(yup.array, 'uniqueFields', function (fields?: Array<string>, message?: any = 'There are duplicates') {
    return this.test('uniqueFields', message, function (values: any) {
        const uniqueValues = values.map((value: any) => {
            return fields.map(field => !(value[field] === null || value[field] === undefined || value[field] === '') && value[field]);
        });
        const flattenedValues = [].concat(...uniqueValues);
        return flattenedValues.length === new Set(flattenedValues).size;
    });
});


//yup.array().of(yup.object()).hasEmpty('field', 'There are empty fields')
yup.addMethod(yup.array, 'hasEmpty', function (field?: string, message?: any = 'There are empty fields') {
    return this.test('hasEmpty', message, function (values: any) {
        const hasEmpty = values.some((x: any) => x[field] === null || x[field] === undefined || x[field] === '');
        return (values.length == 1) ? true : !hasEmpty;
    });
});

//yup.array().of(yup.object()).hasEmptyFields(['field1', 'field2'], 'There are empty fields')
yup.addMethod(yup.array, 'hasEmptyFields', function (fields?: Array<string>, message?: any = 'There are empty fields') {
    return this.test('hasEmptyFields', message, function (values: any) {
        if(values.length == 1){
            const hasEmpty = fields.every(field => values[0][field] === null || values[0][field] === undefined || values[0][field] === '');
            const hasNonEmpty = fields.every(field => values[0][field] !== null && values[0][field] !== undefined && values[0][field] !== '');
            return (hasEmpty || hasNonEmpty);

        } else {
            const hasEmpty = values.some((x: any) => {
                return fields.some(field => x[field] === null || x[field] === undefined || x[field] === '');
            });
            return !hasEmpty;
        }
    });
});

//yup.array().of(yup.object()).customValidation((values: any) => { isValid: boolean; error?: string }, 'Invalid')
yup.addMethod(yup.array, 'customValidation', function (callback: (values: any) => { isValid: boolean; error?: string }, message?: any = 'Invalid') {
    return this.test('customValidation', message, function (values: any) {
        const { path, createError } = this;

        const result = callback(values);

        if (!result.isValid) {
          return createError({ path, message: result.error || message });
        }

        return true;
    });
});
