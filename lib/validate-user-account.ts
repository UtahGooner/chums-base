import Debug from 'debug';
import {apiFetch} from './api-fetch.js';
import {getDBCompany} from './utils.js';

const debug = Debug('chums:local-modules:validate-user-account');

const VALIDATE_URL = '/api/user/:id/validate/account/:Company/:ARDivisionNo-:CustomerNo';

/**
 *
 * @param {string|number} id - User ID
 * @param {string} Company
 * @param {string} ARDivisionNo
 * @param {string} CustomerNo
 * @returns {Promise<boolean>}
 */

export interface ValidateUserAccountProps {
    id: string | number,
    Company: string,
    ARDivisionNo: string,
    CustomerNo: string,
}

export interface ValidationResult {
    success?: boolean;
}

export async function validateUserAccount({id, Company, ARDivisionNo, CustomerNo}: ValidateUserAccountProps):Promise<boolean> {
    try {
        const url = VALIDATE_URL
            .replace(':id', encodeURIComponent(id))
            .replace(':Company', encodeURIComponent(getDBCompany(Company)))
            .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(CustomerNo));
        const res = await apiFetch(url, {referrer: 'chums:local-modules:validate-user'});
        if (!res.ok) {
            debug('validateAccount()', res.status, res.statusText);
            return Promise.reject(new Error(`Error ${res.status}: ${res.statusText}`));
        }
        const {success} = await res.json() as ValidationResult;
        return success === true;
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("validateAccount()", err.message);
            return Promise.reject(err);
        }
        debug("validateAccount()", err);
        return Promise.reject(err);
    }
}
