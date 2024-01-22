import { expect, test } from '@playwright/test';
import Ajv from 'ajv';
import  userRequest  from '../test_data/reqres/user_request.json';
import  updateUserRequest  from '../test_data/reqres/update_user_request.json';
import { validateSchemaForCreateUser } from '../test_data/utils/validate_create_user_schema';

test.describe('Suite de pruebas para los servicios disponibles en ReqRes API', () => {
    const resource_url = '/api/users'

    const headerReqRes = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

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

        console.log('Log - Test de Crear Usuario')
        console.log('Status Code', response.status());
        console.log('Body', JSON.stringify(response.json()));

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(201);

        const schemaExpect = validateSchemaForCreateUser();
        const responseSchema = JSON.parse(await response.text());
        
        console.log('Schema 0', schemaExpect);
        console.log('Schema 1', responseSchema);

        const validator = new Ajv();
        const schemaValidated = validator.validate(schemaExpect, responseSchema);
        expect(schemaValidated).toEqual(true);

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

    test('Test para el servicio PUT - Actualizar Usuario', async ({ request })  => {
        const USER_ID = '/2';
        const response = await request.put(resource_url + USER_ID, {
            headers: headerReqRes,
            data: updateUserRequest
        });

        const body = await response.json();

        console.log('Log - Test de Actualizar Usuario')
        console.log('Status Code', response.status());
        
        expect(response.status()).toBe(200);
        expect(body).toHaveProperty('updatedAt');
        expect(body).toHaveProperty('job', updateUserRequest.job); 
    });
});