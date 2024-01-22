import { expect, test } from '@playwright/test';
import Ajv from 'ajv';
import  userRequest  from '../test_data/reqres/user_request.json';
import  updateUserRequest  from '../test_data/reqres/update_user_request.json';
import { validateSchemaForCreateUser } from '../test_data/utils/validate_create_user_scheme';
import { validateUserUpdateScheme } from '../test_data/utils/validate_user_update_scheme';

test.describe('Suite de pruebas para los servicios disponibles en ReqRes API', () => {
    const resource_url = '/api/users'

    const headerReqRes = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    const validator = new Ajv();

    test('Test para el servicio de GET - Obtener listado de usuarios', async ( { request } ) => {
        const response = await request.get(resource_url, {
                headers: headerReqRes,  
            }
        );
        
        const body = await response.json();

        console.log('Log - Test de Listar Usuarios')
        console.log('Status Code', response.status());
        console.log('Body', JSON.stringify(body));

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
    });

    test('Test para el servicio POST - Crear un usuario', async ({ request }) => {
        
        const response = await request.post(resource_url, {
            headers: headerReqRes,
            data: userRequest
        });

        const body = await response.json();
        console.log('Log - Test de Crear Usuario')
        console.log('Status Code', response.status());
        console.log('Body', JSON.stringify(response.json()));

        const schemeExpect = validateSchemaForCreateUser();
        const responseScheme = JSON.parse(await response.text());
        const schemeValidated = validator.validate(schemeExpect, responseScheme);

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(201);
        expect(schemeValidated).toEqual(true);
        expect(body).toHaveProperty('createdAt');
        expect(body).toHaveProperty('name', userRequest.name);
        expect(body).toHaveProperty('job', userRequest.job);
    });

    test('Test para el servicio PUT - Actualizar Usuario', async ({ request })  => {
        const USER_ID = '/2';
        const response = await request.put(resource_url + USER_ID, {
            headers: headerReqRes,
            data: updateUserRequest
        });

        const body = await response.json();

        console.log('Log - Test de Actualizar Usuario')
        console.log('Status Code', response.status());

        const schemeExpect = validateUserUpdateScheme();
        const responseScheme = JSON.parse(await response.text());
        const schemeValidated = validator.validate(schemeExpect, responseScheme);
        
        expect(response.status()).toBe(200);
        expect(body).toHaveProperty('updatedAt');
        expect(body).toHaveProperty('name', updateUserRequest.name);
        expect(body).toHaveProperty('job', updateUserRequest.job);
        expect(schemeValidated).toEqual(true);
    });

    test('Test para el servicio DELETE - Eliminar Usuario', async ({ request }) => {
        const USER_ID = '/1'
        const response = await request.delete(resource_url + USER_ID, {
            headers: headerReqRes
        });

        console.log('Log - Test de Crear Usuario')
        console.log('Status Code', response.status());
        
        expect(response.status()).toBe(204);
        expect(response.statusText()).toBe('No Content');
    });
});